# EventService Unit Tests

## Übersicht

Diese Datei enthält umfassende Unit-Tests für den `EventService`. Die Tests decken alle wichtigen Funktionen des Services ab:

- ✅ Event-Laden
- ✅ Event erstellen (POST)
- ✅ Event abrufen (GET)
- ✅ Event aktualisieren (PUT)
- ✅ Event löschen (DELETE)
- ✅ Events filtern nach Datum
- ✅ Events filtern nach Kategorie
- ✅ Observable-Funktionalität
- ✅ API-Endpoint-Validierung
- ✅ Fehlerbehandlung

## Tests ausführen

### Mit Angular CLI:
```bash
ng test
```

### Mit Watch-Mode (für Entwicklung):
```bash
ng test --watch=true
```

### Mit Code-Coverage:
```bash
ng test --code-coverage
```

### Headless (für CI/CD):
```bash
ng test --watch=false --browsers=ChromeHeadless
```

## Test-Abschnitte

### 1. Event Loading (`Event Loading`)
- **should load events from API**: Testet das Laden von Events vom Backend
- **should initialize with empty events array**: Überprüft die Initialisierung

### 2. Event by ID abrufen (`Get Event by ID`)
- **should fetch a single event by ID**: Testet das Abrufen eines einzelnen Events
- **should handle error when fetching event**: Testet die Fehlerbehandlung

### 3. Event erstellen (`Add Event`)
- **should add a new event**: Testet das Erstellen eines neuen Events
- **should handle error when adding event fails**: Testet Fehlerszenarien

### 4. Event aktualisieren (`Update Event`)
- **should update an existing event**: Testet das Aktualisieren eines Events
- **should handle error when update fails**: Testet Fehlerbehandlung bei Update

### 5. Event löschen (`Delete Event`)
- **should delete an event**: Testet das Löschen eines Events
- **should handle error when delete fails**: Testet Fehlerbehandlung beim Löschen

### 6. Filtern nach Datum (`Filter Events by Date`)
- **should return events for a specific date**: Testet die Datums-Filterung
- **should return empty array for date with no events**: Testet mit leeren Ergebnissen

### 7. Filtern nach Kategorie (`Filter Events by Category`)
- **should return events for a specific category**: Testet die Kategoriefilterung
- **should return empty array for non-existing category**: Testet mit leeren Ergebnissen

### 8. API-Endpoints (`API Endpoints`)
- Validiert, dass die korrekten API-Endpoints aufgerufen werden
- Überprüft HTTP-Methoden und Header

### 9. Events Observable (`Events Observable`)
- **should emit events through observable**: Testet die Observable-Funktionalität
- **should multiple subscriptions receive same data**: Testet mehrere Abonnements

## Mocking

Der Service verwendet `fetch` zum Kommunizieren mit dem Backend. Alle Tests mocken die `fetch`-Funktion mit Jasmine's `spyOn`:

```typescript
fetchSpy = spyOn(window, 'fetch');
fetchSpy.and.returnValue(Promise.resolve(new Response(JSON.stringify(mockData))));
```

## Code Coverage

Nach dem Ausführen mit `--code-coverage` findest du den Report unter:
```
coverage/
```

## Beispiel: Test manuell ausführen

```bash
# Im Projekt-Verzeichnis:
cd c:\DEV\events-planner

# Tests ausführen
ng test

# Chrome Browser sollte sich öffnen
# Tests werden ausgeführt und live-reloaded bei Code-Änderungen
```

## Integration mit CI/CD

Für GitHub Actions oder ähnliche CI/CD-Systeme:

```yaml
- name: Run Tests
  run: ng test --watch=false --code-coverage --browsers=ChromeHeadless
```

## Test-Struktur

```
EventService
├── should be created
├── Event Loading
│   ├── should load events from API
│   └── should initialize with empty events array
├── Get Event by ID
│   ├── should fetch a single event by ID
│   └── should handle error when fetching event
├── Add Event
│   ├── should add a new event
│   └── should handle error when adding event fails
├── Update Event
│   ├── should update an existing event
│   └── should handle error when update fails
├── Delete Event
│   ├── should delete an event
│   └── should handle error when delete fails
├── Filter Events by Date
│   ├── should return events for a specific date
│   └── should return empty array for date with no events
├── Filter Events by Category
│   ├── should return events for a specific category
│   └── should return empty array for non-existing category
├── API Endpoints
│   ├── should call correct endpoint for getting events
│   ├── should call correct endpoint for getting single event
│   ├── should call correct endpoint for adding event
│   └── should call correct endpoint for updating event
└── Events Observable
    ├── should emit events through observable
    └── should multiple subscriptions receive same data
```

## Best Practices

1. **Isolation**: Jeder Test ist unabhängig und testet nur eine Sache
2. **Mocking**: Backend-Calls werden mit spyOn gemockt
3. **Cleanup**: beforeEach stellt sicher, dass jeder Test mit sauberen Mocks startet
4. **Assertions**: Klare Erwartungen mit `expect()`
5. **Fehlerbehandlung**: Tests decken sowohl Success- als auch Error-Szenarien ab

## Debugging

Zum Debuggen von Tests:

```bash
# Mit detaillierterer Ausgabe
ng test --browsers=Chrome --watch=true

# Dann im Browser-DevTools debuggen (F12)
```

## Weitere Ressourcen

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [TestBed API](https://angular.dev/api/core/testing/TestBed)
