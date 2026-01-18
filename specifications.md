# 📋 Pickr Technical Specifications

**Version:** 1.2  
**Stack:** React Native (Expo), Supabase, Legend-State, Edge Functions.

## 🟢 Part 1: Frontend (Client-Side)

These functions live in the React Native app (`/src`). They handle UI logic, state management, and direct API communication.

### 1.1 Utilities & Math (`src/utils`)

Pure functions. No side effects. Easy to test.

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`calculateDamage`**<br/>Location: `src/utils/damage.ts`<br/>Converts probability to damage points using an inverse scale. | **Params:**<br/>- `probability`: `number` (Float 0.0 - 1.0)<br/><br/>**Returns:** `number` (Integer 1-100) | Throws if probability is <= 0 or > 1 |
| **`getCardRarity`**<br/>Location: `src/utils/format.ts`<br/>Determines visual rarity based on damage potential. | **Params:**<br/>- `damage`: `number`<br/><br/>**Returns:** `'common' \| 'rare' \| 'legendary'` | None |
| **`formatCurrency`**<br/>Location: `src/utils/format.ts`<br/>Formats generic numbers into "Dust" or "Gold" strings (e.g., "1.2k"). | **Params:**<br/>- `amount`: `number`<br/><br/>**Returns:** `string` | None |

### 1.2 Auth & User Management (`src/features/auth`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`AuthService.signInWithEmail`**<br/>Location: `src/services/auth.ts`<br/>Authenticates user with Supabase via email/password. | **Params:**<br/>- `email`: `string`<br/>- `password`: `string`<br/><br/>**Returns:** `Promise<{ user: User \| null, error: AuthError \| null }>` | Returns `error: AuthError \| null` in response object |
| **`AuthService.signUp`**<br/>Location: `src/services/auth.ts`<br/>Registers a new user and handles profile creation. | **Params:**<br/>- `email`: `string`<br/>- `password`: `string`<br/>- `username`: `string`<br/><br/>**Returns:** `Promise<{ user: User \| null, error: AuthError \| null }>` | Returns `error: AuthError \| null` in response object |
| **`AuthService.signOut`**<br/>Location: `src/services/auth.ts`<br/>Signs the user out and clears local state. | **Params:** none<br/><br/>**Returns:** `Promise<void>` | None |
| **`AuthService.deleteAccount`**<br/>Location: `src/services/auth.ts`<br/>Permanently removes user account and data (GDPR compliance). | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`AuthService.updateProfile`**<br/>Location: `src/services/auth.ts`<br/>Updates user metadata like username or avatar URL. | **Params:**<br/>- `userId`: `string`<br/>- `updates`: `{ username?: string, avatar_url?: string }`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`AuthService.updateAccountInfo`**<br/>Location: `src/services/auth.ts`<br/>Updates account credentials like email or password. | **Params:**<br/>- `userId`: `string`<br/>- `updates`: `{ email?: string, password?: string }`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`AuthService.getCurrentUser`**<br/>Location: `src/services/auth.ts`<br/>Retrieves the currently authenticated user session. | **Params:** none<br/><br/>**Returns:** `Promise<User \| null>` | Returns `null` if no user |
| **`AuthService.getUserProfile`**<br/>Location: `src/services/auth.ts`<br/>Fetches complete user profile data including stats and currency. | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<{ profile: UserProfile \| null, error?: string }>` | Returns `error?: string` in response object |
| **`AuthService.resetPassword`**<br/>Location: `src/services/auth.ts`<br/>Sends password reset email to user. | **Params:**<br/>- `email`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |

### 1.3 Shop & Cards (`src/features/shop`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`ShopService.fetchDailyCards`**<br/>Location: `src/services/shop.ts`<br/>Retrieves the daily rotation of purchaseable cards from the store. | **Params:** none<br/><br/>**Returns:** `Promise<Card[]>` | None (returns empty array on error) |
| **`ShopService.purchaseCard`**<br/>Location: `src/services/shop.ts`<br/>Deducts currency and adds a card to the user's inventory. | **Params:**<br/>- `userId`: `string`<br/>- `cardId`: `string`<br/>- `cost`: `number`<br/>- `currency`: `'gold' \| 'dust'`<br/><br/>**Returns:** `Promise<{ success: boolean, newBalance: number, error?: string }>` | Returns `error?: string` in response object |
| **`fetchAvailableCards`**<br/>Location: `src/services/supabase.ts`<br/>Gets the list of draftable cards for the current week. | **Params:**<br/>- `limit?`: `number` (Default 20)<br/><br/>**Returns:** `Promise<Card[]>` | None (returns empty array on error) |
| **`ShopService.getCardDetails`**<br/>Location: `src/services/shop.ts`<br/>Fetches detailed information about a specific card including current probability and status. | **Params:**<br/>- `cardId`: `string`<br/><br/>**Returns:** `Promise<Card \| null>` | Returns `null` if card not found |
| **`InventoryService.fetchUserInventory`**<br/>Location: `src/services/inventory.ts`<br/>Retrieves all cards owned by the user from their collection. | **Params:**<br/>- `userId`: `string`<br/>- `filters?`: `{ type?: string, rarity?: string, status?: string }`<br/><br/>**Returns:** `Promise<Card[]>` | None (returns empty array on error) |

### 1.4 Deck Builder & Game State (`src/features/game-state`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`DeckStore.addCard`**<br/>Location: `src/features/game-state/deck.ts`<br/>Adds a card to the drafted deck. Validates duplicate limits (max 1 of same ID). | **Params:**<br/>- `card`: `Card`<br/><br/>**Returns:** `void` | Throws if deck is full (3 cards) |
| **`DeckStore.removeCard`**<br/>Location: `src/features/game-state/deck.ts`<br/>Removes a card from the deck. | **Params:**<br/>- `cardId`: `string`<br/><br/>**Returns:** `void` | None |
| **`DeckStore.validateDeck`**<br/>Location: `src/features/game-state/deck.ts`<br/>Checks if deck meets constraints (3 cards total, <100 cost sum, faction diversity). | **Params:** none<br/><br/>**Returns:** `{ isValid: boolean, error?: string }` | Returns `error?: string` in response object if invalid |
| **`GameState.updateUserBalance`**<br/>Location: `src/features/game-state/user.ts`<br/>Updates the local user store with new currency values. | **Params:**<br/>- `gold`: `number`<br/>- `dust`: `number`<br/><br/>**Returns:** `void` | None |
| **`DeckStore.saveDeck`**<br/>Location: `src/features/game-state/deck.ts`<br/>Persists the current deck to the database. Validates deck before saving. | **Params:**<br/>- `userId`: `string`<br/>- `deckName?`: `string`<br/><br/>**Returns:** `Promise<{ deckId: string, error?: string }>` | Returns `error?: string` in response object |
| **`DeckStore.submitDeck`**<br/>Location: `src/features/game-state/deck.ts`<br/>Submits a validated deck for battle. Locks the deck for the current week. | **Params:**<br/>- `userId`: `string`<br/>- `deckId`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`DeckStore.getUserDecks`**<br/>Location: `src/features/game-state/deck.ts`<br/>Retrieves all saved decks for a user. | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<Deck[]>` | None (returns empty array on error) |
| **`DeckStore.getDeckById`**<br/>Location: `src/features/game-state/deck.ts`<br/>Fetches a specific deck by ID with all card details. | **Params:**<br/>- `deckId`: `string`<br/><br/>**Returns:** `Promise<Deck \| null>` | Returns `null` if deck not found |
| **`DeckStore.clearDeck`**<br/>Location: `src/features/game-state/deck.ts`<br/>Removes all cards from the current draft deck. | **Params:** none<br/><br/>**Returns:** `void` | None |
| **`GameState.getUserBalance`**<br/>Location: `src/features/game-state/user.ts`<br/>Fetches current user currency balances from the server. | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<{ gold: number, dust: number }>` | None (throws on network error) |
| **`GameState.getUserStats`**<br/>Location: `src/features/game-state/user.ts`<br/>Retrieves user statistics including wins, losses, XP, and rank. | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<UserStats>` | None (throws on network error) |

### 1.5 Battle System (`src/features/battle`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`joinMatchmaking`**<br/>Location: `src/services/matchmaking.ts`<br/>Puts the user in the queue for a PvP battle with their current deck. | **Params:**<br/>- `userId`: `string`<br/>- `deckId`: `string`<br/><br/>**Returns:** `Promise<{ queueId: string, error?: string }>` | Returns `error?: string` in response object |
| **`leaveMatchmaking`**<br/>Location: `src/services/matchmaking.ts`<br/>Removes the user from the matchmaking queue. | **Params:**<br/>- `userId`: `string`<br/>- `queueId`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`getMatchStatus`**<br/>Location: `src/services/matchmaking.ts`<br/>Checks the current status of matchmaking (queued, matched, error). | **Params:**<br/>- `queueId`: `string`<br/><br/>**Returns:** `Promise<{ status: 'queued' \| 'matched' \| 'error', battleId?: string, error?: string }>` | Returns `error?: string` in response object or `status: 'error'` |
| **`subscribeToBattle`**<br/>Location: `src/services/realtime.ts`<br/>Sets up a Websocket listener for a specific battle ID to receive live damage updates. | **Params:**<br/>- `battleId`: `string`<br/>- `callback`: `(payload: BattleUpdate) => void`<br/><br/>**Returns:** `RealtimeChannel` (Object containing `.unsubscribe()`) | None (connection errors handled by callback) |
| **`BattleService.getBattleState`**<br/>Location: `src/services/battle.ts`<br/>Fetches the initial state of a battle (healths, decks, players). | **Params:**<br/>- `battleId`: `string`<br/><br/>**Returns:** `Promise<BattleState>` | None (throws on network error) |
| **`BattleService.getBattleHistory`**<br/>Location: `src/services/battle.ts`<br/>Retrieves past battles for a user with results and outcomes. | **Params:**<br/>- `userId`: `string`<br/>- `limit?`: `number` (Default 10)<br/><br/>**Returns:** `Promise<Battle[]>` | None (returns empty array on error) |
| **`BattleService.getActiveBattles`**<br/>Location: `src/services/battle.ts`<br/>Gets all currently active battles for a user. | **Params:**<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<Battle[]>` | None (returns empty array on error) |
| **`BattleService.forfeitBattle`**<br/>Location: `src/services/battle.ts`<br/>Allows a player to forfeit an active battle, marking opponent as winner. | **Params:**<br/>- `battleId`: `string`<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |
| **`WidgetBridge.sync`**<br/>Location: `src/features/bridge/index.ts`<br/>Serializes current Battle Health and writes to iOS Shared Group for the Widget. | **Params:**<br/>- `battleState`: `BattleData`<br/><br/>**Returns:** `Promise<void>` | None (throws on file system error) |

### 1.6 Draft System (`src/features/draft`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`DraftService.openPack`**<br/>Location: `src/services/draft.ts`<br/>Opens a card pack and returns randomized cards based on pack type. | **Params:**<br/>- `packType`: `'basic' \| 'premium' \| 'legendary'`<br/>- `userId`: `string`<br/><br/>**Returns:** `Promise<{ cards: Card[], error?: string }>` | Returns `error?: string` in response object |
| **`DraftService.draftCard`**<br/>Location: `src/services/draft.ts`<br/>Adds a drafted card to the user's inventory after pack opening. | **Params:**<br/>- `userId`: `string`<br/>- `cardId`: `string`<br/><br/>**Returns:** `Promise<{ success: boolean, error?: string }>` | Returns `error?: string` in response object |

### 1.7 Entropy & External APIs (`src/services/entropy`)

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`EntropyService.fetchEntropyEvents`**<br/>Location: `src/services/entropy.ts`<br/>Fetches rare disaster events from USGS/NASA APIs for Entropy faction cards. | **Params:**<br/>- `eventType?`: `'earthquake' \| 'solar_flare' \| 'all'`<br/>- `minMagnitude?`: `number` (Default 5.0)<br/><br/>**Returns:** `Promise<RawEvent[]>` | None (returns empty array on API error) |

## 🔵 Part 2: Backend (Server-Side)

These functions live in Supabase (`/supabase`). They run on the server to ensure security and handle heavy data processing.

### 2.1 The "Ingestion Engine" (`supabase/functions/ingest-events`)

Runs on CRON (e.g., every 1 hour). Fetches raw data and converts it into Cards.

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`fetchRawOdds`**<br/>Location: `supabase/functions/ingest-events/index.ts`<br/>Gets raw sports/finance data from external APIs (The Odds API, Polymarket). | **Params:**<br/>- `source`: `'sports' \| 'finance'`<br/><br/>**Returns:** `Promise<RawEvent[]>` | None (returns empty array on API error, logs errors) |
| **`enrichCardMetadata`**<br/>Location: `supabase/functions/ingest-events/ai.ts`<br/>Uses OpenAI to generate flavor text, titles, and color themes for raw events. | **Params:**<br/>- `event`: `RawEvent`<br/><br/>**Returns:** `Promise<{ title: string, description: string, color: string }>` | None (throws on API error) |
| **`upsertCard`**<br/>Location: `supabase/functions/ingest-events/db.ts`<br/>Saves card to DB. If event_id exists, updates probability; otherwise inserts new row. | **Params:**<br/>- `cardData`: `Card`<br/><br/>**Returns:** `Promise<void>` | None (throws on database error) |
| **`normalizeProbability`**<br/>Location: `supabase/functions/ingest-events/index.ts`<br/>Converts raw API probability data into standardized format (0.0-1.0). | **Params:**<br/>- `rawData`: `RawEvent`<br/>- `source`: `'sports' \| 'finance' \| 'entropy'`<br/><br/>**Returns:** `number` (Float 0.0 - 1.0) | None (throws on invalid data format) |
| **`calculateCardCost`**<br/>Location: `supabase/functions/ingest-events/index.ts`<br/>Determines card cost based on damage and rarity for shop pricing. | **Params:**<br/>- `damage`: `number`<br/>- `rarity`: `'common' \| 'rare' \| 'legendary'`<br/><br/>**Returns:** `number` (Cost in Gold) | None |

### 2.2 The "Referee" (`supabase/functions/resolve-battles`)

Runs on CRON (every 15 mins). Checks active battles and declares winners.

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`checkEventOutcomes`**<br/>Location: `supabase/functions/resolve-battles/index.ts`<br/>Queries DB for active cards where event_time < now. Checks API for final score/outcome. | **Params:** none<br/><br/>**Returns:** `Promise<void>` | None (logs errors, continues processing) |
| **`applyBattleDamage`**<br/>Location: `supabase/functions/resolve-battles/logic.ts`<br/>Sums damage of all newly resolved hit cards. Updates p1_health and p2_health in battles table. | **Params:**<br/>- `battleId`: `string`<br/><br/>**Returns:** `Promise<void>` | None (throws on database error) |
| **`finaliseBattle`**<br/>Location: `supabase/functions/resolve-battles/logic.ts`<br/>Ends the game if health <= 0 or week is over. Marks winner, distributes XP, sends Push Notification. | **Params:**<br/>- `battleId`: `string`<br/><br/>**Returns:** `Promise<void>` | None (throws on database/notification error) |
| **`distributeRewards`**<br/>Location: `supabase/functions/resolve-battles/logic.ts`<br/>Awards currency and XP to battle winner, updates user stats. | **Params:**<br/>- `battleId`: `string`<br/>- `winnerId`: `string`<br/><br/>**Returns:** `Promise<void>` | None (throws on database error) |
| **`createBattle`**<br/>Location: `supabase/functions/matchmaking/index.ts`<br/>Creates a new battle record when two players are matched. | **Params:**<br/>- `player1Id`: `string`<br/>- `player2Id`: `string`<br/>- `deck1Id`: `string`<br/>- `deck2Id`: `string`<br/><br/>**Returns:** `Promise<{ battleId: string, error?: string }>` | Returns `error?: string` in response object |

### 2.3 Database Triggers & Security (SQL)

Automatic logic that runs inside the PostgreSQL database.

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`handle_new_user`**<br/>Trigger Event: `INSERT ON auth.users`<br/>When a user signs up, auto-create a row in `public.profiles` with 1000 starter Dust. | **Returns:** `TRIGGER` | Raises SQL exception on failure |
| **`validate_deck_submission`**<br/>Trigger Event: `INSERT/UPDATE ON decks`<br/>Prevents cheating. Ensures the sum of `card.cost` is <= 100 before saving a deck. | **Returns:** `TRIGGER` | Raises SQL exception if validation fails |
| **`update_card_probability`**<br/>Trigger Event: `UPDATE ON cards`<br/>Automatically recalculates damage when probability changes. | **Returns:** `TRIGGER` | Raises SQL exception on calculation error |
| **`track_battle_updates`**<br/>Trigger Event: `UPDATE ON battles`<br/>Logs battle state changes for realtime updates and audit trail. | **Returns:** `TRIGGER` | Raises SQL exception on logging failure |

## 🔴 Part 3: Native Modules (iOS/Android)

Specific native functions to handle the Home Screen Widget.

| Name and Description | Data Types | Error Returns |
|---------------------|------------|--------------|
| **`TimelineProvider.getSnapshot`**<br/>Location: `ios/PickrWidget/PickrWidget.swift`<br/>Reads the shared JSON file written by React Native and renders the Widget UI. | **Params:**<br/>- `context`: `Context`<br/><br/>**Returns:** `WidgetEntry` (View) | Returns default/empty view on file read error |
| **`BackgroundTask.handleRefresh`**<br/>Location: `ios/Pickr/AppDelegate.mm`<br/>Wakes up the app in background to fetch new battle data if the app is closed. | **Params:**<br/>- `task`: `BGTask`<br/><br/>**Returns:** `void` | None (logs errors, marks task as complete) |

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
