# CSFighty
#### Video Demo: https://www.youtube.com/watch?v=iREm1t-rgQA
#### Description:
CSFighty is a game project in which you choose your character and defeat the Nightborne, who has stolen the kingdom's RGB colors.

The project is divided into 4 parts:

- index.html -> Has the initial structure of the page, preloads all the sprite images and adds all the audio;

- styles -> Has the global css file;

- src -> Where all the project logic is;

- assets -> Folder containing all the images and audio.

#### ASSETS
Organizes all the assets so that they are easy to call in functions, for example, assets/fighters contains the character folders, apart from nightborne, they all have sprites with the same names, such as “attack_basic”, “run”, “idle”, etc.

#### SRC
Here is the main thing, the heart of the project, and it is divided into:
- constants -> where there are character and special files, containing the number of frames in each sprite of each character/special, for example;
- entities -> with OOP in mind, here are the entity classes, such as Sprite, which is the basis of everything. And I've implemented the attributes as private, so that they can only be accessed with getters and setters;
- pages -> here are the two pages that are implemented in the DOM later;
- states -> are values that are accessed and changed over time:
  - enemy.js -> changes the enemy's level, its fear measure, and these 2 change its behavior in battle;
  - game.js -> changes what is being displayed (game, intro, dialogue, etc);
  - sprites.js -> determines the cooldown of the player and the boss's basic attack.
- utils -> as the name says, these are files with useful functions;
- attack -> functions for basic and special attacks, to defeat the opponent and reset the specials array;
- block -> function to remove the opponent's block;
- collision -> functions to check the collision between sprites;
- dialogue -> functions to position characters on the dialogue screen;
- enemy -> functions to decide, based on behavior, the AI's movement and battle action;
- game -> function to start the game and save global references;
- round -> functions to control round variables;
- select -> functions to position characters on the select screen;
- sfx -> function to check if sfx is playing.
- soundtrack -> function to check if the soundtrack is playing.

## CREDITS

### Fighters
- [Nightborne - CreativeKind](https://creativekind.itch.io/nightborne-warrior)
- [Ninja - LuizMelo](https://luizmelo.itch.io/martial-hero-2)
- [Rogue - LuizMelo](https://luizmelo.itch.io/medieval-warrior-pack-2)
- [Samurai - LuizMelo](https://luizmelo.itch.io/martial-hero)
- [Warrior - LuizMelo](https://luizmelo.itch.io/medieval-warrior-pack-3)

### SFX
- [Air - Yasuo Q Sound Effect (League of Legends)](https://www.youtube.com/watch?v=6mSVRBGIWOo)
- [Block - Rope Shield (The Rising of the Shield Hero)](https://www.youtube.com/watch?v=Ea0kj27cPO4)
- [Earth - Avatar Earthbending Animation (Jared Koh)](https://www.youtube.com/watch?v=lZRYNRqdWD4)
- [Fire - Avatar Earthbending Animation (Jared Koh)](https://www.youtube.com/watch?v=bm35JrFHqPQ)
- [Slash Boss - Anime Slash Sound Effects for Edits/AMVs (Mike5FX)](https://www.youtube.com/watch?v=Qr8BLy2np24)
- [Slash - Anime Slash Sound Effects for Edits/AMVs (Mike5FX)](https://www.youtube.com/watch?v=Qr8BLy2np24)
- [Void - Made In Heaven Moments SFX Only (Passione Sound)](https://www.youtube.com/watch?v=QBVuNm2tF2Q)
- [Water - Avatar Waterbending Animation (Jared Koh)](https://www.youtube.com/watch?v=5Lq0vTq6eeo)

### Soundtracks

- [(Home) Belmont Chronicles - Awakening After the War (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(Select) Belmont Chronicles - Abandoned Church (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(First Enemy) Belmont Chronicles - The Dungeons (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(Second Enemy) Belmont Chronicles - The Mystic Forest (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(Third Enemy) Belmont Chronicles - Caverns (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(Boss) Belmont Chronicles - Final Boss (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)
- [(Credits) Belmont Chronicles - Credits Theme (DavidKBD)](https://davidkbd.itch.io/belmont-chronicles-metroidvania-music-pack)

### Specials

- [Air - Foozle](https://foozlecc.itch.io/pixel-magic-sprite-effects)
- [Earth - Foozle](https://foozlecc.itch.io/pixel-magic-sprite-effects)
- [Fire - Foozle](https://foozlecc.itch.io/pixel-magic-sprite-effects)
- [Void - Foozle](https://foozlecc.itch.io/pixel-magic-sprite-effects)
- [Water - Foozle](https://foozlecc.itch.io/pixel-magic-sprite-effects)

### Stages

- [Stages - Szadi art.](https://szadiart.itch.io/pixel-platformer-world)