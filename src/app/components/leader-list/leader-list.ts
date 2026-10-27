import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader';
import { GymLeader } from '../../models/gym-leader';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderListComponent implements OnInit {
  private leaderService = inject(GymLeaderService);
  
  leaders: GymLeader[] = [];
  selectedRegion: string = 'All';
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadLeaders();
  }

  loadLeaders(): void {
    this.leaderService.getLeaders().subscribe({
      next: (data) => {
        this.leaders = data;
      },
      error: (err) => console.error(err)
    });
  }

  deleteLeader(id?: string): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this gym leader?')) {
      this.leaderService.deleteLeader(id).subscribe({
        next: () => {
          this.leaders = this.leaders.filter((l) => l._id !== id);
        },
        error: (err) => console.error(err)
      });
    }
  }

  filterRegion(region: string): void {
    this.selectedRegion = region;
  }

  // --- Statistics Helpers for Commit 6 ---
  get totalLeaders(): number {
    return this.leaders.length;
  }

  getKantoCount(): number {
    return this.leaders.filter(l => l.region?.toLowerCase() === 'kanto').length;
  }

  getJohtoCount(): number {
    return this.leaders.filter(l => l.region?.toLowerCase() === 'johto').length;
  }

  getHoennCount(): number {
    return this.leaders.filter(l => l.region?.toLowerCase() === 'hoenn').length;
  }

  get filteredLeaders(): GymLeader[] {
    return this.leaders.filter((l) => {
      const matchesRegion = this.selectedRegion === 'All' || l.region?.toLowerCase() === this.selectedRegion.toLowerCase();
      const query = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        l.name?.toLowerCase().includes(query) || 
        l.town?.toLowerCase().includes(query) ||
        l.specialty?.toLowerCase().includes(query);

      return matchesRegion && matchesSearch;
    });
  }
}