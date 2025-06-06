# Movie Hub

A modern movie discovery application built with Next.js, React, and The Movie Database (TMDB) API. Browse, search, and discover movies with a beautiful and responsive interface.

## Features

- 🎬 Browse popular and trending movies
- 🔍 Search for movies
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast performance with Next.js 15
- 🎨 Modern UI components with Radix UI
- 🔄 State management with Redux Toolkit

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js) or **yarn** or **pnpm** or **bun**

You can check your Node.js version by running:

```bash
node --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

## Installation

Follow these steps to set up the project locally:

### 1. Install dependencies

Choose one of the following package managers:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 2. Environment Setup

The project uses The Movie Database (TMDB) API to fetch movie data. You need to set up environment variables for the API to work properly.

#### Environment File (`.env.local`)

Create a `.env.local` file in the root directory of the project (same level as `package.json`) with the following variables:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

#### Environment Variables Explained:

- **`NEXT_PUBLIC_TMDB_API_KEY`** - Your TMDB API key (v3 auth)
- **`NEXT_PUBLIC_TMDB_ACCESS_TOKEN`** - Your TMDB Read Access Token (v4 auth)
- **`NEXT_PUBLIC_TMDB_BASE_URL`** - Base URL for TMDB API endpoints
- **`NEXT_PUBLIC_TMDB_IMAGE_BASE_URL`** - Base URL for TMDB image assets

#### How to Get TMDB API Credentials:

1. **Create a TMDB Account:**

   - Go to [The Movie Database](https://www.themoviedb.org/)
   - Sign up for a free account

2. **Get API Key:**

   - Go to your account settings
   - Navigate to the "API" section
   - Request an API key (choose "Developer" option)
   - Fill out the application form
   - Once approved, you'll get your API key

3. **Get Access Token:**

   - In the same API section
   - You'll find your "Read Access Token"
   - This is used for v4 API authentication

4. **Update Environment File:**
   - Replace `your_tmdb_api_key_here` with your actual API key
   - Replace `your_tmdb_access_token_here` with your actual access token

#### Important Notes:

- ⚠️ **Never commit your `.env.local` file to version control** - it contains sensitive API keys
- 🔒 The `.env.local` file is already included in `.gitignore`
- 🌐 Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- 🔄 Restart the development server after changing environment variables
- 📁 The `.env.local` file should be in the project root, not in the `src` folder

#### Example `.env.local` structure:

```
movie-hub/
├── .env.local          ← Environment file goes here
├── package.json
├── src/
└── ...
```

## Running the Project

### Development Mode

To start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The page will automatically reload when you make changes to the code.

### Production Build

To create a production build:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Linting

To run the linter:

```bash
npm run lint
```

## Project Structure

```
movie-hub/
├── src/                    # Source code
├── public/                 # Static assets
├── .next/                  # Next.js build output
├── node_modules/           # Dependencies
├── .env.local             # Environment variables
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **SASS** - CSS preprocessor

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

2. **Node modules issues**: If you encounter dependency issues, try:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Environment variables not loading**: Make sure your `.env.local` file is in the root directory and restart the development server.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [React Documentation](https://reactjs.org/docs) - learn React
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [TMDB API](https://developers.themoviedb.org/3) - The Movie Database API documentation

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
