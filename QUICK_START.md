# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Get a Database (2 minutes)
```bash
# Go to https://neon.tech
# Sign up (free)
# Create a project
# Copy the connection string
```

### 2. Configure (30 seconds)
```bash
# Edit .env file
DATABASE_URL="paste-your-neon-connection-string-here"
```

### 3. Setup Database (1 minute)
```bash
npm run db:generate
npm run db:push
```

### 4. Start App (30 seconds)
```bash
npm run dev
```

### 5. Test (1 minute)
```
1. Open http://localhost:3000/config
2. Add a rehearsal slot
3. Go to http://localhost:3000
4. Submit your availability
5. Check http://localhost:3000/analysis
```

## 📱 Pages

| URL | Purpose |
|-----|---------|
| `/` | Submit availability |
| `/config` | Manage slots |
| `/analysis` | View results |

## 🎯 Common Tasks

### Add a Rehearsal Slot
1. Go to `/config`
2. Fill in date, time, duration
3. Click "Add Slot"

### Submit Availability
1. Go to `/`
2. Enter your name
3. Check slots you can attend
4. Click "Submit"

### View Best Slots
1. Go to `/analysis`
2. Top slots are highlighted
3. Click "Show attendees" to see names

### Delete Slots
1. Go to `/config`
2. Click "Delete" on individual slots
3. Or click "Delete All" to clear everything

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Update database schema
npm run db:generate      # Generate Prisma client
npm run db:studio        # Open database GUI

# Production
npm run build            # Build for production
npm run start            # Start production server
```

## 🐛 Troubleshooting

**Can't connect to database?**
- Check your `.env` file has the correct `DATABASE_URL`
- Make sure the connection string includes `?sslmode=require`

**TypeScript errors?**
- Run `npm install`
- Restart your editor

**Build fails?**
- Delete `.next` folder: `rm -rf .next`
- Run `npm run build` again

**Changes not showing?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear `.next` and restart dev server

## 📦 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main

# 2. Go to vercel.com
# 3. Import your repository
# 4. Add DATABASE_URL environment variable
# 5. Deploy!
```

## 💡 Tips

- **Share the submission URL** via WhatsApp/email
- **Config page is for organizers** - don't share widely
- **Analysis updates in real-time** as people submit
- **Same name is OK** - multiple people can use the same name
- **Mobile-friendly** - works great on phones

## 📚 More Info

- Full setup: See `SETUP.md`
- Implementation details: See `IMPLEMENTATION_SUMMARY.md`
- Design specs: See `docs/design.md`
- Technical specs: See `docs/specs.md`

---

**Questions?** Check the `/docs` folder for detailed documentation.
