
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key from your Supabase dashboard
// You can find these in your Supabase dashboard under Settings > API
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-actual-supabase-anon-key';

// Validate that the credentials are not the placeholders
if (supabaseUrl === 'https://your-project-id.supabase.co' || 
    supabaseAnonKey === 'your-actual-supabase-anon-key') {
  console.error('Please replace the placeholder Supabase credentials with your actual credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
