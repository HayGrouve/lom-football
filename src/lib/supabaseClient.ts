import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rjydlkxnsngovhyghyuo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeWRsa3huc25nb3ZoeWdoeXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU5MzQxNzIsImV4cCI6MjAyMTUxMDE3Mn0.hg2dMRNxp6COTKSpAKNVC-WtlA62wiRyW5v4tz25dHk"
);
