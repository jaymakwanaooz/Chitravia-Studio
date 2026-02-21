# How to Deploy Chitravia Studio Website

You have several options to deploy your website since it is a static site (HTML/CSS/JS).

## Option 1: Netlify Drop (Fastest & Easiest)
**Best if you want it live in 30 seconds without installing anything.**

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Open your file explorer on your computer to:
   `d:\AntiG Projects\Chitravia Studio`
3. Drag and drop the **`website`** folder onto the Netlify Drop area in your browser.
4. Netlify will upload and deploy your site instantly.
5. You will get a live URL (e.g., `competent-kare-12345.netlify.app`).

## Option 2: Vercel (Professional & Recommended)
**Best for better performance and easy updates.**

### A. Using Vercel CLI (Command Line)
If you have Node.js installed:
1. Open your terminal in `d:\AntiG Projects\Chitravia Studio\website`.
2. Run the following commands:
   ```bash
   npm i -g vercel
   vercel
   ```
3. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? **chitravia-studio** (or just press Enter)
   - Directory located? **./** (Press Enter)
   - Want to modify settings? **N**

4. It will deploy and give you a `Production: https://chitravia-studio.vercel.app` link.

### B. Using GitHub + Vercel (Best Practice)
1. Initialize a Git repository in `d:\AntiG Projects\Chitravia Studio`.
2. Create a repository on GitHub.
3. Push your code to GitHub.
4. Go to [vercel.com](https://vercel.com), log in, and click "Add New... -> Project".
5. Import your GitHub repository.
6. Click **Deploy**. Vercel will automatically redeploy every time you push changes to GitHub.

## Important Note: Database Security
Your `config.js` file contains your **Supabase URL** and **Anon Key**.
- This is normal for client-side apps.
- **CRITICAL**: Ensure you have enabled **Row Level Security (RLS)** in your Supabase Dashboard for the `projects` table.
- Without RLS, anyone with your key (which is public on your deployed site) could delete or modify your data.
- **Go to Supabase -> Authentication -> Policies -> Enable RLS** for all tables.
