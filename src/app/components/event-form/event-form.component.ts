import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    category: '',
    color: '#3498db'
  };

  isEditMode = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  categories = ['Arbeit', 'Persönlich', 'Familie', 'Freizeit', 'Sonstiges'];
  colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadEvent(parseInt(id));
    }
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (event: Event | undefined) => {
        if (event) {
          this.event = event;
        }
      },
      error: (error: any) => {
        console.error('Error loading event:', error);
        this.errorMessage = 'Event konnte nicht geladen werden';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.event.id) {
      this.eventService.updateEvent(this.event.id!, this.event).subscribe({
        next: () => {
          this.successMessage = 'Event erfolgreich aktualisiert!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error updating event:', error);
          this.errorMessage = 'Fehler beim Aktualisieren des Events';
          this.isSubmitting = false;
        }
      });
    } else {
      this.eventService.addEvent(this.event).subscribe({
        next: () => {
          this.successMessage = 'Event erfolgreich erstellt!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error creating event:', error);
          this.errorMessage = 'Fehler beim Erstellen des Events';
          this.isSubmitting = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.event.title || this.event.title.trim() === '') {
      this.errorMessage = 'Event-Titel ist erforderlich';
      return false;
    }

    if (!this.event.date) {
      this.errorMessage = 'Datum ist erforderlich';
      return false;
    }

    return true;
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
