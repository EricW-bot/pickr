
  create policy "Players can delete their pending battles"
  on "public"."battles"
  as permissive
  for delete
  to authenticated
using (((( SELECT auth.uid() AS uid) = player_1_id) AND (status = 'pending'::text) AND (player_2_id IS NULL)));



