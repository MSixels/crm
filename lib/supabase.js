import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://luupbrngmfnpripqqiua.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dXBicm5nbWZucHJpcHFxaXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczNjcxMzQsImV4cCI6MjA0Mjk0MzEzNH0.2RbEmoNovUwWKdVrOuI3HYEAhKnC_kacC9M1f5h_sk8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: false,
  }
})