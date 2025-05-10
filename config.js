// Supabase configuration
// Use environment variables if available (for Netlify), otherwise use hardcoded values
const SUPABASE_URL = 'https://cisilrtjdrscxryltkxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2lscnRqZHJzY3hyeWx0a3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY1NzYsImV4cCI6MjA2MjQ1MjU3Nn0.8Z3FyDF_y81SxaeFXcP8qWLBhHpHkpJs6aOS6NpdNkY';

// Initialize the Supabase client (this will be used in script.js)
let supabase;

// Function to initialize Supabase
function initSupabase() {
    if (typeof window !== 'undefined') {
        try {
            // Check which property is available - this handles different versions of the Supabase UMD build
            if (window.supabase) {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase client initialized via window.supabase');
                return true;
            } else if (window.createClient) {
                supabase = window.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase client initialized via window.createClient');
                return true;
            } else {
                console.error('Could not find Supabase client in window object');
                return false;
            }
        } catch (err) {
            console.error('Error initializing Supabase client:', err);
            return false;
        }
    }
    return false;
}

// Try to initialize immediately if possible
const initialized = initSupabase();

// If not successful, try again when the document is fully loaded
if (!initialized && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!supabase) {
            initSupabase();
        }
    });
}

// Function to check if Supabase connection is working
async function testSupabaseConnection() {
    try {
        if (!supabase) {
            const initialized = initSupabase();
            if (!initialized) {
                console.error('Supabase client not initialized');
                return false;
            }
        }
        
        const { data, error } = await supabase.from('vesak_cards').select('count').limit(1);
        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        console.log('Supabase connection successful');
        return true;
    } catch (err) {
        console.error('Error testing Supabase connection:', err);
        return false;
    }
} 