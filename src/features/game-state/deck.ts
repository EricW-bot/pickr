import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';

type Deck = Database['public']['Tables']['decks']['Row'];
type DeckInsert = Database['public']['Tables']['decks']['Insert'];
type DeckUpdate = Database['public']['Tables']['decks']['Update'];

/**
 * Saves a deck to Supabase for the given user.
 * If the user already has a deck, it updates it; otherwise creates a new one.
 * 
 * @param userId - The authenticated user's ID
 * @param cardIds - Array of card IDs (max 3, can be fewer)
 * @returns Promise with success status and deck data or error
 */
export async function saveDeckToSupabase(
  userId: string,
  cardIds: string[]
): Promise<{ success: boolean; data?: Deck; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  if (cardIds.length === 0) {
    return { success: false, error: 'At least one card must be selected' };
  }

  try {
    console.log('Saving deck to Supabase...', { userId, cardIds });

    // Prepare deck data
    const deckData: DeckInsert = {
      user_id: userId,
      card_1_id: cardIds[0] || null,
      card_2_id: cardIds[1] || null,
      card_3_id: cardIds[2] || null,
      name: 'My Deck',
    };

    // Check if user already has a deck
    const { data: existingDeck, error: fetchError } = await supabase
      .from('decks')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      // PGRST116 is "no rows returned", which is fine - means no existing deck
      if (fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing deck:', fetchError);
        return { success: false, error: `Failed to check existing deck: ${fetchError.message}` };
      }
    }

    if (existingDeck) {
      // Update existing deck
      const updateData: DeckUpdate = {
        card_1_id: cardIds[0] || null,
        card_2_id: cardIds[1] || null,
        card_3_id: cardIds[2] || null,
        name: 'My Deck',
      };

      const { data: updatedDeck, error: updateError } = await supabase
        .from('decks')
        .update(updateData)
        .eq('id', existingDeck.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating deck:', updateError);
        return { success: false, error: `Failed to update deck: ${updateError.message}` };
      }

      console.log('Deck updated successfully:', updatedDeck);
      return { success: true, data: updatedDeck };
    } else {
      // Create new deck
      const { data: newDeck, error: insertError } = await supabase
        .from('decks')
        .insert(deckData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating deck:', insertError);
        return { success: false, error: `Failed to create deck: ${insertError.message}` };
      }

      console.log('Deck created successfully:', newDeck);
      return { success: true, data: newDeck };
    }
  } catch (error: any) {
    console.error('Unexpected error saving deck:', error);
    return { success: false, error: error?.message || 'Unknown error occurred' };
  }
}

/**
 * Fetches the user's saved deck from Supabase.
 * 
 * @param userId - The authenticated user's ID
 * @returns Promise with deck data or null if no deck exists
 */
export async function fetchUserDeck(
  userId: string
): Promise<{ success: boolean; data?: Deck | null; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User ID is required' };
  }

  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        // No deck found, which is fine
        return { success: true, data: null };
      }
      console.error('Error fetching deck:', error);
      return { success: false, error: `Failed to fetch deck: ${error.message}` };
    }

    return { success: true, data: data || null };
  } catch (error: any) {
    console.error('Unexpected error fetching deck:', error);
    return { success: false, error: error?.message || 'Unknown error occurred' };
  }
}
