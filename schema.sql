-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.battles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  player_1_id uuid,
  player_2_id uuid,
  deck_1_id uuid,
  deck_2_id uuid,
  p1_health integer DEFAULT 1000,
  p2_health integer DEFAULT 1000,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'finished'::text])),
  winner_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT battles_pkey PRIMARY KEY (id),
  CONSTRAINT battles_player_1_id_fkey FOREIGN KEY (player_1_id) REFERENCES public.users(id),
  CONSTRAINT battles_player_2_id_fkey FOREIGN KEY (player_2_id) REFERENCES public.users(id),
  CONSTRAINT battles_deck_1_id_fkey FOREIGN KEY (deck_1_id) REFERENCES public.decks(id),
  CONSTRAINT battles_deck_2_id_fkey FOREIGN KEY (deck_2_id) REFERENCES public.decks(id),
  CONSTRAINT battles_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.users(id)
);
CREATE TABLE public.cards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id text NOT NULL,
  type text CHECK (type = ANY (ARRAY['sports'::text, 'finance'::text, 'entropy'::text])),
  title text NOT NULL,
  description text,
  image_url text DEFAULT 'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3'::text,
  rarity text CHECK (rarity = ANY (ARRAY['common'::text, 'rare'::text, 'legendary'::text])),
  probability real,
  damage integer,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'hit'::text, 'miss'::text])),
  resolves_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cards_pkey PRIMARY KEY (id)
);
CREATE TABLE public.club_invites (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  club_id uuid NOT NULL,
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'expired'::text])),
  created_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  CONSTRAINT club_invites_pkey PRIMARY KEY (id),
  CONSTRAINT club_invites_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id),
  CONSTRAINT club_invites_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id),
  CONSTRAINT club_invites_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.club_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  club_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member'::text CHECK (role = ANY (ARRAY['member'::text, 'admin'::text, 'owner'::text])),
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'banned'::text, 'left'::text])),
  joined_at timestamp with time zone DEFAULT now(),
  CONSTRAINT club_members_pkey PRIMARY KEY (id),
  CONSTRAINT club_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id),
  CONSTRAINT club_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.clubs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  slug text UNIQUE,
  description text,
  visibility text NOT NULL DEFAULT 'public'::text CHECK (visibility = ANY (ARRAY['public'::text, 'private'::text, 'hidden'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clubs_pkey PRIMARY KEY (id),
  CONSTRAINT clubs_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id)
);
CREATE TABLE public.decks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name text DEFAULT 'My Deck'::text,
  card_1_id uuid,
  card_2_id uuid,
  card_3_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT decks_pkey PRIMARY KEY (id),
  CONSTRAINT decks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT decks_card_1_id_fkey FOREIGN KEY (card_1_id) REFERENCES public.cards(id),
  CONSTRAINT decks_card_2_id_fkey FOREIGN KEY (card_2_id) REFERENCES public.cards(id),
  CONSTRAINT decks_card_3_id_fkey FOREIGN KEY (card_3_id) REFERENCES public.cards(id)
);
CREATE TABLE public.friend_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  CONSTRAINT friend_requests_pkey PRIMARY KEY (id),
  CONSTRAINT friend_requests_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id),
  CONSTRAINT friend_requests_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id)
);
CREATE TABLE public.friendships (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_a_id uuid NOT NULL,
  user_b_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'accepted'::text CHECK (status = ANY (ARRAY['accepted'::text, 'blocked'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT friendships_pkey PRIMARY KEY (id),
  CONSTRAINT friendships_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES public.users(id),
  CONSTRAINT friendships_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_cards (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  card_id uuid,
  acquired_at timestamp with time zone DEFAULT now(),
  is_equipped boolean DEFAULT false,
  CONSTRAINT user_cards_pkey PRIMARY KEY (id),
  CONSTRAINT user_cards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_cards_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  username text UNIQUE,
  avatar_url text,
  gold integer DEFAULT 100,
  dust integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  games_played integer DEFAULT 0,
  tokens integer,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);