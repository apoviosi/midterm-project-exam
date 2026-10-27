import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader';
import { GymLeader } from '../../models/gym-leader';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderFormComponent implements OnInit {
  private leaderService = inject(GymLeaderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  leaderId: string | null = null;

  leader: GymLeader = {
    name: '',
    region: 'Kanto',
    town: '',
    badge: '',
    specialty: '',
    aceLevel: 1,
    motto: ''
  };

  ngOnInit(): void {
    this.leaderId = this.route.snapshot.paramMap.get('id');
    if (this.leaderId) {
      this.isEditMode = true;
      this.leaderService.getLeader(this.leaderId).subscribe({
        next: (data) => (this.leader = data),
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.leaderId) {
      this.leaderService.updateLeader(this.leaderId, this.leader).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => console.error(err)
      });
    } else {
      this.leaderService.createLeader(this.leader).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => console.error(err)
      });
    }
  }
}

// Alias export to guarantee compatibility with AppRoutes
export { LeaderFormComponent as LeaderForm };