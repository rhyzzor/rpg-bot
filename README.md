# RPG Discord Bot

A Discord bot for managing RPG character sheets, items, and classes.

## Commands

This bot supports both English and Portuguese languages. Below are the available commands:

### Character Sheet Commands

| Command | Description | Usage | Example | Admin Only |
|---------|-------------|-------|---------|-----------|
| `/sheet` | View a character sheet | `/sheet <sheet_id> <show: yes/no>` | `/sheet 42 yes` | No |
| `/update-attribute` | Update an attribute of your sheet | `/update-attribute <attribute> <quantity>` | `/update-attribute strength 3` | No |
| `/create-sheet` | Create a new character sheet | `/create-sheet <class> [user]` | `/create-sheet 2 @Username` | Yes |
| `/edit-sheet` | Edit an existing character sheet | `/edit-sheet <sheet_id>` | `/edit-sheet 42` | Yes |
| `/reset-sheet` | Reset a character sheet (Inventory, Attributes, Level) | `/reset-sheet <sheet_id>` | `/reset-sheet 42` | Yes |
| `/send-points` | Send attribute points to a character | `/send-points <sheet_id> <quantity>` | `/send-points 42 5` | Yes |
| `/set-attribute` | Set an attribute value of any character sheet | `/set-attribute <sheet_id> <attribute> <points>` | `/set-attribute 42 strength 16` | Yes |
| `/restore` | Restore HP and Mana of a character | `/restore <sheet_id> <mana> <hp>` | `/restore 42 100 150` | Yes |
| `/combat` | Register Mana and HP spent in combat | `/combat <sheet_id> <mana> <hp>` | `/combat 42 15 25` | Yes |
| `/change-class` | Change the class of a character sheet | `/change-class <sheet_id> <class_id>` | `/change-class 42 3` | Yes |

### Item Commands

| Command | Description | Usage | Example | Admin Only |
|---------|-------------|-------|---------|-----------|
| `/item` | View information about an item | `/item <item_id>` | `/item 24` | No |
| `/create-item` | Create a new item | `/create-item` | `/create-item` | Yes |
| `/update-inventory` | Update a character's inventory | `/update-inventory <sheet_id> <item_id> <quantity>` | `/update-inventory 42 24 3` | Yes |

### Class Commands

| Command | Description | Usage | Example | Admin Only |
|---------|-------------|-------|---------|-----------|
| `/class` | View information about a class | `/class <class_name>` | `/class warrior` | No |

## Admin Commands

Commands marked as "Admin Only" require administrator permissions on the Discord server to use.
