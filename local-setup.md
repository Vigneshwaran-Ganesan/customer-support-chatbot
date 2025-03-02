
# Local Setup Instructions

This guide will help you run the CDP Support Chatbot locally on your machine.

## Prerequisites

- Node.js 20 or higher
- NPM or Yarn
- OpenAI API key

## Setup Steps

1. Clone or download the repository to your local machine.

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Ensure you have a `.env` file in the root directory
   - Make sure your `.env` file contains your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Access the application at `http://localhost:5000`

## Troubleshooting

- If you encounter CORS issues, make sure your client is configured to connect to the correct server URL.
- If the API key is not recognized, verify that the `.env` file is in the root directory and formatted correctly.
- For package-related errors, try running `npm install` again to ensure all dependencies are properly installed.

## Additional Commands

- Build for production: `npm run build`
- Start production server: `npm run start`
- Type checking: `npm run check`
