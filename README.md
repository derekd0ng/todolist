# Todo List App

A minimalistic and sleek todo application built with React frontend and Express.js API, optimized for both desktop and mobile usage.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Inline editing of todo text
- ✅ Responsive design for desktop and mobile
- ✅ Clean, minimalistic UI
- ✅ Error handling and loading states

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js with Node.js
- **Storage**: In-memory (ready for database integration)
- **Deployment**: Vercel (with Neon database ready)

## Development

1. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   This will start both the React client (port 3000) and Express server (port 5000).

## Deployment

The app is configured for Vercel deployment with the following setup:

1. **Build Process**: `npm run build` builds the React app
2. **Static Files**: Client build files are served statically
3. **API Routes**: Server endpoints are handled by Vercel serverless functions
4. **Database**: Ready for Neon PostgreSQL integration

### Database Migration (Future)

When ready to add persistent storage:

1. Set up Neon PostgreSQL database
2. Replace in-memory storage with database queries
3. Add environment variables for database connection
4. Update API endpoints to use database operations

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the React app for production
- `npm start` - Start the production server
- `npm run client` - Start only the React client
- `npm run server` - Start only the Express server

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Mobile Responsive

The app is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Optimized layouts for small screens
- Responsive typography and spacing