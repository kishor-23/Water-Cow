---
sidebar_position: 8
title: Backup & Restore
---

# Backup & Restore

Water Cow allows users to export all their data as a JSON file and import it back later.

## Export Flow

```mermaid
sequenceDiagram
    participant User
    participant SettingsScreen
    participant backup.ts
    participant AsyncStorage
    participant ExpoFileSystem
    participant ExpoSharing

    User->>SettingsScreen: Tap "Export Data"
    SettingsScreen->>backup.ts: exportBackup()
    backup.ts->>AsyncStorage: Read all data keys
    AsyncStorage-->>backup.ts: entries, profile, settings, history
    backup.ts->>backup.ts: Build JSON object
    backup.ts->>ExpoFileSystem: writeAsStringAsync(tempFile, json)
    backup.ts->>ExpoSharing: shareAsync(tempFile)
    ExpoSharing-->>User: Android Share Sheet (save to Drive, send via email, etc.)
```

## Import Flow

```mermaid
sequenceDiagram
    participant User
    participant SettingsScreen
    participant backup.ts
    participant ExpoDocumentPicker
    participant ExpoFileSystem
    participant AsyncStorage
    participant HydrationContext

    User->>SettingsScreen: Tap "Import Data"
    SettingsScreen->>ExpoDocumentPicker: pickDocument()
    ExpoDocumentPicker-->>SettingsScreen: Selected file URI
    SettingsScreen->>backup.ts: importBackup(uri)
    backup.ts->>ExpoFileSystem: readAsStringAsync(uri)
    ExpoFileSystem-->>backup.ts: JSON string
    backup.ts->>backup.ts: Parse and validate JSON
    backup.ts->>AsyncStorage: Write all data keys
    backup.ts->>HydrationContext: Reload state
    HydrationContext-->>User: Data restored, UI updated
```

## Backup File Format

The exported JSON file contains:

```json
{
  "version": 1,
  "exportDate": "2026-09-14T08:00:00.000Z",
  "profile": {
    "name": "Buddy",
    "unit": "ml",
    "dailyGoal": 2000
  },
  "reminderSettings": {
    "enabled": true,
    "intervalMinutes": 60,
    "startHour": 8,
    "startMinute": 0,
    "endHour": 22,
    "endMinute": 0,
    "sound": "cow_moo",
    "vibrate": true
  },
  "history": [
    {
      "date": "2026-09-14",
      "totalConsumed": 1750,
      "dailyGoal": 2000,
      "entries": [
        { "id": "abc123", "amount": 250, "timestamp": 1726300800000 }
      ]
    }
  ]
}
```

## Dependencies Used

| Package | Purpose |
|---------|---------|
| `expo-file-system` | Write the JSON backup to a temporary file |
| `expo-sharing` | Open the Android Share Sheet to save/send the file |
| `expo-document-picker` | Open a file picker to select a backup file for import |

## Validation

On import, the backup module validates:
- The file is valid JSON
- The `version` field exists
- Required fields (`profile`, `reminderSettings`, `history`) are present
- Data types are correct (numbers are numbers, strings are strings)

Invalid files show an error message to the user.
