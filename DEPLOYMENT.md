# Deployment Guide

## Prerequisites

1. **Neon Database**: Create a PostgreSQL database at [neon.tech](https://neon.tech)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Git Repository**: Push your code to GitHub/GitLab/Bitbucket

## Setup Steps

### 1. Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Create a new database (or use the default one)
3. Copy the connection string from the dashboard
4. The connection string format: `postgresql://username:password@host:port/database?sslmode=require`

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NODE_ENV=production
REACT_APP_API_URL=https://your-domain.vercel.app/api
```

**Important**: Replace `your-domain` with your actual Vercel domain.

### 3. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

#### Option B: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on pushes to main branch
3. Set environment variables in Vercel dashboard

### 4. Database Schema

The database table will be created automatically when the server starts. The schema includes:

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Я должен', 'Мне должны', 'Miscellaneous')),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Local Development with Database

1. Create a `.env` file in the root directory:
```bash
DATABASE_URL=your_neon_connection_string
```

2. Start the development servers:
```bash
npm run dev
```

## Troubleshooting

### Database Connection Issues
- Ensure your Neon database is active (not hibernated)
- Check that the connection string is correct
- Verify that SSL is enabled in the connection string

### Deployment Issues
- Check Vercel build logs for errors
- Ensure all environment variables are set correctly
- Verify that the database is accessible from Vercel

### CORS Issues
- The backend is configured to allow all origins in development
- For production, you may want to restrict CORS to your domain

## Project Structure

```
todolist/
├── client/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/          # Express.js backend
│   ├── index.js     # Main server file
│   ├── db.js        # Database connection and queries
│   └── package.json
├── vercel.json      # Vercel configuration
└── package.json     # Root package.json
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | Environment mode | `production` |
| `REACT_APP_API_URL` | Frontend API URL | `https://your-app.vercel.app/api` |

## Features

- ✅ PostgreSQL database with Neon
- ✅ Vercel serverless deployment
- ✅ Automatic database table creation
- ✅ Environment-based configuration
- ✅ Production-ready error handling
- ✅ CORS configuration
- ✅ SSL database connection