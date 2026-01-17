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