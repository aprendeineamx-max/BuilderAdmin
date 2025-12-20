const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function checkLogin() {
    const email = 'test99@inea.mx';
    const password = 'Password123!';

    console.log(`Attempting login for ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error("LOGIN FAILED:", error.message);
        console.error("Error details:", error);
    } else {
        console.log("LOGIN SUCCESS!");
        console.log("User ID:", data.user.id);
        console.log("Session:", data.session ? "Active" : "None");
    }
}

checkLogin();
