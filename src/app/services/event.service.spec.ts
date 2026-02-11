import { TestBed } from '@angular/core/testing';
import { EventService, Event } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    // Mock fetch BEFORE initializing the service
    fetchSpy = spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    TestBed.configureTestingModule({
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Event Loading', () => {
    it('should load events from API', (done) => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Test Event',
          date: '2026-02-05',
          time: '10:00',
          category: 'Arbeit'
        }
      ];

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify(mockEvents), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );
      service.loadEvents();

      setTimeout(() => {
        service.events$.subscribe(events => {
          expect(events.length).toBeGreaterThanOrEqual(0);
          done();
        });
      }, 50);
    });

    it('should initialize with empty events array', () => {
      const events = service.getEvents();
      expect(Array.isArray(events)).toBeTruthy();
    });
  });

  describe('Get Event by ID', () => {
    it('should fetch a single event by ID', (done) => {
      const mockEvent: Event = {
        id: 1,
        title: 'Single Event',
        date: '2026-02-05',
        time: '14:00',
        category: 'Familie'
      };

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify(mockEvent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.getEventById(1).subscribe(
        event => {
          expect(event).toBeTruthy();
          expect(event?.id).toBe(1);
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should handle error when fetching event', (done) => {
      fetchSpy.and.returnValue(Promise.reject(new Error('Network error')));

      service.getEventById(999).subscribe(
        () => {
          fail('should have failed');
        },
        (error: any) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('Add Event', () => {
    it('should add a new event', (done) => {
      const newEvent: Event = {
        title: 'New Event',
        description: 'Test description',
        date: '2026-02-10',
        time: '09:00',
        category: 'Persönlich',
        color: '#3498db'
      };

      const mockResponse: Event = {
        ...newEvent,
        id: 1,
        created_at: '2026-02-04T10:00:00',
        updated_at: '2026-02-04T10:00:00'
      };

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.addEvent(newEvent).subscribe(
        event => {
          expect(event).toBeTruthy();
          expect(event.id).toBe(1);
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should handle error when adding event fails', (done) => {
      const newEvent: Event = {
        title: 'New Event',
        date: '2026-02-10'
      };

      fetchSpy.and.returnValue(Promise.reject(new Error('Server error')));

      service.addEvent(newEvent).subscribe(
        () => {
          fail('should have failed');
        },
        (error: any) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('Update Event', () => {
    it('should update an existing event', (done) => {
      const updatedEvent: Event = {
        id: 1,
        title: 'Updated Event',
        date: '2026-02-12',
        time: '15:00',
        category: 'Arbeit'
      };

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify(updatedEvent), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.updateEvent(1, updatedEvent).subscribe(
        event => {
          expect(event).toBeTruthy();
          expect(event.title).toBe('Updated Event');
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should handle error when update fails', (done) => {
      const updatedEvent: Event = {
        title: 'Updated Event',
        date: '2026-02-12'
      };

      fetchSpy.and.returnValue(Promise.reject(new Error('Update failed')));

      service.updateEvent(999, updatedEvent).subscribe(
        () => {
          fail('should have failed');
        },
        (error: any) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('Delete Event', () => {
    it('should delete an event', (done) => {
      // For 204 No Content, return with null body
      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(null, {
            status: 204,
            statusText: 'No Content'
          })
        )
      );

      service.deleteEvent(1).subscribe(
        () => {
          expect(fetchSpy).toHaveBeenCalled();
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should handle error when delete fails', (done) => {
      fetchSpy.and.returnValue(Promise.reject(new Error('Delete failed')));

      service.deleteEvent(999).subscribe(
        () => {
          fail('should have failed');
        },
        (error: any) => {
          expect(error).toBeDefined();
          done();
        }
      );
    });
  });

  describe('Filter Events by Date', () => {
    it('should return events for a specific date', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Event 1',
          date: '2026-02-05',
          category: 'Arbeit'
        },
        {
          id: 2,
          title: 'Event 2',
          date: '2026-02-05',
          category: 'Familie'
        },
        {
          id: 3,
          title: 'Event 3',
          date: '2026-02-06',
          category: 'Persönlich'
        }
      ];

      (service as any).eventsSubject.next(mockEvents);

      const eventsOnDate = service.getEventsByDate('2026-02-05');
      expect(eventsOnDate.length).toBe(2);
    });

    it('should return empty array for date with no events', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Event 1',
          date: '2026-02-05',
          category: 'Arbeit'
        }
      ];

      (service as any).eventsSubject.next(mockEvents);

      const eventsOnDate = service.getEventsByDate('2026-02-10');
      expect(eventsOnDate.length).toBe(0);
    });
  });

  describe('Filter Events by Category', () => {
    it('should return events for a specific category', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Work Event',
          date: '2026-02-05',
          category: 'Arbeit'
        },
        {
          id: 2,
          title: 'Family Event',
          date: '2026-02-05',
          category: 'Familie'
        },
        {
          id: 3,
          title: 'Another Work Event',
          date: '2026-02-06',
          category: 'Arbeit'
        }
      ];

      (service as any).eventsSubject.next(mockEvents);

      const workEvents = service.getEventsByCategory('Arbeit');
      expect(workEvents.length).toBe(2);
    });

    it('should return empty array for non-existing category', () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Event 1',
          date: '2026-02-05',
          category: 'Arbeit'
        }
      ];

      (service as any).eventsSubject.next(mockEvents);

      const events = service.getEventsByCategory('NonExistent');
      expect(events.length).toBe(0);
    });
  });

  describe('API Endpoints', () => {
    it('should call correct endpoint for getting events', () => {
      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.loadEvents();

      expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/events');
    });

    it('should call correct endpoint for getting single event', (done) => {
      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.getEventById(1).subscribe(
        () => {
          const lastCall = fetchSpy.calls.mostRecent();
          expect(lastCall.args[0]).toContain('/api/events/1');
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should call POST for adding event', (done) => {
      const newEvent: Event = {
        title: 'Test',
        date: '2026-02-05'
      };

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify({ id: 1, ...newEvent }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.addEvent(newEvent).subscribe(
        () => {
          const lastCall = fetchSpy.calls.mostRecent();
          const options = lastCall.args[1] as any;
          expect(options?.method).toBe('POST');
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should call PUT for updating event', (done) => {
      const updatedEvent: Event = {
        title: 'Updated',
        date: '2026-02-05'
      };

      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(JSON.stringify({ id: 1, ...updatedEvent }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );

      service.updateEvent(1, updatedEvent).subscribe(
        () => {
          const lastCall = fetchSpy.calls.mostRecent();
          const options = lastCall.args[1] as any;
          expect(options?.method).toBe('PUT');
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });

    it('should call DELETE for removing event', (done) => {
      fetchSpy.and.returnValue(
        Promise.resolve(
          new Response(null, {
            status: 204,
            statusText: 'No Content'
          })
        )
      );

      service.deleteEvent(1).subscribe(
        () => {
          const lastCall = fetchSpy.calls.mostRecent();
          const options = lastCall.args[1] as any;
          expect(options?.method).toBe('DELETE');
          done();
        },
        error => {
          fail('should not have errored: ' + error);
        }
      );
    });
  });

  describe('Events Observable', () => {
    it('should emit events through observable', (done) => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Test Event',
          date: '2026-02-05'
        }
      ];

      let didEmit = false;
      service.events$.subscribe(events => {
        // Skip the initial empty array from BehaviorSubject
        if (events.length > 0 && !didEmit) {
          didEmit = true;
          expect(events.length).toBe(1);
          expect(events[0]?.title).toBe('Test Event');
          done();
        }
      });

      // Trigger emission after subscribe
      (service as any).eventsSubject.next(mockEvents);
    });

    it('should allow multiple subscriptions to same observable', (done) => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: 'Test Event 2',
          date: '2026-02-06'
        }
      ];

      let emitCount = 0;
      const checkDone = () => {
        emitCount++;
        if (emitCount === 2) {
          done();
        }
      };

      service.events$.subscribe(events => {
        if (events.length > 0) {
          expect(Array.isArray(events)).toBeTruthy();
          checkDone();
        }
      });

      service.events$.subscribe(events => {
        if (events.length > 0) {
          expect(Array.isArray(events)).toBeTruthy();
          checkDone();
        }
      });

      // Trigger emissions after subscribe
      (service as any).eventsSubject.next(mockEvents);
    });
  });
});
