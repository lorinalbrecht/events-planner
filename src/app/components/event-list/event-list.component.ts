import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';

  allCategories: string[] = [];
  categories = ['Arbeit', 'Persönlich', 'Familie', 'Freizeit', 'Sonstiges'];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.allCategories = ['all', ...this.categories];
    this.eventService.events$.subscribe((events: Event[]) => {
      this.events = events;
      this.filterEvents();
    });
  }

  filterEvents(): void {
    let filtered = this.events;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    this.filteredEvents = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterEvents();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterEvents();
  }

  deleteEvent(id: number | undefined): void {
    if (id && confirm('Möchtest du dieses Event wirklich löschen?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.eventService.loadEvents();
        },
        error: (error: any) => {
          console.error('Error deleting event:', error);
          alert('Fehler beim Löschen des Events');
        }
      });
    }
  }

  getColorStyle(color: string | undefined): { 'border-left-color': string } {
    return { 'border-left-color': color || '#3498db' };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
