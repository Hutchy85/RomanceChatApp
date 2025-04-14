# Romance Chat App - React Native Mobile Version

This is a React Native mobile version of the Romance Chat App, a story-driven interactive romance chat application where users interact with an AI-powered version of their in-story wife.

## Features

- Story selection with multiple narrative options
- Immersive prologue to set the scene
- Interactive chat interface with AI-powered responses
- Dynamic emotional state system that evolves based on conversation
- Session saving and loading functionality
- Offline support with fallback responses

## Technical Overview

### Frontend

- React Native with Expo
- TypeScript for type safety
- React Navigation for screen navigation
- Context API for state management
- AsyncStorage for local persistence

### Backend Integration

- Connects to the existing FastAPI backend
- API client for handling all backend communication
- Fallback responses when API is unavailable

## Installation

1. Install dependencies:

```bash
cd RomanceChatApp
npm install
```

2. Start the Expo development server:

```bash
npm start
```

3. Run on Android/iOS simulator or scan the QR code with the Expo Go app

## Project Structure

```
RomanceChatApp/
├── App.tsx                  # Main application component
├── src/
│   ├── api/
│   │   └── apiClient.ts     # API client for backend communication
│   ├── components/          # Reusable UI components
│   ├── context/
│   │   └── AppContext.tsx   # Application state management
│   ├── navigation/
│   │   └── index.tsx        # Navigation configuration
│   ├── screens/
│   │   ├── StorySelectionScreen/
│   │   │   └── index.tsx    # Story selection screen
│   │   ├── PrologueScreen/
│   │   │   └── index.tsx    # Story prologue screen
│   │   └── ChatScreen/
│   │       └── index.tsx    # Interactive chat screen
│   └── types/
│       └── index.ts         # TypeScript type definitions
```

## Backend API Integration

The mobile app connects to the existing FastAPI backend using the following endpoints:

- `/api/generate_reply` - For AI responses
- `/api/initial_state/{story_id}` - For story initialization
- `/api/current_state/{session_id}` - For retrieving state
- `/api/save_state/{session_id}` - For saving state

The API client (`apiClient.ts`) handles all communication with these endpoints and provides fallback responses when the API is unavailable.

## State Management

The application uses React Context API for state management. The `AppContext` provides:

- Current story and emotional state
- Message history
- Saved sessions
- Methods for initializing states, generating responses, and saving conversations

## Offline Support

The app includes offline support with fallback responses when the API is unavailable:

- Cached story data and initial states
- Fallback response generation based on emotional state
- AsyncStorage for persistent storage of conversations

## Extending the Application

### Adding New Stories

1. Add new story data in the `StorySelectionScreen`
2. Add prologue content in the `PrologueScreen`
3. Add initial emotional state in the API client's fallback states

### Customizing UI

The app uses a consistent styling approach with a shared color palette:

- Primary color: `#ff6b6b`
- Secondary color: `#4ecdc4`
- Background color: `#f9f9f9`
- Text colors: `#333` (primary), `#777` (secondary)

## License

This project is licensed under the MIT License.
