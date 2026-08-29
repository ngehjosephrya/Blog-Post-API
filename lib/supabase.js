import {createClient} from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/env.js';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables');
}

// Service role client - Admin access to Supabase, should be used server-side only
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);