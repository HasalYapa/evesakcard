// Supabase configuration
// Use environment variables if available (for Netlify), otherwise use hardcoded values
const SUPABASE_URL = 'https://cisilrtjdrscxryltkxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2lscnRqZHJzY3hyeWx0a3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY1NzYsImV4cCI6MjA2MjQ1MjU3Nn0.8Z3FyDF_y81SxaeFXcP8qWLBhHpHkpJs6aOS6NpdNkY';

// Initialize the Supabase client (this will be used in script.js)
let supabase = null;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;

// Function to initialize Supabase with multiple attempts and fallbacks
function initSupabase() {
    if (initializationAttempts >= MAX_ATTEMPTS) {
        console.error('Maximum Supabase initialization attempts reached');
        return false;
    }
    
    initializationAttempts++;
    console.log(`Supabase initialization attempt ${initializationAttempts}`);
    
    if (typeof window !== 'undefined') {
        try {
            // Option 1: Using window.supabase (most common for UMD builds)
            if (window.supabase) {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase client initialized via window.supabase');
                return true;
            } 
            // Option 2: Using global createClient function
            else if (typeof createClient === 'function') {
                supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase client initialized via createClient');
                return true;
            }
            // Option 3: Using supabaseJs (some CDN builds)
            else if (window.supabaseJs && window.supabaseJs.createClient) {
                supabase = window.supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase client initialized via supabaseJs.createClient');
                return true;
            }
            // Option 4: No Supabase found, try loading it dynamically
            else {
                console.warn('Supabase not found in window object, loading dynamically...');
                loadSupabaseScript();
                return false;
            }
        } catch (err) {
            console.error('Error initializing Supabase client:', err.message);
            
            // If initialization fails, try loading the script again
            if (initializationAttempts < MAX_ATTEMPTS) {
                console.log('Trying dynamic script loading...');
                loadSupabaseScript();
            }
            
            return false;
        }
    }
    return false;
}

// Function to dynamically load Supabase script
function loadSupabaseScript() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js';
    script.async = true;
    
    script.onload = function() {
        console.log('Supabase script loaded dynamically');
        setTimeout(() => {
            initSupabase();
        }, 500); // Give it a moment to initialize
    };
    
    script.onerror = function() {
        console.error('Failed to load Supabase script');
        
        // Try alternative CDN
        if (initializationAttempts < MAX_ATTEMPTS) {
            const fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://unpkg.com/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js';
            fallbackScript.async = true;
            
            fallbackScript.onload = function() {
                console.log('Supabase loaded from fallback CDN');
                setTimeout(() => {
                    initSupabase();
                }, 500);
            };
            
            document.head.appendChild(fallbackScript);
        }
    };
    
    document.head.appendChild(script);
}

// First attempt to initialize
const initialized = initSupabase();

// If not successful on first try, try again when the document is fully loaded
if (!initialized && typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!supabase) {
            initSupabase();
        }
    });
    
    // Final fallback - try one more time after a delay
    window.addEventListener('load', function() {
        if (!supabase) {
            setTimeout(() => {
                initSupabase();
            }, 1000);
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
        
        // Make a simple query to test the connection
        const { data, error } = await supabase.from('vesak_cards').select('count').limit(1);
        
        if (error) {
            console.error('Supabase connection error:', error);
            
            // Check if it's a table doesn't exist error
            if (error.code === '42P01') {
                console.error('Table "vesak_cards" does not exist. Please create it first.');
                alert('The vesak_cards table does not exist in your Supabase database. Please create it using the SQL in SUPABASE_SETUP.md');
            }
            
            return false;
        }
        
        console.log('Supabase connection successful');
        return true;
    } catch (err) {
        console.error('Error testing Supabase connection:', err);
        return false;
    }
}

// Export for browser environments that don't have module support
if (typeof window !== 'undefined') {
    window.initSupabase = initSupabase;
    window.testSupabaseConnection = testSupabaseConnection;
} 