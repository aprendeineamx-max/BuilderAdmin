const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

async function forceReset() {
    const uid = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
    console.log(`Forcing password reset for ${uid}...`);

    const { data, error } = await admin.auth.admin.updateUserById(uid, {
        password: 'Password123!',
        email_confirm: true // Ensure it stays confirmed
    });

    if (error) {
        console.error("RESET FAILED:", error);
    } else {
        console.log("RESET SUCCESS!");
        console.log("User Email:", data.user.email);
    }
}

forceReset();
