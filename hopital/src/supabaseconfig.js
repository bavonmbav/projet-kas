import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdzlkoftuhdtaxqbgqto.supabase.co'; // Remplacez par votre URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkemxrb2Z0dWhkdGF4cWJncXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDExMDAsImV4cCI6MjAzMzM3NzEwMH0.Tm4vMZxIX-o_bHg4FXyyZN5huYr0CLflcrbwrWV5R3Q'; // Remplacez par votre clé anonyme

export const supabase = createClient(supabaseUrl, supabaseKey);
