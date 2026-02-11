import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Event {
  id?: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  time?: string;
  category?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api';

  constructor() {
    this.loadEvents();
  }

  loadEvents(): void {
    fetch(`${this.apiUrl}/events`)
      .then(res => res.json())
      .then(data => this.eventsSubject.next(data))
      .catch(error => console.error('Error loading events:', error));
  }

  getEvents(): Event[] {
    return this.eventsSubject.value;
  }

  getEventById(id: number): Observable<Event | undefined> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/events/${id}`)
        .then(res => res.json())
        .then(data => {
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          console.error('Error loading event:', error);
          observer.error(error);
        });
    });
  }

  addEvent(event: Event): Observable<Event> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
        .then(res => res.json())
        .then(data => {
          const currentEvents = this.eventsSubject.value;
          this.eventsSubject.next([...currentEvents, data]);
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          console.error('Error adding event:', error);
          observer.error(error);
        });
    });
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
        .then(res => res.json())
        .then(data => {
          const currentEvents = this.eventsSubject.value;
          const updated = currentEvents.map(e => (e.id === id ? data : e));
          this.eventsSubject.next(updated);
          observer.next(data);
          observer.complete();
        })
        .catch(error => {
          console.error('Error updating event:', error);
          observer.error(error);
        });
    });
  }

  deleteEvent(id: number): Observable<void> {
    return new Observable(observer => {
      fetch(`${this.apiUrl}/events/${id}`, {
        method: 'DELETE'
      })
        .then(() => {
          const currentEvents = this.eventsSubject.value;
          this.eventsSubject.next(currentEvents.filter(e => e.id !== id));
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.error('Error deleting event:', error);
          observer.error(error);
        });
    });
  }

  getEventsByDate(date: string): Event[] {
    return this.eventsSubject.value.filter(e => e.date === date);
  }

  getEventsByCategory(category: string): Event[] {
    return this.eventsSubject.value.filter(e => e.category === category);
  }
}
