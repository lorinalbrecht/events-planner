# EventPlanner mit SQLite-Datenspeicherung

Eine vollständige Angular-Anwendung zum Verwalten von Events mit lokaler SQLite-Datenbankunterstützung.

## Features

✅ **Event-Management**: Erstellen, Bearbeiten, Löschen von Events  
✅ **Lokale Speicherung**: SQLite-Datenbank (events.db)  
✅ **Kategorisierung**: Arbeit, Persönlich, Familie, Freizeit, Sonstiges  
✅ **Filterung**: Nach Kategorie und Suchtext  
✅ **Color-Coding**: Verschiedene Farben für Events  
✅ **Responsive Design**: Mobile-friendly Benutzeroberfläche  
✅ **Unit Tests**: Umfassende Tests für den EventService  

## Projektstruktur

```
events-planner/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── event-list/          # Event-Liste mit Filtern
│   │   │   └── event-form/          # Event-Formular (Add/Edit)
│   │   └── services/
│   │       └── event.service.ts     # Service mit CRUD-Operationen
│   ├── main.ts
│   └── index.html
├── server.ts                        # Node.js/Express Backend
├── data/
│   └── events.db                    # SQLite Datenbank
├── TEST_DOCUMENTATION.md            # Test-Dokumentation
└── package.json
```

## Installation & Starten

### Voraussetzungen
- Node.js 18+
- npm 9+

### Setup

```bash
# Klone das Projekt
git clone <repo-url>
cd events-planner

# Installiere Dependencies
npm install
```

### Anwendung starten

```bash
# Startet Frontend (Port 4200) und Backend (Port 3000) gleichzeitig
npm start
```

Das Backend und Frontend starten automatisch:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **Datenbank**: `data/events.db`

## Verwendung

### Events verwalten

1. **Neues Event erstellen**: Klicke auf "+ Neues Event" oder navigiere zu `/add`
2. **Event bearbeiten**: Klicke auf das ✏️-Symbol neben einem Event
3. **Event löschen**: Klicke auf 🗑️ und bestätige
4. **Events filtern**: 
   - Nach Kategorie: Wähle eine Kategorie oben aus
   - Nach Text: Nutze die Suchfunktion

### Formularfelder

- **Titel*** (erforderlich): Name des Events
- **Beschreibung**: Optionale Detailinformationen
- **Datum*** (erforderlich): Wann ist das Event
- **Uhrzeit**: Optionale Zeitangabe
- **Ort**: Optionaler Ort/Richtung
- **Kategorie**: Wähle eine der 5 Kategorien
- **Farbe**: Passe die Farbe des Event-Cards an

*= Erforderlich

## Testing

### Unit Tests ausführen

```bash
# Tests mit Watch-Mode (für Entwicklung)
ng test

# Tests ohne Watch (für CI/CD)
ng test --watch=false --browsers=ChromeHeadless

# Mit Code-Coverage
ng test --code-coverage
```

### Test-Struktur

Der EventService hat umfassende Tests für:
- ✅ CRUD-Operationen (Create, Read, Update, Delete)
- ✅ Event-Filterung (nach Datum und Kategorie)
- ✅ Observable-Funktionalität
- ✅ API-Endpoint-Validierung
- ✅ Fehlerbehandlung

Siehe [TEST_DOCUMENTATION.md](TEST_DOCUMENTATION.md) für detaillierte Informationen.

## API Endpoints

| Methode | Endpoint | Beschreibung |
|---------|----------|-------------|
| GET | `/api/events` | Alle Events abrufen |
| GET | `/api/events/:id` | Ein Event abrufen |
| POST | `/api/events` | Neues Event erstellen |
| PUT | `/api/events/:id` | Event aktualisieren |
| DELETE | `/api/events/:id` | Event löschen |
| GET | `/api/events/date/:date` | Events nach Datum |
| GET | `/api/events/category/:category` | Events nach Kategorie |

## Entwicklung

### Code scaffolding

```bash
# Neue Komponente erstellen
ng generate component components/my-component

# Neuen Service erstellen
ng generate service services/my-service
```

### Build

```bash
# Development Build
ng build

# Production Build
ng build --configuration production
```

## Datenbank

### Tabellen-Schema

```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT NOT NULL,
  time TEXT,
  category TEXT,
  color TEXT DEFAULT '#3498db',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Die Datenbank wird automatisch beim ersten Start erstellt.

## Technologie-Stack

- **Frontend**: Angular 20.3+
- **Backend**: Node.js + Express.js
- **Datenbank**: SQLite3 (better-sqlite3)
- **Styling**: CSS3
- **Testing**: Jasmine + Karma
- **TypeScript**: 5.9+

## Browser-Support

- Chrome/Chromium
- Firefox
- Safari
- Edge

## Lizenz

MIT

## Support

Für Probleme oder Fragen, erstelle bitte ein Issue im Repository.


For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
