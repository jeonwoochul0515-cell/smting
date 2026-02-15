import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwjcosbkrqnlucabqpxz.supabase.co';
const supabaseAnonKey = 'sb_publishable_Md0y6hb--GUIu2dMCFkO6w_6kOvE1C0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
