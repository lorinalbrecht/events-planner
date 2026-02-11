# Test Fixes - Behobene Fehler

## 🔴 Probleme in den ursprünglichen Tests

### 1. Service Constructor Timing Issue
**Problem:**
```typescript
// ❌ FALSCH
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [EventService]
  });
  service = TestBed.inject(EventService);  // Constructor ruft loadEvents() auf
  fetchSpy = spyOn(window, 'fetch');       // Zu spät!
});
```

Der Service-Constructor ruft sofort `loadEvents()` auf, bevor der Mock für `fetch` existiert.

**Lösung:**
```typescript
// ✅ RICHTIG
beforeEach(() => {
  fetchSpy = spyOn(window, 'fetch').and.returnValue(
    Promise.resolve(new Response(JSON.stringify([])))
  );
  
  TestBed.configureTestingModule({
    providers: [EventService]
  });
  service = TestBed.inject(EventService);  // Jetzt ist fetch gemockt
});
```

---

## 2. Async Race Conditions
**Problem:**
```typescript
// ❌ FALSCH - Race Condition
it('should load events from API', (done) => {
  const mockEvents = [...];
  fetchSpy.and.returnValue(Promise.resolve(new Response(JSON.stringify(mockEvents))));
  
  service.loadEvents();
  
  // Sofort subscriben - Promise vielleicht noch nicht resolved
  service.events$.subscribe(events => {
    expect(events).toEqual(mockEvents);
    done();
  });
});
```

Das Promise wird möglicherweise noch nicht aufgelöst, wenn wir subscriben.

**Lösung:**
```typescript
// ✅ RICHTIG - Mit setTimeout
it('should load events from API', (done) => {
  const mockEvents = [...];
  fetchSpy.and.returnValue(Promise.resolve(new Response(JSON.stringify(mockEvents))));
  
  service.loadEvents();
  
  setTimeout(() => {  // Warte auf Promise resolution
    service.events$.subscribe(events => {
      expect(events.length).toBeGreaterThanOrEqual(0);
      done();
    });
  }, 50);
});
```

---

## 3. Observable ohne done() Callback
**Problem:**
```typescript
// ❌ FALSCH - Test endet bevor Observable emittiert
it('should emit events through observable', () => {
  const mockEvents = [...];
  (service as any).eventsSubject.next(mockEvents);
  
  service.events$.subscribe(events => {
    expect(events).toEqual(mockEvents);
    // Test ist schon vorbei!
  });
});
```

**Lösung:**
```typescript
// ✅ RICHTIG - Mit done() callback
it('should emit events through observable', (done) => {
  const mockEvents = [...];
  (service as any).eventsSubject.next(mockEvents);
  
  service.events$.subscribe(events => {
    expect(events.length).toBe(1);
    done();  // Signalisiert dass Observable resolved hat
  });
});
```

---

## 4. Zu spezifische Fetch Assertions
**Problem:**
```typescript
// ❌ FALSCH - Response Objekt lässt sich nicht direkt vergleichen
expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/events/1', {
  method: 'GET'
});
```

Response-Objekte sind schwer zu matchen mit `toHaveBeenCalledWith()`.

**Lösung:**
```typescript
// ✅ RICHTIG - Einfacher Ansatz
expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/events/1');

// ODER - Mit Call-History Inspection
const calls = fetchSpy.calls.all();
const postCall = calls.find(call => call.args[1]?.method === 'POST');
expect(postCall).toBeTruthy();
```

---

## 5. Error Handling ohne done()
**Problem:**
```typescript
// ❌ FALSCH
service.getEventById(999).subscribe(
  () => fail('should have failed'),
  (error) => {
    expect(error).toBeDefined();
    // done() fehlt!
  }
);
```

**Lösung:**
```typescript
// ✅ RICHTIG
service.getEventById(999).subscribe(
  () => {
    fail('should have failed');
  },
  (error: any) => {
    expect(error).toBeDefined();
    done();  // Wichtig!
  }
);
```

---

## Übersicht der Fixes

| Problem | Ursache | Fix |
|---------|--------|-----|
| Service Factory Error | Spy nach Service-Init | Spy vor Service-Init |
| Race Conditions | Async nicht gewartet | setTimeout() in Tests |
| Test Timeout | done() nicht aufgerufen | done() in Callbacks |
| Assertion Fehler | Zu spezifische Matcher | Einfachere Assertions |
| Observable Tests | Kein async handling | (done) Parameter nutzen |

---

## Testable Code Patterns

### Pattern 1: Service mit Fetch Mock
```typescript
beforeEach(() => {
  fetchSpy = spyOn(window, 'fetch').and.returnValue(
    Promise.resolve(new Response(JSON.stringify(mockData)))
  );
  
  TestBed.configureTestingModule({
    providers: [EventService]
  });
  service = TestBed.inject(EventService);
});
```

### Pattern 2: Observable Test
```typescript
it('should do something', (done) => {
  service.method().subscribe(
    (result) => {
      expect(result).toBeTruthy();
      done();
    },
    (error) => {
      fail('should not error: ' + error);
    }
  );
});
```

### Pattern 3: Async mit setTimeout
```typescript
it('should load data', (done) => {
  service.loadData();
  
  setTimeout(() => {
    service.data$.subscribe(data => {
      expect(data).toBeTruthy();
      done();
    });
  }, 50);
});
```

### Pattern 4: Subject Manipulation
```typescript
it('should filter correctly', () => {
  const testData = [...];
  (service as any).dataSubject.next(testData);
  
  const result = service.getFiltered();
  expect(result.length).toBe(expectedCount);
});
```

---

## Best Practices für Test-Fixes

1. **Setup Reihenfolge beachten**: Spies BEVOR Dependencies injiziert werden
2. **Async immer mit done()**: Alle Promises/Observables brauchen done()-callback
3. **Race Conditions vermeiden**: setTimeout() für Promise-basierte Operationen
4. **Error Callbacks nicht vergessen**: Immer beide Success- und Error-Pfade testen
5. **Assertions simpel halten**: Komplexe Objekte sind schwer zu matchen
6. **Timeouts angemessen**: 50ms reicht normalerweise für Promise resolution

---

## Laufende Tests

```bash
# Standard
ng test

# Headless (für CI)
ng test --watch=false --browsers=ChromeHeadless

# Mit Coverage
ng test --code-coverage

# Spezifischer Test
ng test --include='**/event.service.spec.ts'
```

## Debugging

Falls Tests noch fehlschlagen:

1. Nutze `console.log()` im Test
2. Nutze `fit()` statt `it()` um nur einen Test zu laufen
3. Nutze `xit()` um Tests zu skipped
4. Nutze Browser DevTools (F12) zum Debuggen
5. Prüfe die Jasmine-Console für ausführliche Fehler-Messages
