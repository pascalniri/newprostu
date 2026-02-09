import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// For server-side operations that need elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
