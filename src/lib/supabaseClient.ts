import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://urygpnwnzazqngqhfqri.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyeWdwbnduemF6cW5ncWhmcXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ2NDMwNDMsImV4cCI6MTk5MDIxOTA0M30.XSc_yG8bytUoROo1RALNdJReLOZXE31U3yMO8cmecYU"
);
