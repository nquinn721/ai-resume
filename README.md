# MyAI Resume

A full-stack application with NestJS backend and React frontend.

## Project Structure

```
├── src/                    # NestJS backend source code
├── client/                 # React + TypeScript + Vite frontend
├── dist/                   # Compiled NestJS backend (generated)
├── package.json           # Backend dependencies and scripts
├── tsconfig.json          # TypeScript configuration for backend
└── README.md              # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm

## Getting Started

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Get an OpenAI API key:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file:

```env
OPENAI_API_KEY=your_actual_api_key_here
```

### Backend (NestJS)

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the development server:

```bash
npm run start:dev
```

The NestJS backend will run on `http://localhost:3000`

### Frontend (React + Vite)

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The React frontend will run on `http://localhost:5173`

## Available Scripts

### Backend Scripts

- `npm run build` - Build the NestJS application
- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot reload
- `npm run start:prod` - Start the production server (requires build first)

### Frontend Scripts (in client directory)

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## API Endpoints

- `GET /` - Returns a welcome message
- `GET /api/health` - Returns server health status

## Development

1. Start the backend server first:

```bash
npm run start:dev
```

2. In a new terminal, start the frontend:

```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

The frontend will automatically connect to the backend and display the connection status.

## Technologies Used

### Backend

- NestJS
- TypeScript
- Express.js
- Node.js

### Frontend

- React
- TypeScript
- Vite
- ESLint

## Features

- ✅ NestJS backend with TypeScript
- ✅ React frontend with TypeScript
- ✅ Vite for fast development
- ✅ CORS enabled for frontend-backend communication
- ✅ Health check endpoint
- ✅ Hot reload for both frontend and backend
- ✅ Production build scripts
- ✅ AI-powered resume chat using OpenAI GPT
- ✅ Resume document parsing (DOCX support)
- ✅ Real-time chat interface
- ✅ Project portfolio integration

## AI Chat Features

The application includes an intelligent AI chat bot that can:

- Answer questions about Nathan's resume and experience
- Provide detailed information about skills and technologies
- Discuss specific projects in the portfolio
- Give personalized responses based on resume content
- Fall back to rule-based responses if OpenAI API is unavailable

### AI Setup Requirements

1. **OpenAI API Key**: Required for intelligent responses

   - Without API key: Uses rule-based fallback system
   - With API key: Uses GPT-3.5-turbo for dynamic, contextual responses

2. **Resume Document**: Place your resume as `resume/NathanQuinn.docx`

3. **Projects Data**: Update `projects.json` with your actual projects

## Next Steps

This is a basic setup. You can extend it by:

- Adding a database (PostgreSQL, MongoDB, etc.)
- Implementing authentication
- Adding more API endpoints
- Setting up state management (Redux, Zustand)
- Adding styling frameworks (Tailwind CSS, Material-UI)
- Implementing AI resume features
- Adding testing (Jest, Cypress)
- Setting up CI/CD pipelines
