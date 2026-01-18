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
