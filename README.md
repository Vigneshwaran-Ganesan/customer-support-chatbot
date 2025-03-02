# CDP Support Chatbot

An intelligent support chatbot for Customer Data Platforms (CDPs) that provides documentation assistance and cross-platform comparisons.

## Prerequisites

- Node.js 20 or higher
- NPM or Yarn
- OpenAI API key

## Local Setup

1. Clone the repository
```bash
git clone <repository-url>
cd cdp-support-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
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

## Testing

To try out the chatbot:
1. Open the application in your browser
2. Select a specific CDP platform or "All Platforms"
3. Ask questions about CDP features or request comparisons
4. Observe the confidence levels and platform-specific answers

## Supported CDPs

- Segment
- mParticle
- Lytics
- Zeotap

## Error Handling

The chatbot includes:
- API rate limit handling with fallback responses
- Graceful error display in the UI
- Alternative documentation sources when AI is unavailable

## Questions and Support

For features and bugs, please open an issue in the repository.
For API key issues, visit https://platform.openai.com/docs