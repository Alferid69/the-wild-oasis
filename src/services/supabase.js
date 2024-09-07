import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://erinohscqprjcpawlhcc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyaW5vaHNjcXByamNwYXdsaGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2ODcwMzEsImV4cCI6MjA0MDI2MzAzMX0.T6aGXJeOrLGkx2tWej6_ApKJ-43XnaPu7Frs2tWjx9E";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
