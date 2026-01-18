# 📋 Pickr Technical Specifications

**Version:** 1.2  
**Stack:** React Native (Expo), Supabase, Legend-State, Edge Functions.

## 🟢 Part 1: Frontend (Client-Side)

These functions live in the React Native app (`/src`). They handle UI logic, state management, and direct API communication.

### 1.1 Utilities & Math (`src/utils`)

Pure functions. No side effects. Easy to test.

#### `calculateDamage`

**Location:** `src/utils/damage.ts`

**Purpose:** Converts probability to damage points using an inverse scale.

**Params:**
- `probability`: `number` (Float 0.0 - 1.0)

**Returns:** `number` (Integer 1-100)

**Error:** Throws if probability is <= 0 or > 1.

#### `getCardRarity`

**Location:** `src/utils/format.ts`

**Purpose:** Determines visual rarity based on damage potential.

**Params:**
- `damage`: `number`

**Returns:** `'common' | 'rare' | 'legendary'`

#### `formatCurrency`

**Location:** `src/utils/format.ts`

**Purpose:** Formats generic numbers into "Dust" or "Gold" strings (e.g., "1.2k").

**Params:**
- `amount`: `number`

**Returns:** `string`

### 1.2 Auth & User Management (`src/features/auth`)

#### `AuthService.signInWithEmail`

**Location:** `src/services/auth.ts`

**Purpose:** Authenticates user with Supabase via email/password.

**Params:**
- `email`: `string`
- `password`: `string`

**Returns:** `Promise<{ user: User | null, error: AuthError | null }>`

#### `AuthService.signUp`

**Location:** `src/services/auth.ts`

**Purpose:** Registers a new user and handles profile creation.

**Params:**
- `email`: `string`
- `password`: `string`
- `username`: `string`

**Returns:** `Promise<{ user: User | null, error: AuthError | null }>`

#### `AuthService.signOut`

**Location:** `src/services/auth.ts`

**Purpose:** Signs the user out and clears local state.

**Params:** none

**Returns:** `Promise<void>`

#### `AuthService.deleteAccount`

**Location:** `src/services/auth.ts`

**Purpose:** Permanently removes user account and data (GDPR compliance).

**Params:**
- `userId`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `AuthService.updateProfile`

**Location:** `src/services/auth.ts`

**Purpose:** Updates user metadata like username or avatar URL.

**Params:**
- `userId`: `string`
- `updates`: `{ username?: string, avatar_url?: string }`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `AuthService.updateAccountInfo`

**Location:** `src/services/auth.ts`

**Purpose:** Updates account credentials like email or password.

**Params:**
- `userId`: `string`
- `updates`: `{ email?: string, password?: string }`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `AuthService.getCurrentUser`

**Location:** `src/services/auth.ts`

**Purpose:** Retrieves the currently authenticated user session.

**Params:** none

**Returns:** `Promise<User | null>`

#### `AuthService.getUserProfile`

**Location:** `src/services/auth.ts`

**Purpose:** Fetches complete user profile data including stats and currency.

**Params:**
- `userId`: `string`

**Returns:** `Promise<{ profile: UserProfile | null, error?: string }>`

#### `AuthService.resetPassword`

**Location:** `src/services/auth.ts`

**Purpose:** Sends password reset email to user.

**Params:**
- `email`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

### 1.3 Shop & Cards (`src/features/shop`)

#### `ShopService.fetchDailyCards`

**Location:** `src/services/shop.ts`

**Purpose:** Retrieves the daily rotation of purchaseable cards from the store.

**Params:** none

**Returns:** `Promise<Card[]>`

#### `ShopService.purchaseCard`

**Location:** `src/services/shop.ts`

**Purpose:** Deducts currency and adds a card to the user's inventory.

**Params:**
- `userId`: `string`
- `cardId`: `string`
- `cost`: `number`
- `currency`: `'gold' | 'dust'`

**Returns:** `Promise<{ success: boolean, newBalance: number, error?: string }>`

#### `fetchAvailableCards`

**Location:** `src/services/supabase.ts`

**Purpose:** Gets the list of draftable cards for the current week.

**Params:**
- `limit?`: `number` (Default 20)

**Returns:** `Promise<Card[]>`

#### `ShopService.getCardDetails`

**Location:** `src/services/shop.ts`

**Purpose:** Fetches detailed information about a specific card including current probability and status.

**Params:**
- `cardId`: `string`

**Returns:** `Promise<Card | null>`

#### `InventoryService.fetchUserInventory`

**Location:** `src/services/inventory.ts`

**Purpose:** Retrieves all cards owned by the user from their collection.

**Params:**
- `userId`: `string`
- `filters?`: `{ type?: string, rarity?: string, status?: string }`

**Returns:** `Promise<Card[]>`

### 1.4 Deck Builder & Game State (`src/features/game-state`)

#### `DeckStore.addCard`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Adds a card to the drafted deck. Validates duplicate limits (max 1 of same ID).

**Params:**
- `card`: `Card`

**Returns:** `void`

**Error:** Throws if deck is full (3 cards).

#### `DeckStore.removeCard`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Removes a card from the deck.

**Params:**
- `cardId`: `string`

**Returns:** `void`

#### `DeckStore.validateDeck`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Checks if deck meets constraints (3 cards total, <100 cost sum, faction diversity).

**Params:** none

**Returns:** `{ isValid: boolean, error?: string }`

#### `GameState.updateUserBalance`

**Location:** `src/features/game-state/user.ts`

**Purpose:** Updates the local user store with new currency values.

**Params:**
- `gold`: `number`
- `dust`: `number`

**Returns:** `void`

#### `DeckStore.saveDeck`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Persists the current deck to the database. Validates deck before saving.

**Params:**
- `userId`: `string`
- `deckName?`: `string`

**Returns:** `Promise<{ deckId: string, error?: string }>`

#### `DeckStore.submitDeck`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Submits a validated deck for battle. Locks the deck for the current week.

**Params:**
- `userId`: `string`
- `deckId`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `DeckStore.getUserDecks`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Retrieves all saved decks for a user.

**Params:**
- `userId`: `string`

**Returns:** `Promise<Deck[]>`

#### `DeckStore.getDeckById`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Fetches a specific deck by ID with all card details.

**Params:**
- `deckId`: `string`

**Returns:** `Promise<Deck | null>`

#### `DeckStore.clearDeck`

**Location:** `src/features/game-state/deck.ts`

**Purpose:** Removes all cards from the current draft deck.

**Params:** none

**Returns:** `void`

#### `GameState.getUserBalance`

**Location:** `src/features/game-state/user.ts`

**Purpose:** Fetches current user currency balances from the server.

**Params:**
- `userId`: `string`

**Returns:** `Promise<{ gold: number, dust: number }>`

#### `GameState.getUserStats`

**Location:** `src/features/game-state/user.ts`

**Purpose:** Retrieves user statistics including wins, losses, XP, and rank.

**Params:**
- `userId`: `string`

**Returns:** `Promise<UserStats>`

### 1.5 Battle System (`src/features/battle`)

#### `joinMatchmaking`

**Location:** `src/services/matchmaking.ts`

**Purpose:** Puts the user in the queue for a PvP battle with their current deck.

**Params:**
- `userId`: `string`
- `deckId`: `string`

**Returns:** `Promise<{ queueId: string, error?: string }>`

#### `leaveMatchmaking`

**Location:** `src/services/matchmaking.ts`

**Purpose:** Removes the user from the matchmaking queue.

**Params:**
- `userId`: `string`
- `queueId`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `getMatchStatus`

**Location:** `src/services/matchmaking.ts`

**Purpose:** Checks the current status of matchmaking (queued, matched, error).

**Params:**
- `queueId`: `string`

**Returns:** `Promise<{ status: 'queued' | 'matched' | 'error', battleId?: string, error?: string }>`

#### `subscribeToBattle`

**Location:** `src/services/realtime.ts`

**Purpose:** Sets up a Websocket listener for a specific battle ID to receive live damage updates.

**Params:**
- `battleId`: `string`
- `callback`: `(payload: BattleUpdate) => void`

**Returns:** `RealtimeChannel` (Object containing `.unsubscribe()`)

#### `BattleService.getBattleState`

**Location:** `src/services/battle.ts`

**Purpose:** Fetches the initial state of a battle (healths, decks, players).

**Params:**
- `battleId`: `string`

**Returns:** `Promise<BattleState>`

#### `BattleService.getBattleHistory`

**Location:** `src/services/battle.ts`

**Purpose:** Retrieves past battles for a user with results and outcomes.

**Params:**
- `userId`: `string`
- `limit?`: `number` (Default 10)

**Returns:** `Promise<Battle[]>`

#### `BattleService.getActiveBattles`

**Location:** `src/services/battle.ts`

**Purpose:** Gets all currently active battles for a user.

**Params:**
- `userId`: `string`

**Returns:** `Promise<Battle[]>`

#### `BattleService.forfeitBattle`

**Location:** `src/services/battle.ts`

**Purpose:** Allows a player to forfeit an active battle, marking opponent as winner.

**Params:**
- `battleId`: `string`
- `userId`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

#### `WidgetBridge.sync`

**Location:** `src/features/bridge/index.ts`

**Purpose:** Serializes current Battle Health and writes to iOS Shared Group for the Widget.

**Params:**
- `battleState`: `BattleData`

**Returns:** `Promise<void>`

### 1.6 Draft System (`src/features/draft`)

#### `DraftService.openPack`

**Location:** `src/services/draft.ts`

**Purpose:** Opens a card pack and returns randomized cards based on pack type.

**Params:**
- `packType`: `'basic' | 'premium' | 'legendary'`
- `userId`: `string`

**Returns:** `Promise<{ cards: Card[], error?: string }>`

#### `DraftService.draftCard`

**Location:** `src/services/draft.ts`

**Purpose:** Adds a drafted card to the user's inventory after pack opening.

**Params:**
- `userId`: `string`
- `cardId`: `string`

**Returns:** `Promise<{ success: boolean, error?: string }>`

### 1.7 Entropy & External APIs (`src/services/entropy`)

#### `EntropyService.fetchEntropyEvents`

**Location:** `src/services/entropy.ts`

**Purpose:** Fetches rare disaster events from USGS/NASA APIs for Entropy faction cards.

**Params:**
- `eventType?`: `'earthquake' | 'solar_flare' | 'all'`
- `minMagnitude?`: `number` (Default 5.0)

**Returns:** `Promise<RawEvent[]>`

## 🔵 Part 2: Backend (Server-Side)

These functions live in Supabase (`/supabase`). They run on the server to ensure security and handle heavy data processing.

### 2.1 The "Ingestion Engine" (`supabase/functions/ingest-events`)

Runs on CRON (e.g., every 1 hour). Fetches raw data and converts it into Cards.

#### `fetchRawOdds`

**Location:** `supabase/functions/ingest-events/index.ts`

**Purpose:** Gets raw sports/finance data from external APIs (The Odds API, Polymarket).

**Params:**
- `source`: `'sports' | 'finance'`

**Returns:** `Promise<RawEvent[]>`

#### `enrichCardMetadata`

**Location:** `supabase/functions/ingest-events/ai.ts`

**Purpose:** Uses OpenAI to generate flavor text, titles, and color themes for raw events.

**Params:**
- `event`: `RawEvent`

**Returns:** `Promise<{ title: string, description: string, color: string }>`

#### `upsertCard`

**Location:** `supabase/functions/ingest-events/db.ts`

**Purpose:** Saves card to DB. If event_id exists, updates probability; otherwise inserts new row.

**Params:**
- `cardData`: `Card`

**Returns:** `Promise<void>`

#### `normalizeProbability`

**Location:** `supabase/functions/ingest-events/index.ts`

**Purpose:** Converts raw API probability data into standardized format (0.0-1.0).

**Params:**
- `rawData`: `RawEvent`
- `source`: `'sports' | 'finance' | 'entropy'`

**Returns:** `number` (Float 0.0 - 1.0)

#### `calculateCardCost`

**Location:** `supabase/functions/ingest-events/index.ts`

**Purpose:** Determines card cost based on damage and rarity for shop pricing.

**Params:**
- `damage`: `number`
- `rarity`: `'common' | 'rare' | 'legendary'`

**Returns:** `number` (Cost in Gold)

### 2.2 The "Referee" (`supabase/functions/resolve-battles`)

Runs on CRON (every 15 mins). Checks active battles and declares winners.

#### `checkEventOutcomes`

**Location:** `supabase/functions/resolve-battles/index.ts`

**Purpose:** Queries DB for active cards where event_time < now. Checks API for final score/outcome.

**Params:** none

**Returns:** `Promise<void>`

#### `applyBattleDamage`

**Location:** `supabase/functions/resolve-battles/logic.ts`

**Purpose:** Sums damage of all newly resolved hit cards. Updates p1_health and p2_health in battles table.

**Params:**
- `battleId`: `string`

**Returns:** `Promise<void>`

#### `finaliseBattle`

**Location:** `supabase/functions/resolve-battles/logic.ts`

**Purpose:** Ends the game if health <= 0 or week is over. Marks winner, distributes XP, sends Push Notification.

**Params:**
- `battleId`: `string`

**Returns:** `Promise<void>`

#### `distributeRewards`

**Location:** `supabase/functions/resolve-battles/logic.ts`

**Purpose:** Awards currency and XP to battle winner, updates user stats.

**Params:**
- `battleId`: `string`
- `winnerId`: `string`

**Returns:** `Promise<void>`

#### `createBattle`

**Location:** `supabase/functions/matchmaking/index.ts`

**Purpose:** Creates a new battle record when two players are matched.

**Params:**
- `player1Id`: `string`
- `player2Id`: `string`
- `deck1Id`: `string`
- `deck2Id`: `string`

**Returns:** `Promise<{ battleId: string, error?: string }>`

### 2.3 Database Triggers & Security (SQL)

Automatic logic that runs inside the PostgreSQL database.

#### `handle_new_user`

**Trigger Event:** `INSERT ON auth.users`

**Purpose:** When a user signs up, auto-create a row in `public.profiles` with 1000 starter Dust.

**Returns:** `TRIGGER`

#### `validate_deck_submission`

**Trigger Event:** `INSERT/UPDATE ON decks`

**Purpose:** Prevents cheating. Ensures the sum of `card.cost` is <= 100 before saving a deck.

**Returns:** `TRIGGER`

**Error:** Raises SQL exception if validation fails.

#### `update_card_probability`

**Trigger Event:** `UPDATE ON cards`

**Purpose:** Automatically recalculates damage when probability changes.

**Returns:** `TRIGGER`

#### `track_battle_updates`

**Trigger Event:** `UPDATE ON battles`

**Purpose:** Logs battle state changes for realtime updates and audit trail.

**Returns:** `TRIGGER`

## 🔴 Part 3: Native Modules (iOS/Android)

Specific native functions to handle the Home Screen Widget.

#### `TimelineProvider.getSnapshot`

**Location:** `ios/PickrWidget/PickrWidget.swift`

**Purpose:** Reads the shared JSON file written by React Native and renders the Widget UI.

**Params:**
- `context`: `Context`

**Returns:** `WidgetEntry` (View)

#### `BackgroundTask.handleRefresh`

**Location:** `ios/Pickr/AppDelegate.mm`

**Purpose:** Wakes up the app in background to fetch new battle data if the app is closed.

**Params:**
- `task`: `BGTask`

**Returns:** `void`

## 📂 Data Models (Reference)

### Card Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `event_id` | `string` | External ID (e.g., from Odds API) |
| `type` | `enum` | `'sports'`, `'finance'`, `'entropy'` |
| `title` | `text` | "Chiefs Defense" |
| `description` | `text` | AI Generated Flavor Text |
| `probability` | `float` | 0.85 |
| `damage` | `int` | 12 (Calculated) |
| `status` | `enum` | `'pending'`, `'hit'`, `'miss'` |
| `resolves_at` | `timestamptz` | When the event happens |

### Battle Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `player_1_id` | `uuid` | FK to Users |
| `player_2_id` | `uuid` | FK to Users |
| `p1_health` | `int` | Starts at 1000 |
| `p2_health` | `int` | Starts at 1000 |
| `status` | `enum` | `'active'`, `'completed'`, `'forfeited'` |
| `winner_id` | `uuid` | FK to Users (null until battle ends) |
| `created_at` | `timestamptz` | Battle start time |
| `ended_at` | `timestamptz` | Battle end time (null if active) |

### Profiles Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key (FK to auth.users) |
| `username` | `text` | Unique display name |
| `avatar_url` | `text` | Profile picture URL |
| `gold` | `int` | Currency balance |
| `dust` | `int` | Secondary currency balance |
| `xp` | `int` | Experience points |
| `level` | `int` | Player level |
| `wins` | `int` | Total battle wins |
| `losses` | `int` | Total battle losses |
| `created_at` | `timestamptz` | Account creation time |

### Decks Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | FK to Users |
| `name` | `text` | Deck name |
| `card_ids` | `uuid[]` | Array of card IDs (max 3) |
| `total_cost` | `int` | Sum of card costs |
| `is_submitted` | `boolean` | Whether deck is locked for battle |
| `created_at` | `timestamptz` | Deck creation time |

### User_Cards Table (Inventory)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | FK to Users |
| `card_id` | `uuid` | FK to Cards |
| `acquired_at` | `timestamptz` | When card was obtained |
| `is_in_deck` | `boolean` | Whether card is currently in a deck |