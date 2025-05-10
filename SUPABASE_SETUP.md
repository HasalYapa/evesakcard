# Supabase Setup for Vesak Card Application

This guide will help you set up Supabase as a backend for the Vesak Card application, allowing users to share cards across different devices.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. The Vesak Card application code

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in to your account
2. Click on "New Project"
3. Enter a name for your project (e.g., "vesak-card-app")
4. Choose a database password (save this securely)
5. Select a region closest to your target audience
6. Click "Create Project"

## Step 2: Set Up the Database Table

Once your project is created, you'll need to create a table to store card data:

1. In the Supabase dashboard, go to the "Table Editor" section
2. Click "New Table"
3. Set up the table with the following structure:

| Column Name | Type | Default | Primary Key | Is Nullable |
|-------------|------|---------|------------|-------------|
| id | int8 | nextval('vesak_cards_id_seq'::regclass) | Yes | No |
| created_at | timestamp with time zone | now() | No | Yes |
| card_id | text | NULL | No | No |
| recipient | text | NULL | No | Yes |
| message | text | NULL | No | Yes |
| theme | text | 'gold' | No | Yes |

4. Make sure to set the "card_id" column to be unique by adding a unique constraint
5. Click "Save" to create the table

## Step 3: Configure Access Controls

Set up appropriate Row Level Security (RLS) to protect your data:

1. Go to the "Authentication" section in the Supabase dashboard
2. Navigate to "Policies"
3. Find your "vesak_cards" table and click "Add Policy"
4. Create the following policies:

### Read Policy (for retrieving cards):
- Name: "Allow public read access"
- Operation: SELECT
- Target roles: Public
- Using expression: `true` (Anyone can read cards with the link)

### Write Policy (for creating cards):
- Name: "Allow public insert/update"
- Operation: INSERT, UPDATE
- Target roles: Public
- Using expression: `true` (Anyone can create/update cards)

## Step 4: Configure Your Application

1. Open the `config.js` file in your Vesak Card application
2. Replace the placeholder values with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

You can find these values in your Supabase project dashboard under "Settings" > "API".

## Step 5: Test Your Integration

1. Open your Vesak Card application
2. Create a card and click "Share Card"
3. Copy the shareable link
4. Open the link in a different browser or device
5. You should now see the card as it was created, with all the sender's content

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase credentials in `config.js`
3. Make sure your table structure matches the required fields
4. Confirm your RLS policies are set correctly

## Additional Security Considerations

For a production application, you might want to implement:

1. Rate limiting to prevent abuse
2. Content moderation to prevent inappropriate content
3. More sophisticated authentication for creating cards

## Support

If you need help with Supabase:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub](https://github.com/supabase/supabase)
- [Supabase Discord](https://discord.supabase.com) 