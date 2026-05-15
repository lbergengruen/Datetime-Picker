# Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Neon account (free tier works great)

## Step 1: Set Up Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up or log in
3. Click "Create a project"
4. Give it a name (e.g., "rehearsal-scheduler")
5. Select a region close to you
6. Click "Create project"
7. Copy the connection string (it looks like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

## Step 2: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder with your actual Neon connection string:

```
DATABASE_URL="postgresql://your-actual-connection-string-here"
```

## Step 3: Initialize the Database

Run these commands to set up your database schema:

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push
```

You should see output confirming the schema was created successfully.

## Step 4: Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the App

1. **Go to Config page** (`/config`)
   - Add a few rehearsal slots
   - Try different dates and times
   - Test the delete functionality

2. **Go to Submission page** (`/`)
   - Enter your name
   - Select some slots
   - Submit your availability

3. **Go to Analysis page** (`/analysis`)
   - See which slots have the most attendance
   - Expand attendee lists
   - Check the ranking

## Troubleshooting

### "Can't reach database server"
- Make sure your `.env` file has the correct `DATABASE_URL`
- Verify the connection string is complete and correct
- Check that your Neon project is active

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Restart your IDE/editor

### Build errors
- Clear the `.next` folder: `rm -rf .next`
- Run `npm run build` again

## Optional: Prisma Studio

To view and manage your database visually:

```bash
npm run db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
5. Deploy!

Vercel will automatically:
- Install dependencies
- Build the app
- Deploy to a production URL

## Next Steps

- Share the submission page URL with your choir members
- Monitor responses on the analysis page
- Add more slots as needed via the config page

---

**Need help?** Check the documentation in the `/docs` folder.
