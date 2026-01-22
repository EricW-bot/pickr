


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
  INSERT INTO public.users (id, username, gold, dust)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', 100, 0);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

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
    CONSTRAINT "battles_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'active'::"text", 'finished'::"text"])))
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
    "games_played" integer DEFAULT 0
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."battles"
    ADD CONSTRAINT "battles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



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



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_1_id_fkey" FOREIGN KEY ("card_1_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_2_id_fkey" FOREIGN KEY ("card_2_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_card_3_id_fkey" FOREIGN KEY ("card_3_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."decks"
    ADD CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_cards"
    ADD CONSTRAINT "user_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Cards are viewable by everyone." ON "public"."cards" FOR SELECT USING (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can insert own decks." ON "public"."decks" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own decks." ON "public"."decks" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can update own profile." ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can view own decks." ON "public"."decks" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can view own inventory." ON "public"."user_cards" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."battles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."decks" ENABLE ROW LEVEL SECURITY;


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

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."battles" TO "anon";
GRANT ALL ON TABLE "public"."battles" TO "authenticated";
GRANT ALL ON TABLE "public"."battles" TO "service_role";



GRANT ALL ON TABLE "public"."cards" TO "anon";
GRANT ALL ON TABLE "public"."cards" TO "authenticated";
GRANT ALL ON TABLE "public"."cards" TO "service_role";



GRANT ALL ON TABLE "public"."decks" TO "anon";
GRANT ALL ON TABLE "public"."decks" TO "authenticated";
GRANT ALL ON TABLE "public"."decks" TO "service_role";



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


