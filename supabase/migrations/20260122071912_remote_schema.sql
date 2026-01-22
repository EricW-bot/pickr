drop extension if exists "pg_net";


  create table "public"."battles" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "player_1_id" uuid,
    "player_2_id" uuid,
    "deck_1_id" uuid,
    "deck_2_id" uuid,
    "p1_health" integer default 1000,
    "p2_health" integer default 1000,
    "status" text default 'pending'::text,
    "winner_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."battles" enable row level security;


  create table "public"."cards" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "event_id" text not null,
    "type" text,
    "title" text not null,
    "description" text,
    "image_url" text,
    "rarity" text,
    "probability" real,
    "damage" integer,
    "status" text default 'pending'::text,
    "resolves_at" timestamp with time zone,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."cards" enable row level security;


  create table "public"."decks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "name" text default 'My Deck'::text,
    "card_1_id" uuid,
    "card_2_id" uuid,
    "card_3_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."decks" enable row level security;


  create table "public"."user_cards" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "card_id" uuid,
    "acquired_at" timestamp with time zone default now(),
    "is_equipped" boolean default false
      );


alter table "public"."user_cards" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "username" text,
    "avatar_url" text,
    "gold" integer default 100,
    "dust" integer default 0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX battles_pkey ON public.battles USING btree (id);

CREATE UNIQUE INDEX cards_pkey ON public.cards USING btree (id);

CREATE UNIQUE INDEX decks_pkey ON public.decks USING btree (id);

CREATE UNIQUE INDEX user_cards_pkey ON public.user_cards USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."battles" add constraint "battles_pkey" PRIMARY KEY using index "battles_pkey";

alter table "public"."cards" add constraint "cards_pkey" PRIMARY KEY using index "cards_pkey";

alter table "public"."decks" add constraint "decks_pkey" PRIMARY KEY using index "decks_pkey";

alter table "public"."user_cards" add constraint "user_cards_pkey" PRIMARY KEY using index "user_cards_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."battles" add constraint "battles_deck_1_id_fkey" FOREIGN KEY (deck_1_id) REFERENCES public.decks(id) not valid;

alter table "public"."battles" validate constraint "battles_deck_1_id_fkey";

alter table "public"."battles" add constraint "battles_deck_2_id_fkey" FOREIGN KEY (deck_2_id) REFERENCES public.decks(id) not valid;

alter table "public"."battles" validate constraint "battles_deck_2_id_fkey";

alter table "public"."battles" add constraint "battles_player_1_id_fkey" FOREIGN KEY (player_1_id) REFERENCES public.users(id) not valid;

alter table "public"."battles" validate constraint "battles_player_1_id_fkey";

alter table "public"."battles" add constraint "battles_player_2_id_fkey" FOREIGN KEY (player_2_id) REFERENCES public.users(id) not valid;

alter table "public"."battles" validate constraint "battles_player_2_id_fkey";

alter table "public"."battles" add constraint "battles_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'finished'::text]))) not valid;

alter table "public"."battles" validate constraint "battles_status_check";

alter table "public"."battles" add constraint "battles_winner_id_fkey" FOREIGN KEY (winner_id) REFERENCES public.users(id) not valid;

alter table "public"."battles" validate constraint "battles_winner_id_fkey";

alter table "public"."cards" add constraint "cards_rarity_check" CHECK ((rarity = ANY (ARRAY['common'::text, 'rare'::text, 'legendary'::text]))) not valid;

alter table "public"."cards" validate constraint "cards_rarity_check";

alter table "public"."cards" add constraint "cards_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'hit'::text, 'miss'::text]))) not valid;

alter table "public"."cards" validate constraint "cards_status_check";

alter table "public"."cards" add constraint "cards_type_check" CHECK ((type = ANY (ARRAY['sports'::text, 'finance'::text, 'entropy'::text]))) not valid;

alter table "public"."cards" validate constraint "cards_type_check";

alter table "public"."decks" add constraint "decks_card_1_id_fkey" FOREIGN KEY (card_1_id) REFERENCES public.cards(id) not valid;

alter table "public"."decks" validate constraint "decks_card_1_id_fkey";

alter table "public"."decks" add constraint "decks_card_2_id_fkey" FOREIGN KEY (card_2_id) REFERENCES public.cards(id) not valid;

alter table "public"."decks" validate constraint "decks_card_2_id_fkey";

alter table "public"."decks" add constraint "decks_card_3_id_fkey" FOREIGN KEY (card_3_id) REFERENCES public.cards(id) not valid;

alter table "public"."decks" validate constraint "decks_card_3_id_fkey";

alter table "public"."decks" add constraint "decks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."decks" validate constraint "decks_user_id_fkey";

alter table "public"."user_cards" add constraint "user_cards_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE not valid;

alter table "public"."user_cards" validate constraint "user_cards_card_id_fkey";

alter table "public"."user_cards" add constraint "user_cards_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_cards" validate constraint "user_cards_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  INSERT INTO public.users (id, username, gold, dust)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', 100, 0);
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."battles" to "anon";

grant insert on table "public"."battles" to "anon";

grant references on table "public"."battles" to "anon";

grant select on table "public"."battles" to "anon";

grant trigger on table "public"."battles" to "anon";

grant truncate on table "public"."battles" to "anon";

grant update on table "public"."battles" to "anon";

grant delete on table "public"."battles" to "authenticated";

grant insert on table "public"."battles" to "authenticated";

grant references on table "public"."battles" to "authenticated";

grant select on table "public"."battles" to "authenticated";

grant trigger on table "public"."battles" to "authenticated";

grant truncate on table "public"."battles" to "authenticated";

grant update on table "public"."battles" to "authenticated";

grant delete on table "public"."battles" to "service_role";

grant insert on table "public"."battles" to "service_role";

grant references on table "public"."battles" to "service_role";

grant select on table "public"."battles" to "service_role";

grant trigger on table "public"."battles" to "service_role";

grant truncate on table "public"."battles" to "service_role";

grant update on table "public"."battles" to "service_role";

grant delete on table "public"."cards" to "anon";

grant insert on table "public"."cards" to "anon";

grant references on table "public"."cards" to "anon";

grant select on table "public"."cards" to "anon";

grant trigger on table "public"."cards" to "anon";

grant truncate on table "public"."cards" to "anon";

grant update on table "public"."cards" to "anon";

grant delete on table "public"."cards" to "authenticated";

grant insert on table "public"."cards" to "authenticated";

grant references on table "public"."cards" to "authenticated";

grant select on table "public"."cards" to "authenticated";

grant trigger on table "public"."cards" to "authenticated";

grant truncate on table "public"."cards" to "authenticated";

grant update on table "public"."cards" to "authenticated";

grant delete on table "public"."cards" to "service_role";

grant insert on table "public"."cards" to "service_role";

grant references on table "public"."cards" to "service_role";

grant select on table "public"."cards" to "service_role";

grant trigger on table "public"."cards" to "service_role";

grant truncate on table "public"."cards" to "service_role";

grant update on table "public"."cards" to "service_role";

grant delete on table "public"."decks" to "anon";

grant insert on table "public"."decks" to "anon";

grant references on table "public"."decks" to "anon";

grant select on table "public"."decks" to "anon";

grant trigger on table "public"."decks" to "anon";

grant truncate on table "public"."decks" to "anon";

grant update on table "public"."decks" to "anon";

grant delete on table "public"."decks" to "authenticated";

grant insert on table "public"."decks" to "authenticated";

grant references on table "public"."decks" to "authenticated";

grant select on table "public"."decks" to "authenticated";

grant trigger on table "public"."decks" to "authenticated";

grant truncate on table "public"."decks" to "authenticated";

grant update on table "public"."decks" to "authenticated";

grant delete on table "public"."decks" to "service_role";

grant insert on table "public"."decks" to "service_role";

grant references on table "public"."decks" to "service_role";

grant select on table "public"."decks" to "service_role";

grant trigger on table "public"."decks" to "service_role";

grant truncate on table "public"."decks" to "service_role";

grant update on table "public"."decks" to "service_role";

grant delete on table "public"."user_cards" to "anon";

grant insert on table "public"."user_cards" to "anon";

grant references on table "public"."user_cards" to "anon";

grant select on table "public"."user_cards" to "anon";

grant trigger on table "public"."user_cards" to "anon";

grant truncate on table "public"."user_cards" to "anon";

grant update on table "public"."user_cards" to "anon";

grant delete on table "public"."user_cards" to "authenticated";

grant insert on table "public"."user_cards" to "authenticated";

grant references on table "public"."user_cards" to "authenticated";

grant select on table "public"."user_cards" to "authenticated";

grant trigger on table "public"."user_cards" to "authenticated";

grant truncate on table "public"."user_cards" to "authenticated";

grant update on table "public"."user_cards" to "authenticated";

grant delete on table "public"."user_cards" to "service_role";

grant insert on table "public"."user_cards" to "service_role";

grant references on table "public"."user_cards" to "service_role";

grant select on table "public"."user_cards" to "service_role";

grant trigger on table "public"."user_cards" to "service_role";

grant truncate on table "public"."user_cards" to "service_role";

grant update on table "public"."user_cards" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Cards are viewable by everyone."
  on "public"."cards"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert own decks."
  on "public"."decks"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own decks."
  on "public"."decks"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view own decks."
  on "public"."decks"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view own inventory."
  on "public"."user_cards"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Public profiles are viewable by everyone."
  on "public"."users"
  as permissive
  for select
  to public
using (true);



  create policy "Users can update own profile."
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


