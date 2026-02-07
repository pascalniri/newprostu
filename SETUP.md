# Backend Setup Guide

This guide will help you configure Supabase and Cloudinary for the UMich Q&A platform.

---

## 1. Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - **Name**: umich-qa (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to finish setting up (~2 minutes)

### Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings** → **API** → **Service Role** section
4. Copy **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY` (Keep this secret!)

### Step 3: Run the Database Schema

1. Copy the entire contents of `supabase/schema.sql`
2. In Supabase dashboard, go to **SQL Editor**
3. Click "New Query"
4. Paste the schema SQL and click "Run"
5. Verify tables were created: Go to **Table Editor** - you should see `submissions`, `approved_content`, and `admins`

### Step 4: Create an Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click "Add User" → "Create new user"
3. Enter email and password for your admin account
4. Click "Create User"
5. Copy the **User UID** (looks like: `a1b2c3d4-...`)

### Step 5: Add Admin to Database

1. Go back to **SQL Editor**
2. Run this query (replace with your admin's UID and email):

```sql
insert into admins (id, email)
values ('YOUR-USER-UID-HERE', 'admin@example.com');
```

---

## 2. Cloudinary Setup

### Step 1: Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Choose the free plan (sufficient for testing)
3. Complete email verification

### Step 2: Get API Credentials

1. Go to your Cloudinary Dashboard
2. In the "Product Environment Credentials" section, you'll see:
   - **Cloud Name** → This is your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → This is your `CLOUDINARY_API_KEY`
   - **API Secret** → This is your `CLOUDINARY_API_SECRET` (Keep this secret!)

---

## 3. Configure Environment Variables

### Step 1: Create .env.local

1. In your project root, create a file named `.env.local`
2. Copy the template from `.env.example`
3. Fill in all the values you collected:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

---

## 4. Testing the Setup

### Test Submission Form

1. Go to `http://localhost:3000/ask-share`
2. Fill out all required fields
3. Optionally upload a file or add a link
4. Click "Submit for Approval"
5. You should see a success message

### Verify in Supabase

1. Go to Supabase **Table Editor** → **submissions**
2. You should see your submission

### Test Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. You should see your pending submission
3. Select a university and click "Approve"
4. Check **approved_content** table - your submission should be there

---

## 5. Security Notes

⚠️ **IMPORTANT**:

- Never commit `.env.local` to Git
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `CLOUDINARY_API_SECRET` private
- For production, add proper admin authentication
- Review and test RLS policies before going live

---

## 6. Next Steps

After setup is complete:

- [ ] Test file uploads with different file types
- [ ] Test the approval/rejection workflow
- [ ] Update the approved questions component to fetch from API
- [ ] Add admin authentication/login page
- [ ] Deploy to Vercel or your hosting platform

---

## Troubleshooting

**"Database connection failed"**

- Check that your Supabase URL and keys are correct
- Verify the project is fully provisioned in Supabase

**"Cloudinary upload failed"**

- Verify your Cloudinary credentials
- Check that your account is active

**"Submission not appearing in admin dashboard"**

- Check the `submissions` table in Supabase Table Editor
- Verify RLS policies are set up correctly
- Check browser console for API errors

**"Admin can't approve items"**

- Ensure your user ID is in the `admins` table
- Check that RLS policies allow admins to insert into `approved_content`
