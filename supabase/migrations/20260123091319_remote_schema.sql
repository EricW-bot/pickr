
  create table "public"."club_invites" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "club_id" uuid not null,
    "from_user_id" uuid not null,
    "to_user_id" uuid not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "responded_at" timestamp with time zone
      );


alter table "public"."club_invites" enable row level security;


  create table "public"."club_members" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "club_id" uuid not null,
    "user_id" uuid not null,
    "role" text not null default 'member'::text,
    "status" text not null default 'active'::text,
    "joined_at" timestamp with time zone default now()
      );


alter table "public"."club_members" enable row level security;


  create table "public"."clubs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "owner_id" uuid not null,
    "name" text not null,
    "slug" text,
    "description" text,
    "visibility" text not null default 'public'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."clubs" enable row level security;


  create table "public"."friend_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "from_user_id" uuid not null,
    "to_user_id" uuid not null,
    "message" text,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "responded_at" timestamp with time zone
      );


alter table "public"."friend_requests" enable row level security;


  create table "public"."friendships" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_a_id" uuid not null,
    "user_b_id" uuid not null,
    "status" text not null default 'accepted'::text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."friendships" enable row level security;

alter table "public"."users" add column "tokens" integer;

CREATE UNIQUE INDEX club_invites_pkey ON public.club_invites USING btree (id);

CREATE UNIQUE INDEX club_members_pkey ON public.club_members USING btree (id);

CREATE UNIQUE INDEX club_members_unique ON public.club_members USING btree (club_id, user_id);

CREATE UNIQUE INDEX clubs_pkey ON public.clubs USING btree (id);

CREATE UNIQUE INDEX clubs_slug_key ON public.clubs USING btree (slug);

CREATE UNIQUE INDEX friend_requests_pkey ON public.friend_requests USING btree (id);

CREATE UNIQUE INDEX friendships_pkey ON public.friendships USING btree (id);

CREATE UNIQUE INDEX friendships_user_pair_unique ON public.friendships USING btree (user_a_id, user_b_id);

CREATE INDEX idx_battles_player1 ON public.battles USING btree (player_1_id);

CREATE INDEX idx_battles_player2 ON public.battles USING btree (player_2_id);

CREATE INDEX idx_club_invites_club_id ON public.club_invites USING btree (club_id);

CREATE INDEX idx_club_invites_from_user_id ON public.club_invites USING btree (from_user_id);

CREATE INDEX idx_club_invites_to_user_id ON public.club_invites USING btree (to_user_id);

CREATE INDEX idx_club_members_club_id ON public.club_members USING btree (club_id);

CREATE INDEX idx_club_members_user_id ON public.club_members USING btree (user_id);

CREATE INDEX idx_clubs_owner_id ON public.clubs USING btree (owner_id);

CREATE INDEX idx_decks_user_id ON public.decks USING btree (user_id);

CREATE INDEX idx_friend_requests_from_user_id ON public.friend_requests USING btree (from_user_id);

CREATE INDEX idx_friend_requests_to_user_id ON public.friend_requests USING btree (to_user_id);

CREATE INDEX idx_friendships_user_a_id ON public.friendships USING btree (user_a_id);

CREATE INDEX idx_friendships_user_b_id ON public.friendships USING btree (user_b_id);

CREATE INDEX idx_user_cards_user_id ON public.user_cards USING btree (user_id);

CREATE UNIQUE INDEX user_card_unique ON public.user_cards USING btree (user_id, card_id);

CREATE UNIQUE INDEX users_username_lower_idx ON public.users USING btree (lower(username));

alter table "public"."club_invites" add constraint "club_invites_pkey" PRIMARY KEY using index "club_invites_pkey";

alter table "public"."club_members" add constraint "club_members_pkey" PRIMARY KEY using index "club_members_pkey";

alter table "public"."clubs" add constraint "clubs_pkey" PRIMARY KEY using index "clubs_pkey";

alter table "public"."friend_requests" add constraint "friend_requests_pkey" PRIMARY KEY using index "friend_requests_pkey";

alter table "public"."friendships" add constraint "friendships_pkey" PRIMARY KEY using index "friendships_pkey";

alter table "public"."battles" add constraint "battles_winner_is_player" CHECK (((winner_id IS NULL) OR ((winner_id = player_1_id) OR (winner_id = player_2_id)))) not valid;

alter table "public"."battles" validate constraint "battles_winner_is_player";

alter table "public"."club_invites" add constraint "club_invites_club_id_fkey" FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE not valid;

alter table "public"."club_invites" validate constraint "club_invites_club_id_fkey";

alter table "public"."club_invites" add constraint "club_invites_from_user_id_fkey" FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."club_invites" validate constraint "club_invites_from_user_id_fkey";

alter table "public"."club_invites" add constraint "club_invites_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'expired'::text]))) not valid;

alter table "public"."club_invites" validate constraint "club_invites_status_check";

alter table "public"."club_invites" add constraint "club_invites_to_user_id_fkey" FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."club_invites" validate constraint "club_invites_to_user_id_fkey";

alter table "public"."club_members" add constraint "club_members_club_id_fkey" FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE not valid;

alter table "public"."club_members" validate constraint "club_members_club_id_fkey";

alter table "public"."club_members" add constraint "club_members_role_check" CHECK ((role = ANY (ARRAY['member'::text, 'admin'::text, 'owner'::text]))) not valid;

alter table "public"."club_members" validate constraint "club_members_role_check";

alter table "public"."club_members" add constraint "club_members_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'banned'::text, 'left'::text]))) not valid;

alter table "public"."club_members" validate constraint "club_members_status_check";

alter table "public"."club_members" add constraint "club_members_unique" UNIQUE using index "club_members_unique";

alter table "public"."club_members" add constraint "club_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."club_members" validate constraint "club_members_user_id_fkey";

alter table "public"."clubs" add constraint "clubs_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."clubs" validate constraint "clubs_owner_id_fkey";

alter table "public"."clubs" add constraint "clubs_slug_key" UNIQUE using index "clubs_slug_key";

alter table "public"."clubs" add constraint "clubs_visibility_check" CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text, 'hidden'::text]))) not valid;

alter table "public"."clubs" validate constraint "clubs_visibility_check";

alter table "public"."friend_requests" add constraint "friend_requests_from_user_id_fkey" FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_from_user_id_fkey";

alter table "public"."friend_requests" add constraint "friend_requests_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text]))) not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_status_check";

alter table "public"."friend_requests" add constraint "friend_requests_to_user_id_fkey" FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."friend_requests" validate constraint "friend_requests_to_user_id_fkey";

alter table "public"."friendships" add constraint "friendships_status_check" CHECK ((status = ANY (ARRAY['accepted'::text, 'blocked'::text]))) not valid;

alter table "public"."friendships" validate constraint "friendships_status_check";

alter table "public"."friendships" add constraint "friendships_user_a_id_fkey" FOREIGN KEY (user_a_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."friendships" validate constraint "friendships_user_a_id_fkey";

alter table "public"."friendships" add constraint "friendships_user_b_id_fkey" FOREIGN KEY (user_b_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."friendships" validate constraint "friendships_user_b_id_fkey";

alter table "public"."friendships" add constraint "friendships_user_pair_check" CHECK ((user_a_id < user_b_id)) not valid;

alter table "public"."friendships" validate constraint "friendships_user_pair_check";

alter table "public"."friendships" add constraint "friendships_user_pair_unique" UNIQUE using index "friendships_user_pair_unique";

alter table "public"."user_cards" add constraint "user_card_unique" UNIQUE using index "user_card_unique";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.normalize_friendship_pair()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
  tmp uuid;
BEGIN
  -- Only normalize on INSERT or UPDATE
  IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE') THEN
    IF NEW.user_a_id IS NULL OR NEW.user_b_id IS NULL THEN
      RAISE EXCEPTION 'friendship user ids cannot be null';
    END IF;

    IF NEW.user_a_id > NEW.user_b_id THEN
      tmp := NEW.user_a_id;
      NEW.user_a_id := NEW.user_b_id;
      NEW.user_b_id := tmp;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  INSERT INTO public.users (id, username, gold, dust, created_at)
  VALUES (
    NEW.id,
    COALESCE(
      -- prefer explicit username from raw_user_meta_data, fallback to email, fallback to generated
      NULLIF(NEW.raw_user_meta_data->>'username', ''),
      NULLIF(NEW.email, ''),
      'user_' || substring(NEW.id::text from 1 for 8)
    ),
    100,
    0,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."club_invites" to "anon";

grant insert on table "public"."club_invites" to "anon";

grant references on table "public"."club_invites" to "anon";

grant select on table "public"."club_invites" to "anon";

grant trigger on table "public"."club_invites" to "anon";

grant truncate on table "public"."club_invites" to "anon";

grant update on table "public"."club_invites" to "anon";

grant delete on table "public"."club_invites" to "authenticated";

grant insert on table "public"."club_invites" to "authenticated";

grant references on table "public"."club_invites" to "authenticated";

grant select on table "public"."club_invites" to "authenticated";

grant trigger on table "public"."club_invites" to "authenticated";

grant truncate on table "public"."club_invites" to "authenticated";

grant update on table "public"."club_invites" to "authenticated";

grant delete on table "public"."club_invites" to "service_role";

grant insert on table "public"."club_invites" to "service_role";

grant references on table "public"."club_invites" to "service_role";

grant select on table "public"."club_invites" to "service_role";

grant trigger on table "public"."club_invites" to "service_role";

grant truncate on table "public"."club_invites" to "service_role";

grant update on table "public"."club_invites" to "service_role";

grant delete on table "public"."club_members" to "anon";

grant insert on table "public"."club_members" to "anon";

grant references on table "public"."club_members" to "anon";

grant select on table "public"."club_members" to "anon";

grant trigger on table "public"."club_members" to "anon";

grant truncate on table "public"."club_members" to "anon";

grant update on table "public"."club_members" to "anon";

grant delete on table "public"."club_members" to "authenticated";

grant insert on table "public"."club_members" to "authenticated";

grant references on table "public"."club_members" to "authenticated";

grant select on table "public"."club_members" to "authenticated";

grant trigger on table "public"."club_members" to "authenticated";

grant truncate on table "public"."club_members" to "authenticated";

grant update on table "public"."club_members" to "authenticated";

grant delete on table "public"."club_members" to "service_role";

grant insert on table "public"."club_members" to "service_role";

grant references on table "public"."club_members" to "service_role";

grant select on table "public"."club_members" to "service_role";

grant trigger on table "public"."club_members" to "service_role";

grant truncate on table "public"."club_members" to "service_role";

grant update on table "public"."club_members" to "service_role";

grant delete on table "public"."clubs" to "anon";

grant insert on table "public"."clubs" to "anon";

grant references on table "public"."clubs" to "anon";

grant select on table "public"."clubs" to "anon";

grant trigger on table "public"."clubs" to "anon";

grant truncate on table "public"."clubs" to "anon";

grant update on table "public"."clubs" to "anon";

grant delete on table "public"."clubs" to "authenticated";

grant insert on table "public"."clubs" to "authenticated";

grant references on table "public"."clubs" to "authenticated";

grant select on table "public"."clubs" to "authenticated";

grant trigger on table "public"."clubs" to "authenticated";

grant truncate on table "public"."clubs" to "authenticated";

grant update on table "public"."clubs" to "authenticated";

grant delete on table "public"."clubs" to "service_role";

grant insert on table "public"."clubs" to "service_role";

grant references on table "public"."clubs" to "service_role";

grant select on table "public"."clubs" to "service_role";

grant trigger on table "public"."clubs" to "service_role";

grant truncate on table "public"."clubs" to "service_role";

grant update on table "public"."clubs" to "service_role";

grant delete on table "public"."friend_requests" to "anon";

grant insert on table "public"."friend_requests" to "anon";

grant references on table "public"."friend_requests" to "anon";

grant select on table "public"."friend_requests" to "anon";

grant trigger on table "public"."friend_requests" to "anon";

grant truncate on table "public"."friend_requests" to "anon";

grant update on table "public"."friend_requests" to "anon";

grant delete on table "public"."friend_requests" to "authenticated";

grant insert on table "public"."friend_requests" to "authenticated";

grant references on table "public"."friend_requests" to "authenticated";

grant select on table "public"."friend_requests" to "authenticated";

grant trigger on table "public"."friend_requests" to "authenticated";

grant truncate on table "public"."friend_requests" to "authenticated";

grant update on table "public"."friend_requests" to "authenticated";

grant delete on table "public"."friend_requests" to "service_role";

grant insert on table "public"."friend_requests" to "service_role";

grant references on table "public"."friend_requests" to "service_role";

grant select on table "public"."friend_requests" to "service_role";

grant trigger on table "public"."friend_requests" to "service_role";

grant truncate on table "public"."friend_requests" to "service_role";

grant update on table "public"."friend_requests" to "service_role";

grant delete on table "public"."friendships" to "anon";

grant insert on table "public"."friendships" to "anon";

grant references on table "public"."friendships" to "anon";

grant select on table "public"."friendships" to "anon";

grant trigger on table "public"."friendships" to "anon";

grant truncate on table "public"."friendships" to "anon";

grant update on table "public"."friendships" to "anon";

grant delete on table "public"."friendships" to "authenticated";

grant insert on table "public"."friendships" to "authenticated";

grant references on table "public"."friendships" to "authenticated";

grant select on table "public"."friendships" to "authenticated";

grant trigger on table "public"."friendships" to "authenticated";

grant truncate on table "public"."friendships" to "authenticated";

grant update on table "public"."friendships" to "authenticated";

grant delete on table "public"."friendships" to "service_role";

grant insert on table "public"."friendships" to "service_role";

grant references on table "public"."friendships" to "service_role";

grant select on table "public"."friendships" to "service_role";

grant trigger on table "public"."friendships" to "service_role";

grant truncate on table "public"."friendships" to "service_role";

grant update on table "public"."friendships" to "service_role";


  create policy "Players can create battles."
  on "public"."battles"
  as permissive
  for insert
  to authenticated
with check ((player_1_id = ( SELECT auth.uid() AS uid)));



  create policy "Players can update their battles."
  on "public"."battles"
  as permissive
  for update
  to authenticated
using (((player_1_id = ( SELECT auth.uid() AS uid)) OR (player_2_id = ( SELECT auth.uid() AS uid))))
with check (((player_1_id = ( SELECT auth.uid() AS uid)) OR (player_2_id = ( SELECT auth.uid() AS uid))));



  create policy "Players can view their battles."
  on "public"."battles"
  as permissive
  for select
  to authenticated
using (((player_1_id = ( SELECT auth.uid() AS uid)) OR (player_2_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can send club invites."
  on "public"."club_invites"
  as permissive
  for insert
  to authenticated
with check ((from_user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can update their club invites."
  on "public"."club_invites"
  as permissive
  for update
  to authenticated
using (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))))
with check (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can view their club invites."
  on "public"."club_invites"
  as permissive
  for select
  to authenticated
using (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can join clubs as members."
  on "public"."club_members"
  as permissive
  for insert
  to authenticated
with check ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can update their own club membership row."
  on "public"."club_members"
  as permissive
  for update
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)))
with check ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can view their club memberships."
  on "public"."club_members"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Clubs are viewable by everyone."
  on "public"."clubs"
  as permissive
  for select
  to public
using (true);



  create policy "Owners can update their clubs."
  on "public"."clubs"
  as permissive
  for update
  to authenticated
using ((owner_id = ( SELECT auth.uid() AS uid)))
with check ((owner_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can create clubs."
  on "public"."clubs"
  as permissive
  for insert
  to authenticated
with check ((owner_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can create outgoing friend requests."
  on "public"."friend_requests"
  as permissive
  for insert
  to authenticated
with check ((from_user_id = ( SELECT auth.uid() AS uid)));



  create policy "Users can update their friend requests."
  on "public"."friend_requests"
  as permissive
  for update
  to authenticated
using (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))))
with check (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can view their friend requests."
  on "public"."friend_requests"
  as permissive
  for select
  to authenticated
using (((from_user_id = ( SELECT auth.uid() AS uid)) OR (to_user_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can create friendships they are part of."
  on "public"."friendships"
  as permissive
  for insert
  to authenticated
with check (((user_a_id = ( SELECT auth.uid() AS uid)) OR (user_b_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can view their friendships."
  on "public"."friendships"
  as permissive
  for select
  to authenticated
using (((user_a_id = ( SELECT auth.uid() AS uid)) OR (user_b_id = ( SELECT auth.uid() AS uid))));



  create policy "Users can insert into own inventory."
  on "public"."user_cards"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER friendships_normalize_pair_tr BEFORE INSERT OR UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION public.normalize_friendship_pair();


