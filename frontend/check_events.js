const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function checkEvents() {
    console.log("Checking events table with ANON key...");
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
        console.error("Error fetching events:", error);
    } else {
        console.log("Events found:", data.length);
        console.log(data);
    }
}

checkEvents();
