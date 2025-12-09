# 🚀 Deploying to Vercel

Since you have a Vercel account, deploying is easy!

## Option 1: The "Magic" Command (Recommended for Quick Start)

We will use the Vercel CLI to deploy directly from your computer.

### 1. Run the Deploy Command
Open your terminal in this folder and run:
```bash
npx vercel
```

### 2. Follow the Interactive Prompts
- **Log in to Vercel:** It will open your browser.
- **Set up and deploy?** [Y]
- **Which scope?** (Select your account)
- **Link to existing project?** [N]
- **Project Name:** `boarding-house-mvp` (or verify default)
- **Directory:** `./` (default)
- **Want to modify details?** [N] (Defaults are good)

### 3. Add Environment Variables
After the command finishes, it will give you a **Production** URL. **IT WILL PROBABLY FAIL FIRST** because we haven't added the database keys.

1. Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select the `boarding-house-mvp` project.
3. Go to **Settings > Environment Variables**.
4. Add these three keys (Copy from your `.env.local` or `env.cloud`):

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lpacnleihvnmyuxbmgtq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Your long Anon Key starting with eyJ...)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your long Service Role Key starting with eyJ...)* |

### 4. Redeploy
Once variables are saved:
1. Go to the **Deployments** tab in Vercel.
2. Click the **three dots (...)** on the failed deployment.
3. Click **Redeploy**.

---

## Option 2: GitHub Integration (Best for Long Term)

1. Create a repository on GitHub.
2. Push this code to GitHub.
3. Login to Vercel and click "Add New... Project".
4. Import your GitHub repository.
5. Paste the Environment Variables during the import step.
6. Click **Deploy**.
