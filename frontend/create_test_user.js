const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'http://64.177.81.23:8000';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function createTestUser() {
    const email = 'tester@inea.mx';
    const password = 'Password123!';

    console.log(`Creating user: ${email}...`);

    // 1. Delete if exists (clean slate)
    const { error: delError } = await supabase.auth.admin.deleteUser(
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' // Fixed ID for consistency
    );
    if (delError) console.log("Delete warning (might not exist):", delError.message);

    // 2. Create User
    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { name: 'Tester Script' }
    });

    if (error) {
        console.error("Error creating user:", error);
    } else {
        console.log("User created successfully:", data.user.id);

        // 3. Create Profile (if trigger didn't catch it)
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                username: 'tester_script',
                full_name: 'Tester Script',
                avatar_url: 'https://ui-avatars.com/api/?name=TS'
            });

        if (profileError) console.error("Error creating profile:", profileError);
        else console.log("Profile created/updated.");
    }
}

createTestUser();
