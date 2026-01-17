# Prophecy 🔮
The Reality Trading Card Game. Clash Royale meets Prediction Markets.

## 📖 About The Project
Prophecy is a mobile PvP strategy game where the cards in your deck are real-world events.

Instead of fantasy creatures, players draft cards representing live outcomes—Sports wins, Stock rallies, Celebrity news, or Natural disasters. Players build a "Parlay Deck" and battle opponents in weekly cycles. If the events happen in real life, the cards activate and deal damage to the opponent.

The catch? The cards are powered by live data. An "Earthquake" card sits dormant in your hand until the USGS API reports a magnitude 5.0+ quake, instantly triggering a Critical Hit on your opponent.

## 🌟 Key Features
* Reality Engine: An ingestion system powered by AWS Lambda that normalizes data from The Odds API, Polymarket, and NASA/USGS into game stats.
* Dynamic "Living" Art: Cards are not static images. Using react-native-skia and expo-sensors, cards feature holographic shaders that react to device tilt and visual states that change based on live win probability.
* The Widget: A Home Screen widget (iOS/Android) displaying a live "Tug of War" health bar between you and your rival, updating passively via background fetch.
* 4 Unique Factions:

🟢 The Arena (Sports): Reliable, high-volume stats.

🔵 The Market (Finance): Volatile, high-risk assets.

🟣 The Feed (Culture): Viral moments and memes.

🔴 Entropy (Chaos): Rare, high-speed disaster events (Solar flares, Earthquakes).

## 🛠 Tech Stack
Mobile Client
* Framework: React Native (Expo Dev Client)
* Language: TypeScript
* State Management: Legend-State (for high-performance game loops)
* Animations: react-native-reanimated (Layouts) + react-native-skia (Shaders/Visuals)
* Navigation: Expo Router

Backend (Serverless)
* Platform: AWS Amplify (Gen 2)
* Database: Amazon DynamoDB (Single Table Design)
* API: AWS AppSync (GraphQL)
* Functions: AWS Lambda (Node.js) for the Data Ingestion Engine
* Auth: Amazon Cognito

Quality Assurance
* Testing: Jest + React Native Testing Library
* Linting: ESLint + Prettier (Airbnb Style Guide)
* CI/CD: GitHub Actions (Automated Linting & Testing on Push)

## 🚀 Getting Started
Prerequisites
* Node.js (v18+)
* npm or yarn
* Expo CLI
* AWS Account & Amplify CLI configured.

## Installation
### Clone the repo
```bash
git clone https://github.com/your-username/pickr.git
cd pickr
```

### Install dependencies
```bash
npm install
```

Initialize AWS Amplify Gen 2
```bash
npx ampx sandbox
// This will spin up a cloud sandbox environment for local development.
```

# Run the App
## For iOS (Requires Simulator or Mac)
```bash
npm run ios
```
## For Android (Requires Emulator)
```bash
npm run android
```

## 🧪 Running Tests
We adhere to strict TDD. All core game logic and UI components are tested.

### Run Unit Tests:
```bash
npm run test
```
### Run Linter:
```bash
npm run lint
```

CI Pipeline: Tests run automatically on every Push and Pull Request to main. See .github/workflows/ci.yml for configuration.

## 🏗 Architecture Overview
The Ingestion Engine (Lambda)
The heart of the game is the ingest-events Lambda function. It runs on a cron schedule:
* Fetches external API data (Odds, Weather, Stocks).
* Normalizes probabilities into Damage (Damage = 100 / Probability).
* Updates the Card status in DynamoDB.
* Triggers GraphQL subscriptions to update the client UI.

The Widget Bridge
We use react-native-shared-group-preferences to synchronize data between the React Native JavaScript realm and the Native Widget code (SwiftUI/Kotlin).

Data Flow: App Logic -> Shared File System (JSON) -> Widget Timeline Provider.

## 📂 Project Structure
```plaintext
/pickr
│
├── /amplify                   # ☁️ BACKEND (AWS Cloud Logic)
│   ├── /auth
│   │   └── resource.ts        # Cognito Setup (Social Login rules)
│   ├── /data
│   │   └── resource.ts        # Database Schema (Cards, Users, Battles)
│   ├── /functions             # ⚙️ SERVERLESS LOGIC
│   │   ├── /ingest-events     # The "Engine": Fetches odds & updates cards
│   │   └── /resolve-battle    # The "Referee": Calculates damage & winner
│   └── backend.ts             # Main backend entry point
│
├── /src                       # 📱 FRONTEND (React Native App)
│   ├── /app                   # 🚦 Navigation (Expo Router)
│   │   ├── (tabs)             # Main Tab Bar (Deck, Battle, Shop)
│   │   ├── battle             # Battle Screen
│   │   └── _layout.tsx
│   │
│   ├── /components            # 🧩 UI Bricks
│   │   ├── /HoloCard          # The "Shiny" Card (Skia + Sensors)
│   │   ├── /Widget            # The "Battle Bar" Widget UI
│   │   └── /DeckBuilder       # Drag-and-drop slots
│   │
│   ├── /features              # 🧠 Game Logic (State Management)
│   │   ├── /game-state        # Legend-State stores (User Health, Ammo)
│   │   └── /bridge            # Native Module Bridge (Shared Group Prefs)
│   │
│   ├── /services              # 🔌 API Connectors
│   │   ├── api.ts             # Amplify GraphQL Client
│   │   └── entropy.ts         # Direct calls to Chaos APIs (if needed)
│   │
│   ├── /utils                 # 🧮 Helpers
│   │   ├── damage.ts          # Logic: `100 / Probability`
│   │   └── format.ts
│   │
│   └── /types                 # 🏷️ Shared TypeScript Interfaces
│       └── env.d.ts
│
├── /modules                   # 🌉 NATIVE CODE (The Hard Stuff)
│   └── /widget-bridge         # Swift/Kotlin code to update Home Screen
│
├── /__tests__                 # 🧪 TESTING
│   ├── /unit                  # Logic tests (Damage calc)
│   └── /integration           # App flow tests
│
├── .github
│   └── /workflows             # 🤖 CI/CD
│       └── ci.yml             # The Pipeline (Test -> Build)
│
├── app.json                   # Expo Config
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript Config
└── README.md                  # The documentation we just wrote
```
## 🤝 Contributing
* Fork the Project
* Create your Feature Branch (git checkout -b feature/AmazingFeature)
* Commit your Changes (git commit -m 'Add some AmazingFeature')
* Push to the Branch (git push origin feature/AmazingFeature)
* Open a Pull Request

## 📄 License
Distributed under the MIT License. See LICENSE for more information.
