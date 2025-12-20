const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
// Using Service Key just to ensure we have permission to signup implies admin? 
// No, verify with Anon Key first.
const ANON_KEY_CHUNK = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// Note: I am using the key from secrets.md which I suspect is valid despite cutoff chunks. 
// If this fails 401, then Anon Key is definitely bad.

const supabase = createClient(SUPABASE_URL, ANON_KEY_CHUNK);

async function checkSignup() {
    const email = `newuser_${Date.now()}@inea.mx`;
    const password = 'Password123!';

    console.log(`Attempting signup for ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error("SIGNUP FAILED:", error.message);
        console.error("Status:", error.status);
    } else {
        console.log("SIGNUP SUCCESS!");
        console.log("User ID:", data.user ? data.user.id : "No User Object");
        console.log("Session:", data.session ? "Active" : "None (Check Email)");
    }
}

checkSignup();
