# Deploying the Vesak Card Application to Netlify

This guide will walk you through the steps to deploy your Vesak Card application to Netlify, allowing anyone to access and share cards from anywhere.

## Prerequisites

1. A GitHub account
2. A Netlify account (free tier is sufficient)
3. Your Vesak Card application code with Supabase integration

## Step 1: Prepare Your Repository

1. Push your code to a GitHub repository
2. Make sure your repository includes:
   - All HTML, CSS, and JavaScript files
   - The `netlify.toml` configuration file

## Step 2: Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose GitHub as your provider and authorize Netlify
4. Select your Vesak Card repository
5. Configure the deployment settings:
   - Build command: Leave blank or enter `echo 'No build required'`
   - Publish directory: `.` (root directory)
6. Click "Show advanced" and add the following environment variable:
   - Key: `SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2lscnRqZHJzY3hyeWx0a3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY1NzYsImV4cCI6MjA2MjQ1MjU3Nn0.8Z3FyDF_y81SxaeFXcP8qWLBhHpHkpJs6aOS6NpdNkY` (your Supabase anon key)
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Navigate to your project directory
4. Initialize a new Netlify site: `netlify init`
5. Follow the prompts to create a new site or connect to an existing one
6. Deploy your site: `netlify deploy --prod`

## Step 3: Configure Environment Variables

If you didn't set the environment variables during the initial deployment:

1. Go to your site dashboard in Netlify
2. Navigate to "Site settings" > "Environment variables"
3. Add the following environment variables:
   - Key: `SUPABASE_URL`
   - Value: `https://cisilrtjdrscxryltkxs.supabase.co`
   
   - Key: `SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2lscnRqZHJzY3hyeWx0a3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY1NzYsImV4cCI6MjA2MjQ1MjU3Nn0.8Z3FyDF_y81SxaeFXcP8qWLBhHpHkpJs6aOS6NpdNkY`

## Step 4: Update Your Application

You may need to modify the `config.js` file to use environment variables on Netlify:

```javascript
// config.js for production
const SUPABASE_URL = 'https://cisilrtjdrscxryltkxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpc2lscnRqZHJzY3hyeWx0a3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzY1NzYsImV4cCI6MjA2MjQ1MjU3Nn0.8Z3FyDF_y81SxaeFXcP8qWLBhHpHkpJs6aOS6NpdNkY';

// Initialize Supabase client
let supabase;

if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
}
```

## Step 5: Configure a Custom Domain (Optional)

1. Go to your site dashboard in Netlify
2. Navigate to "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to set up your domain

## Step 6: Test Your Deployment

1. Visit your Netlify site URL (e.g., `https://your-site-name.netlify.app`)
2. Create a new Vesak card and customize it
3. Share the card with someone
4. Open the shared link in a different browser or device to verify it works

## Troubleshooting

If you encounter issues with your deployment:

1. Check the deployment logs in Netlify
2. Verify your environment variables are set correctly
3. Ensure your Supabase project is properly configured
4. Check the browser console for any JavaScript errors

## Security Considerations

- The `netlify.toml` file includes Content Security Policy (CSP) headers to enhance security
- Your Supabase anon key is exposed in the client code, which is normal for public APIs but keep in mind its limitations
- Consider implementing rate limiting in Supabase for production use

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 