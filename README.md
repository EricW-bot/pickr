# Pickr 🎯
*Draft Reality. Battle Friends. The Reality Trading Card Game.*

## 📖 About The Project
Pickr is a competitive mobile game where your "Ammo" is real-world data.

Instead of fantasy spells, players draft cards representing live outcomes—Sports wins, Stock rallies, Viral tweets, or Natural disasters. You build a "Parlay Deck" and battle opponents in weekly cycles. If the events happen in real life, your cards activate and deal damage.

The catch? An "Earthquake" card sits dormant in your hand until the USGS API reports a magnitude 5.0+ quake. Once it hits, your widget flashes red, and your opponent takes critical damage.

## 🌟 Key Features
* Reality Engine: An ingestion system powered by Supabase Edge Functions that normalizes data from The Odds API, Polymarket, and NASA/USGS into game stats.
* Dynamic "Living" Art: Cards are not static images. Using react-native-skia and expo-sensors, cards feature holographic shaders that react to device tilt and visual states that change based on live win probability.
* The Widget: A Home Screen widget (iOS/Android) displaying a live "Tug of War" health bar between you and your rival, updating passively via background fetch.
* 4 Unique Factions:
    * 🟢 The Arena (Sports): Reliable, high-volume stats.
    * 🔵 The Market (Finance): Volatile, high-risk assets.
    * 🟣 The Feed (Culture): Viral moments and memes.
    * 🔴 Entropy (Chaos): Rare, high-speed disaster events (Solar flares, Earthquakes).

## 🎮 How To Play

### 1. Draft your Parlay Deck
- **Build a deck** of real‑world event cards across the four factions (Sports, Finance, Culture, Chaos).
- Each card represents a **binary or threshold outcome**, for example:
  - *Chiefs beat Raiders by 3+ points*
  - *BTC closes +5% on the day*
  - *A 5.0+ earthquake is reported in California*
- Behind the scenes, each card has:
  - A **probability** derived from external data (odds, markets, feeds).
  - A **damage value** computed from that probability (see `damage.ts`): rarer events hit harder.

### 2. Queue into Battle
- You **queue into a weekly battle** with your locked Parlay Deck.
- Both you and your opponent start with a fixed **health pool** (e.g. 100 HP).
- Battles are **asynchronous** and play out over a **fixed weekly window**, so you don’t need to be online at the same time.

### 3. Let Reality Resolve
- During the battle window, the **Reality Engine** periodically ingests live data:
  - Sports scores, market moves, cultural events, and entropy events.
  - Each card is updated from **pending → live → resolved/expired** as its real‑world condition is met or times out.
- When a card **resolves in your favor**:
  - Its damage is applied to your opponent.
  - The Home Screen widget and in‑app battle bar update in real time.
- If an event never happens before the window closes, that card **expires** and deals no damage.

### 4. Win, Lose, Rank Up
- When the battle window ends, the game:
  - Compares **remaining health**.
  - Awards a **win, loss, or draw**.
  - Updates your **trophy count / rank**, and feeds into future matchmaking.
- Your cards persist into future weeks, but the **underlying odds and damage values** can shift as the world changes and new cards enter the pool.

## 📅 Weekly Match Lifecycle

Each battle plays out over a weekly cycle (for example, **Week 42**):

### 1. The Draft (Mon–Thu) — `DRAFTING`
- **State:** `DRAFTING`
- **What you do:**
  - Open packs in the **Market**.
  - Trade or acquire cards across the four factions.
  - Build your **Parlay** by selecting **3 cards** you want live for the upcoming weekend.
- **Constraint:** Once you **lock your deck on Thursday night**, it cannot be changed until the next week.

### 2. The Lock (Fri Morning) — `LOCKED`
- **State:** `LOCKED`
- **System actions:**
  - **Matchmaking** runs and pairs you with an opponent.
  - Both decks are **revealed** to each other.
  - A *“Tale of the Tape”* view highlights key clashes:
    - e.g. they have *“Chiefs Win”* while you have *“Raiders Win”*.

### 3. The Battle (Fri–Sun) — `ACTIVE`
- **State:** `ACTIVE`
- **Reality drives the game:**
  - Real events start: e.g. Friday 8 PM, a basketball game tips off.
  - Your Home Screen **widget** flips to *“Live”* and shows the tug‑of‑war health bar.
  - Example:
    - LeBron scores **30 points**.
    - Your *“LeBron > 25pts”* card **activates**, glows gold, and immediately deals **50 damage** to your opponent.
- There are **no traditional turns**:
  - Damage is applied **whenever reality happens**.
  - If an earthquake hits on Saturday, the Entropy player’s quake card fires instantly.

### 4. The Resolution (Sun Night) — `FINISHED`
- **State:** `FINISHED`
- **System actions:**
  - The week **closes** and total damage is tallied.
    - e.g. You: 450 dmg, Opponent: 300 dmg.
  - A **winner** is declared.
  - You receive **trophies and currency rewards**.
  - Special modes (e.g. *“Pink Slip”* matches) can **transfer cards** from the loser to the winner.

### 5. How it surfaces in the app
- **Early week (Mon–Thu):** the main Battle tab emphasizes **“Deck Building”**:
  - Countdown like: *“3 Days to Lock. Build your Deck.”*
  - Quick access to the Market and your Parlay.
- **Weekend (Fri–Sun):** the Battle tab becomes the **Battle Arena**:
  - Two health bars, your 3 cards vs. your opponent’s 3.
  - Live status indicators for which real‑world events are in play.
- **Sunday night / Monday:** you see a **Victory / Defeat** screen:
  - Summary of which cards fired.
  - Loot / rewards to claim.
  - Prompt to start drafting for the **next week**.

## 💰 Game Loop & Economy

### Currencies
- **Gold**: Soft currency.
  - Earned from battles, quests, and weekly rewards.
  - Spent to **draft card packs** in the Market (Free / Standard / Premium tiers).
- **Dust**: Reroll currency.
  - Earned by **disenchanting cards** or as a side reward from battles.
  - Spent to **reroll individual cards** you’re unhappy with.
- **Tokens**: Premium currency.
  - Purchased via the **Buy Tokens** section.
  - Used to **buy Gold** (via Buy Gold bundles) and unlock cosmetics / future token‑only offers.

### Typical Session
1. **Open the app or widget** and check the current battle state (health bars, live cards, recent triggers).
2. **Draft cards in the Market** using Gold to refresh and grow your Parlay Deck.
3. **Tune your deck**:
   - Use Dust to reroll low‑impact cards.
   - Use Tokens to top up Gold if you want to draft more aggressively.
4. **Queue for a battle** from the Battle tab.
5. **Let the window play out** while real‑world events fire cards in both decks.
6. **Collect rewards** (Gold, Dust, Trophies) and iterate on your deck for the next cycle.

## 🛠 Tech Stack
### Mobile Client
* Framework: React Native (Expo Dev Client)
* Language: TypeScript
* State Management: Legend-State (Persistence & High Performance)
* Animations: react-native-reanimated (Layouts) + react-native-skia (Shaders)
* Navigation: Expo Router

### Backend (Supabase)
* Database: PostgreSQL
* Auth: Supabase Auth (Email/Socials)
* API: PostgREST (Auto-generated from Schema)
* Realtime: Supabase Realtime (Websockets for Battle Updates)
* Edge Functions: Deno/TypeScript (Ingestion Engine)

### Quality Assurance
* Testing: Jest + React Native Testing Library
* Linting: ESLint + Prettier (Airbnb Style Guide)
* CI/CD: GitHub Actions (Lint + Test on Push)

## 🚀 Getting Started
### Prerequisites
* Node.js (v18+)
* Expo CLI
* Supabase CLI (for local backend dev)

### Installation
Clone the repo
```bash
git clone https://github.com/your-username/pickr.git
cd pickr
```

Install dependencies
```bash
npm install
```

Start Supabase Locally (Requires Docker)
```bash
npx supabase start
# This spins up a local PostgreSQL database and Edge Runtime.
```

Generate Database Types
```bash
# syncs your frontend types with the local database schema
npm run gen-types
```

Run the App
```bash
# For iOS (Requires Simulator or Mac)
npm run ios

# For Android (Requires Emulator)
npm run android
```

## 🧪 Running Tests
We adhere to strict TDD. All core game logic and UI components are tested.

Run Unit Tests:
```bash
npm run test
```

Run Linter:
```bash
npm run lint
```

CI Pipeline: Tests run automatically on every Push and Pull Request to main. See .github/workflows/ci.yml.

## 🏗 Architecture Overview
The Ingestion Engine (Edge Functions)
The heart of the game is the ingest-events Edge Function. It runs on a CRON schedule (every 15 mins):

* Fetches external API data (Odds, Weather, Stocks).
* Normalizes probabilities into Damage (Damage = 100 / Probability).
* Upserts rows in the cards table.
* Supabase Realtime instantly pushes these updates to connected clients.

The Widget Bridge
We use react-native-shared-group-preferences to synchronize data between the React Native JavaScript realm and the Native Widget code (SwiftUI/Kotlin).

Flow: App Logic -> Shared File System (JSON) -> Widget Timeline Provider.

## 📂 Project Structure
```plaintext
/pickr
│
├── /supabase                  # ⚡️ BACKEND (Supabase Logic)
│   ├── /functions             # ⚙️ EDGE FUNCTIONS (Server-side code)
│   │   ├── /ingest-events     # 🕒 Cron Job: Fetches Odds API -> Updates DB
│   │   └── /resolve-battle    # ⚔️ Logic: Who won the battle?
│   ├── /migrations            # 🗄️ SQL: Database Schema definitions
│   └── config.toml            # 🔧 Config: Local dev settings
│
├── /src                       # 📱 FRONTEND (React Native App)
│   ├── /app                   # 🚦 NAVIGATION (Expo Router)
│   │   ├── (tabs)             # 🗂️ Group: Screens with Bottom Tabs
│   │   │   ├── _layout.tsx    #    Defines the Tab Bar icons
│   │   │   ├── index.tsx      #    Tab 1: "My Deck" (Home)
│   │   │   ├── shop.tsx       #    Tab 2: "Marketplace"
│   │   │   └── profile.tsx    #    Tab 3: "Profile"
│   │   ├── battle             # ⚔️ Group: Screens WITHOUT Tabs
│   │   │   └── index.tsx      #    The Full-Screen Battle Arena
│   │   └── _layout.tsx        #    Root Layout (Providers, Fonts)
│   │
│   ├── /components            # 🧩 UI COMPONENTS (Visuals)
│   │   ├── /HoloCard          #    ✨ The "Shiny" Card (Skia + Sensors)
│   │   ├── /Widget            #    📊 The "Battle Bar" Preview
│   │   └── /DeckBuilder       #    🎴 Drag-and-drop slots
│   │
│   ├── /features              # 🧠 GAME LOGIC (State & Rules)
│   │   ├── /game-state        #    Legend-State: Stores User Health, Ammo
│   │   ├── /draft             #    Logic: Opening packs, randomization
│   │   └── /bridge            #    Native: Sends data to iOS Widget
│   │
│   ├── /services              # 🔌 API CONNECTORS
│   │   ├── supabase.ts        #    The Supabase Client (createClient)
│   │   └── entropy.ts         #    Direct calls to Chaos APIs (USGS/NASA)
│   │
│   ├── /types                 # 🏷️ TYPESCRIPT DEFINITIONS
│   │   ├── database.types.ts  #    ⚠️ Generated automatically by Supabase
│   │   └── env.d.ts           #    Environment variables
│   │
│   └── /utils                 # 🧮 HELPERS (Pure Math)
│       ├── damage.ts          #    Logic: `100 / Probability`
│       └── format.ts          #    Formatters (Currency, Dates)
│
├── /modules                   # 🌉 NATIVE CODE (The Hard Stuff)
│   └── /widget-bridge         #    Swift/Kotlin code for Home Screen Widget
│
├── /assets                    # 🖼️ STATIC ASSETS
│   ├── /images                #    Icons, Logos
│   └── /fonts                 #    Custom Game Fonts
│
├── /__tests__                 # 🧪 TESTING
│   ├── /unit                  #    Logic tests (Damage calc)
│   └── /integration           #    App flow tests
│
├── .github
│   └── /workflows             # 🤖 CI/CD
│       └── ci.yml             #    Pipeline: Runs Lint + Test on Push
│
├── app.json                   # ⚙️ EXPO CONFIG (Name, Bundle ID)
├── package.json               # 📦 DEPENDENCIES
├── tsconfig.json              # 📘 TYPESCRIPT CONFIG
└── README.md                  # 📖 DOCUMENTATION
```

## 🤝 Contributing
* Fork the Project
* Create your Feature Branch (git checkout -b feature/AmazingFeature)
* Commit your Changes (git commit -m 'Add some AmazingFeature')
* Push to the Branch (git push origin feature/AmazingFeature)
* Open a Pull Request

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
