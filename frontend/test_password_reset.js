const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const admin = createClient(SUPABASE_URL, SERVICE_KEY);
const client = createClient(SUPABASE_URL, ANON_KEY);

async function testReset() {
    const email = 'test99@inea.mx';

    console.log("1. Fetching user...");
    const { data: { users }, error: listError } = await admin.auth.admin.listUsers();
    if (listError) return console.error("List users failed:", listError);

    const user = users.find(u => u.email === email);
    if (!user) return console.error("User not found!");
    console.log("User found:", user.id);

    console.log("2. Updating password...");
    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, {
        password: 'NewPassword123!',
        user_metadata: { updated_by: 'script' }
    });

    if (updateError) {
        console.error("Update failed:", updateError);
        // If update fails, API is broken
        return;
    }
    console.log("Password updated.");

    console.log("3. Attempting login...");
    const { data: { session }, error: loginError } = await client.auth.signInWithPassword({
        email: email,
        password: 'NewPassword123!'
    });

    if (loginError) {
        console.error("Login failed:", loginError);
    } else {
        console.log("LOGIN SUCCESS! Session Token:", session.access_token.substring(0, 20) + "...");
    }
}

testReset();
