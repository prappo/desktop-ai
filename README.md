# Desktop AI Chat

A modern ChatGPT-like desktop application built with Electron, React, TypeScript, and AI SDK.

## Features

- 🤖 **AI-Powered Chat**: Powered by OpenAI's GPT models via AI SDK
- 🎨 **Modern UI**: Built with React and shadcn/ui components
- ⚡ **Fast & Responsive**: Built with Vite for lightning-fast development
- 🔒 **Secure**: API key stored locally in localStorage
- 💬 **Real-time Chat**: Smooth conversation flow with typing indicators
- 🎯 **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd desktop-ai
```

2. Install dependencies:
```bash
npm install
```

3. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key for configuration

## Usage

1. Start the development server:
```bash
npm start
```

2. Configure your OpenAI API key:
   - Click the settings icon (⚙️) in the top-right corner
   - Enter your OpenAI API key
   - Click "Save"

3. Start chatting:
   - Type your message in the input field
   - Press Enter to send (Shift+Enter for new line)
   - The AI will respond in real-time

## Available Scripts

- `npm start` - Start the development server
- `npm run package` - Package the application for distribution
- `npm run make` - Create distributables for your platform
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ChatInterface.tsx
│   ├── Header.tsx
│   └── ConfigDialog.tsx
├── services/           # AI service layer
│   └── aiService.ts
├── lib/                # Utility functions
│   └── utils.ts
├── App.tsx             # Main app component
├── main.ts             # Electron main process
├── preload.ts          # Electron preload script
└── renderer.ts         # Electron renderer entry point
```

## Technologies Used

- **Electron**: Desktop app framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI component library
- **AI SDK**: AI integration
- **OpenAI**: AI model provider
- **Lucide React**: Icons

## Configuration

The application stores your OpenAI API key in localStorage. You can configure it through the settings dialog accessible via the settings icon in the header.

## Building for Production

To build the application for production:

```bash
npm run package
```

This will create a packaged version of your application in the `out` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
