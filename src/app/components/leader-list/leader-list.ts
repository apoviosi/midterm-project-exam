import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../../services/gym-leader';
import { GymLeader } from '../../models/gym-leader';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderListComponent implements OnInit {
  private leaderService = inject(GymLeaderService);
  
  leaders: GymLeader[] = [];
  selectedRegion: string = 'All';

  ngOnInit(): void {
    this.loadLeaders();
  }

  loadLeaders(): void {
    this.leaderService.getLeaders().subscribe({
      next: (data) => {
        // Create a new array reference to force Angular's change detection to pick up the update instantly
        this.leaders = [...data];
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

  get filteredLeaders(): GymLeader[] {
    if (this.selectedRegion === 'All') {
      return this.leaders;
    }
    return this.leaders.filter(
      (l) => l.region?.toLowerCase() === this.selectedRegion.toLowerCase()
    );
  }
}