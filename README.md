# Java,React tower defence game

#  Tower Defense Game (React + Phaser)

Welcome to the Tower Defense Game project!  
This is a modern tower defense game built using **React** for UI and game flow and **Phaser 3** for all in-game rendering, logic, and gameplay.

---

##  Features

 **Map Editor** → Easily create custom maps with layered tiles and pathing (uses in-game editor)  
 **Auto Path Ordering** → Automatically generates walkable enemy paths from map data  
 **Dynamic Enemy System** → Grunt, Fast, Brute, Boss enemies with path-following AI  
 **Tower Building System** → Placeable towers with unique attacks and upgrade paths  
 **Tower Upgrades** →  
- Each tower type has 3 upgrade paths (Top, Middle, Bottom)
- Upgrade up to Tier 3 with unique abilities
- Locked paths based on your upgrade choices (Radio-style branching)

 **Special Abilities** →  
- Fireball → Direct hit + Damage over Time  
- Inferno → Heavy DoT on T3  
- Chain Lightning → Hits multiple enemies  
- Blizzard → AoE freeze  
- Heavy Shot → Knockback and bounce shots  
- SlowShot → Slow enemies + advanced version with debuff  
- Knockback → Push enemies

**Round System**  
- Custom wave configuration per round (loaded from `waves.ts`)  
- Auto wave spawning  
- Round tracker and HUD integration  
- Dynamic max rounds based on game data

 **Game HUD**  
- Displays money, lives, current round, max rounds  
- Floating Upgrade Panel and Tower Selector UI  
- Centered title with subtle glow

 **Victory / Game Over**  
- Lose lives → Game Over screen  
- Win all rounds → Victory screen (optional)

---

## Technologies

- **React + TypeScript** → UI and State Management
- **Phaser 3** → Game engine for rendering and gameplay
- **EventBus** → Custom global event handling
- **Custom Level Editor** → In-game editor with tile palettes
- **Modular Systems** → Attack Strategies, Towers, Upgrades, Enemies

---

## Getting Started

### Install dependencies

npm start
http://localhost:3000


##  Creating Maps

- Use the built-in **Level Editor** (Press "Open Level Editor" button)
- Paint tiles, set spawn points and end points
- Save map (downloads JSON)
- Load map in `assets/maps/` or integrate into game loader

**Note:** Paths are auto-generated in-game using auto path ordering logic.

---

 ##Future Ideas (optional)

- Tower selling / refunds  
- More tower types (poison, laser, beam, etc.)  
- Persistent progression and save/load system  
- Sound effects and music  
- Enemy abilities (shield, heal, split on death)  
- Full leaderboard / scoring system

---

## 📖 License and Credits

This project is built for learning and prototyping purposes.  
You are free to modify and use this for personal or educational projects.