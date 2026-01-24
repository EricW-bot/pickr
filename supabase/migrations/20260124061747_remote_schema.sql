


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_catalog'
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_friendship_pair"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_catalog'
    AS $$
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
$$;


ALTER FUNCTION "public"."normalize_friendship_pair"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."battles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "player_1_id" "uuid",
    "player_2_id" "uuid",
    "deck_1_id" "uuid",
    "deck_2_id" "uuid",
    "p1_health" integer DEFAULT 1000,
    "p2_health" integer DEFAULT 1000,
    "status" "text" DEFAULT 'pending'::"text",
    "winner_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "battles_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'active'::"text", 'finished'::"text"]))),
    CONSTRAINT "battles_winner_is_player" CHECK ((("winner_id" IS NULL) OR (("winner_id" = "player_1_id") OR ("winner_id" = "player_2_id"))))
);


ALTER TABLE "public"."battles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "event_id" "text" NOT NULL,
    "type" "text",
    "title" "text" NOT NULL,
    "description" "text",
    "image_url" "text" DEFAULT 'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3'::"text",
    "rarity" "text",
    "probability" real,
    "damage" integer,
    "status" "text" DEFAULT 'pending'::"text",
    "resolves_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "cards_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'rare'::"text", 'legendary'::"text"]))),
    CONSTRAINT "cards_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'hit'::"text", 'miss'::"text"]))),
    CONSTRAINT "cards_type_check" CHECK (("type" = ANY (ARRAY['sports'::"text", 'finance'::"text", 'entropy'::"text"])))
);


ALTER TABLE "public"."cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."club_invites" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "from_user_id" "uuid" NOT NULL,
    "to_user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "responded_at" timestamp with time zone,
    CONSTRAINT "club_invites_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."club_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."club_members" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "club_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "joined_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "club_members_role_check" CHECK (("role" = ANY (ARRAY['member'::"text", 'admin'::"text", 'owner'::"text"]))),
    CONSTRAINT "club_members_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'banned'::"text", 'left'::"text"])))
);


ALTER TABLE "public"."club_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clubs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text",
    "description" "text",
    "visibility" "text" DEFAULT 'public'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "clubs_visibility_check" CHECK (("visibility" = ANY (ARRAY['public'::"text", 'private'::"text", 'hidden'::"text"])))
);


ALTER TABLE "public"."clubs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."decks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" "text" DEFAULT 'My Deck'::"text",
    "card_1_id" "uuid",
    "card_2_id" "uuid",
    "card_3_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."decks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friend_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "from_user_id" "uuid" NOT NULL,
    "to_user_id" "uuid" NOT NULL,
    "message" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "responded_at" timestamp with time zone,
    CONSTRAINT "friend_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."friend_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."friendships" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_a_id" "uuid" NOT NULL,
    "user_b_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'accepted'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "friendships_status_check" CHECK (("status" = ANY (ARRAY['accepted'::"text", 'blocked'::"text"]))),
    CONSTRAINT "friendships_user_pair_check" CHECK (("user_a_id" < "user_b_id"))
);


ALTER TABLE "public"."friendships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_cards" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "card_id" "uuid",
    "acquired_at" timestamp with time zone DEFAULT "now"(),
    "is_equipped" boolean DEFAULT false
);


ALTER TABLE "public"."user_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "username" "text",
    "avatar_url" "text",
    "gold" integer DEFAULT 100,
    "dust" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "wins" integer DEFAULT 0,
    "losses" integer DEFAULT 0,
    "draws" integer DEFAULT 0,
    "games_played" integer DEFAULT 0,
    "tokens" integer
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_invites"
    ADD CONSTRAINT "club_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_unique" UNIQUE ("club_id", "user_id");



ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_user_pair_unique" UNIQUE ("user_a_id", "user_b_id");



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_card_unique" UNIQUE ("user_id", "card_id");



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "idx_battles_player1" ON "public"."battles" USING "btree" ("player_1_id");



CREATE INDEX "idx_battles_player2" ON "public"."battles" USING "btree" ("player_2_id");



CREATE INDEX "idx_club_invites_club_id" ON "public"."club_invites" USING "btree" ("club_id");



CREATE INDEX "idx_club_invites_from_user_id" ON "public"."club_invites" USING "btree" ("from_user_id");



CREATE INDEX "idx_club_invites_to_user_id" ON "public"."club_invites" USING "btree" ("to_user_id");



CREATE INDEX "idx_club_members_club_id" ON "public"."club_members" USING "btree" ("club_id");



CREATE INDEX "idx_club_members_user_id" ON "public"."club_members" USING "btree" ("user_id");



CREATE INDEX "idx_clubs_owner_id" ON "public"."clubs" USING "btree" ("owner_id");



CREATE INDEX "idx_decks_user_id" ON "public"."decks" USING "btree" ("user_id");



CREATE INDEX "idx_friend_requests_from_user_id" ON "public"."friend_requests" USING "btree" ("from_user_id");



CREATE INDEX "idx_friend_requests_to_user_id" ON "public"."friend_requests" USING "btree" ("to_user_id");



CREATE INDEX "idx_friendships_user_a_id" ON "public"."friendships" USING "btree" ("user_a_id");



CREATE INDEX "idx_friendships_user_b_id" ON "public"."friendships" USING "btree" ("user_b_id");



CREATE INDEX "idx_user_cards_user_id" ON "public"."user_cards" USING "btree" ("user_id");



CREATE UNIQUE INDEX "users_username_lower_idx" ON "public"."users" USING "btree" ("lower"("username"));



CREATE OR REPLACE TRIGGER "friendships_normalize_pair_tr" BEFORE INSERT OR UPDATE ON "public"."friendships" FOR EACH ROW EXECUTE FUNCTION "public"."normalize_friendship_pair"();



ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_deck_1_id_fkey" FOREIGN KEY ("deck_1_id") REFERENCES "public"."decks"("id");



ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_deck_2_id_fkey" FOREIGN KEY ("deck_2_id") REFERENCES "public"."decks"("id");



ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_player_1_id_fkey" FOREIGN KEY ("player_1_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_player_2_id_fkey" FOREIGN KEY ("player_2_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."club_invites"
    ADD CONSTRAINT "club_invites_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_invites"
    ADD CONSTRAINT "club_invites_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_invites"
    ADD CONSTRAINT "club_invites_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."club_members"
    ADD CONSTRAINT "club_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clubs"
    ADD CONSTRAINT "clubs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_1_id_fkey" FOREIGN KEY ("card_1_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_2_id_fkey" FOREIGN KEY ("card_2_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_3_id_fkey" FOREIGN KEY ("card_3_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friend_requests"
    ADD CONSTRAINT "friend_requests_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_user_a_id_fkey" FOREIGN KEY ("user_a_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."friendships"
    ADD CONSTRAINT "friendships_user_b_id_fkey" FOREIGN KEY ("user_b_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Cards are viewable by everyone." ON "public"."cards" FOR SELECT USING (true);



CREATE POLICY "Clubs are viewable by everyone." ON "public"."clubs" FOR SELECT USING (true);



CREATE POLICY "Owners can update their clubs." ON "public"."clubs" FOR UPDATE TO "authenticated" USING (("owner_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Players can create battles." ON "public"."battles" FOR INSERT TO "authenticated" WITH CHECK (("player_1_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Players can update their battles." ON "public"."battles" FOR UPDATE TO "authenticated" USING ((("player_1_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("player_2_id" = ( SELECT "auth"."uid"() AS "uid")))) WITH CHECK ((("player_1_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("player_2_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Players can view their battles." ON "public"."battles" FOR SELECT TO "authenticated" USING ((("player_1_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("player_2_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can create clubs." ON "public"."clubs" FOR INSERT TO "authenticated" WITH CHECK (("owner_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can create friendships they are part of." ON "public"."friendships" FOR INSERT TO "authenticated" WITH CHECK ((("user_a_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("user_b_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can create outgoing friend requests." ON "public"."friend_requests" FOR INSERT TO "authenticated" WITH CHECK (("from_user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can insert into own inventory." ON "public"."user_cards" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can insert own decks." ON "public"."decks" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can join clubs as members." ON "public"."club_members" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can send club invites." ON "public"."club_invites" FOR INSERT TO "authenticated" WITH CHECK (("from_user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can update own decks." ON "public"."decks" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own profile." ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update their club invites." ON "public"."club_invites" FOR UPDATE TO "authenticated" USING ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid")))) WITH CHECK ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can update their friend requests." ON "public"."friend_requests" FOR UPDATE TO "authenticated" USING ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid")))) WITH CHECK ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can update their own club membership row." ON "public"."club_members" FOR UPDATE TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view own decks." ON "public"."decks" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view own inventory." ON "public"."user_cards" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view their club invites." ON "public"."club_invites" FOR SELECT TO "authenticated" USING ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can view their club memberships." ON "public"."club_members" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view their friend requests." ON "public"."friend_requests" FOR SELECT TO "authenticated" USING ((("from_user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("to_user_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can view their friendships." ON "public"."friendships" FOR SELECT TO "authenticated" USING ((("user_a_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("user_b_id" = ( SELECT "auth"."uid"() AS "uid"))));



ALTER TABLE "public"."battles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."club_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."club_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."clubs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friend_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."friendships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."battles";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."cards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."decks";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_cards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."normalize_friendship_pair"() TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_friendship_pair"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_friendship_pair"() TO "service_role";


















GRANT ALL ON TABLE "public"."battles" TO "anon";
GRANT ALL ON TABLE "public"."battles" TO "authenticated";
GRANT ALL ON TABLE "public"."battles" TO "service_role";



GRANT ALL ON TABLE "public"."cards" TO "anon";
GRANT ALL ON TABLE "public"."cards" TO "authenticated";
GRANT ALL ON TABLE "public"."cards" TO "service_role";



GRANT ALL ON TABLE "public"."club_invites" TO "anon";
GRANT ALL ON TABLE "public"."club_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."club_invites" TO "service_role";



GRANT ALL ON TABLE "public"."club_members" TO "anon";
GRANT ALL ON TABLE "public"."club_members" TO "authenticated";
GRANT ALL ON TABLE "public"."club_members" TO "service_role";



GRANT ALL ON TABLE "public"."clubs" TO "anon";
GRANT ALL ON TABLE "public"."clubs" TO "authenticated";
GRANT ALL ON TABLE "public"."clubs" TO "service_role";



GRANT ALL ON TABLE "public"."decks" TO "anon";
GRANT ALL ON TABLE "public"."decks" TO "authenticated";
GRANT ALL ON TABLE "public"."decks" TO "service_role";



GRANT ALL ON TABLE "public"."friend_requests" TO "anon";
GRANT ALL ON TABLE "public"."friend_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."friend_requests" TO "service_role";



GRANT ALL ON TABLE "public"."friendships" TO "anon";
GRANT ALL ON TABLE "public"."friendships" TO "authenticated";
GRANT ALL ON TABLE "public"."friendships" TO "service_role";



GRANT ALL ON TABLE "public"."user_cards" TO "anon";
GRANT ALL ON TABLE "public"."user_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."user_cards" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


