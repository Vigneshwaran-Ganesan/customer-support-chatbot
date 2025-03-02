# CDP Support Chatbot

An intelligent support chatbot for Customer Data Platforms (CDPs) that provides documentation assistance and cross-platform comparisons.

## Prerequisites

- Node.js 20 or higher
- NPM or Yarn
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: PostgreSQL database URL (optional, defaults to in-memory storage)

## Features

- Multi-source intelligent documentation Q&A
- Advanced natural language processing
- Cross-platform CDP documentation and comparison
- Intelligent fallback mechanisms
- Platform-specific context awareness

## Supported CDPs

- Segment
- mParticle
- Lytics
- Zeotap
