import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';

@Component({
  selector: 'app-pokemon-form',
  imports: [ReactiveFormsModule],
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  protected pokemonService = inject(Pokemon);
  
  // Track if we are editing an existing record
  protected editingId = signal<string | null>(null);

  protected pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  protected onSubmit() {
    if (this.pokemonForm.invalid) {
      this.pokemonForm.markAllAsTouched();
      return;
    }

    const formData = this.pokemonForm.getRawValue();
    const currentId = this.editingId();

    if (currentId) {
      // Update existing
      this.pokemonService.updatePokemon(currentId, formData).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.resetForm();
        },
      });
    } else {
      // Create new
      this.pokemonService.savePokemon(formData).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.resetForm();
        },
      });
    }
  }

  protected editPokemon(pokemon: any) {
    this.editingId.set(pokemon._id);
    this.pokemonForm.patchValue({
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      nature: pokemon.nature
    });
  }

  protected deletePokemon(id: string) {
    this.pokemonService.deletePokemon(id).subscribe({
      next: () => {
        this.pokemonService.fetchPokemon();
        // If user deletes the Pokemon they are currently editing, reset the form
        if (this.editingId() === id) {
          this.resetForm();
        }
      }
    });
  }

  protected resetForm() {
    this.pokemonForm.reset();
    this.editingId.set(null);
  }
}