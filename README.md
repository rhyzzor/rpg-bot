# RPG Bot

A Discord bot designed to enhance tabletop RPG experiences by managing character sheets, inventories, and facilitating game mechanics.

## Development Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Getting Started

### Inviting the Bot

1. Use this invite link to add the bot to your Discord server
2. Ensure the bot has proper permissions (Send Messages, Use Slash Commands, Embed Links)
3. Set up admin roles in your server for bot administration

### Initial Setup

1. Use `/create-sheet` to create your first character
2. Create items with `/create-item` that players can obtain
3. Grant admin permissions to your game master(s)

## Commands Guide

### Player Commands

#### Character Management

##### `/sheet [sheet] [show]`
View your character sheet or any other available sheet.
- `sheet`: Character to view (defaults to your own)
- `show`: Whether to show the sheet publicly ("Yes"/"No")

Example: `/sheet show:No`

##### `/update-attribute [attribute] [value]`
Update one of your character's attributes.
- `attribute`: The attribute to modify (e.g., "Strength", "Intelligence")
- `value`: New value for the attribute

Example: `/update-attribute attribute:Strength value:15`

#### Character Combat

##### `/restore [sheet]`
Restore your character's HP and Mana to full.
- `sheet`: Character to restore (defaults to your own)

Example: `/restore`

### Admin Commands

#### Character Management

##### `/create-sheet [class]`
Create a new character sheet.
- `class`: Character class (Warrior, Mage, etc.)

Example: `/create-sheet class:Warrior`

##### `/edit-sheet [sheet]`
Edit an existing character sheet with a comprehensive form.
- `sheet`: Character sheet to edit

Example: `/edit-sheet sheet:Alex's Warrior`

##### `/change-class [sheet] [class]`
Change a character's class, which affects their abilities and stats.
- `sheet`: Character to modify
- `class`: New class to assign

Example: `/change-class sheet:Alex's Warrior class:Mage`

##### `/reset-sheet [sheet]`
Reset a character sheet to starting values (inventory, attributes, level).
- `sheet`: Character sheet to reset

Example: `/reset-sheet sheet:Alex's Warrior`

##### `/set-attribute [sheet] [attribute] [value]`
Set a specific attribute value for any character.
- `sheet`: Character to modify
- `attribute`: Attribute to change
- `value`: New value

Example: `/set-attribute sheet:Alex's Warrior attribute:Strength value:18`

##### `/send-points [sheet] [quantity]`
Send experience/skill points to a character.
- `sheet`: Character to receive points
- `quantity`: Number of points to send

Example: `/send-points sheet:Alex's Warrior quantity:5`

##### `/combat [sheet]`
Track and manage HP and Mana expenditure during combat.
- `sheet`: Character involved in combat

Example: `/combat sheet:Alex's Warrior`

#### Inventory Management

##### `/update-inventory [sheet]`
Modify a character's inventory by adding or removing items.
- `sheet`: Character whose inventory to update

Example: `/update-inventory sheet:Alex's Warrior`

#### Item Management

##### `/item [name]`
View details about a specific item in the game.
- `name`: Item to look up

Example: `/item name:Health Potion`

##### `/create-item`
Create a new item for the game with customizable properties.
- Opens a form to input item details

Example: `/create-item`

## Advanced Usage Tips

### Character Sheet Management
- Players should use `/sheet` regularly to monitor their progression
- GMs can use `/set-attribute` for story-based bonuses or penalties
- Use `/restore` after resting periods in your campaign

### Combat System
1. Initiate combat with `/combat`
2. Track damage and healing as the battle progresses
3. Update attributes and inventory after combat concludes

### Inventory System
- Players can view their inventory with the `/sheet` command
- GMs can add loot with `/update-inventory`
- Create custom items with `/create-item` to match your world's theme

## Troubleshooting

- **Bot not responding**: Ensure proper permissions are set
- **Cannot edit attributes**: Check if you have the required points
- **Missing sheets**: Use `/sheet` without parameters to see all available sheets

## Support

If you encounter any issues with the bot, please:
1. Check the troubleshooting section above
2. Join our support server for help
3. Report bugs through our issue tracker

---

Enjoy enhancing your tabletop RPG experience with RPG Bot!
