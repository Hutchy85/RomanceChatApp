# 📱 Romance Chat App

An interactive, narrative-driven chat game built with **React Native** and **TypeScript**. Players experience immersive romance stories through conversations, narrative scenes, and interactive choices that shape their relationships and story outcomes.

---

## ✨ Features

- 📖 **Story Selection**: Browse and select from available romance stories.
- ✍️ **Prologue and Narrative Scenes**: Set the tone for your story with rich written prologues and narrative sequences.
- 💬 **AI-Powered Chat Scenes**: Simulated chat interactions with characters, enhanced by dynamic mood and affection states.
- 🎨 **Dynamic Backgrounds**: Each scene displays a tailored background image to match the mood and setting.
- 📊 **Relationship Status Bar**: Tracks character stats like affection, trust, or respect in real-time.
- 🖼️ **Character Avatars by Mood** (coming soon)
- 💾 **Session Persistence**: Save player progress, visited scenes, and choices.
- 🌐 **FastAPI Backend** (future integration) for advanced AI interactions and cloud-saved sessions.

---

## 📸 Screenshots  

_Coming soon!_

---

## 🗂️ Project Structure  

src/
├── assets/
│ └── images/
│ └── backgrounds/
├── components/
│ └── RelationshipStatusBar.tsx
├── data/
│ ├── imageMap.tsx
│ ├── stories/
│ └── christmasGift.ts
├── navigation/
├── screens/
│ └── StorySceneScreen/
│ └── ChatScreen/
│ └── PrologueScreen/
├── types/
│ └── types.ts
└── App.tsx

yaml
Copy
Edit

---

## 📦 Tech Stack  

- **React Native (Expo)**
- **TypeScript**
- **React Navigation**
- **AsyncStorage** (local session saving)
- **FastAPI** (planned backend integration)
- **Lottie** (planned animated backgrounds)
- **Unsplash/Pexels images** for backgrounds

---

## 🚀 Getting Started  

### 📥 Install Dependencies  
npm install

shell
Copy
Edit

### 📱 Run on Device (via Expo)
npx expo start

yaml
Copy
Edit

---

## ✍️ Story Data Format  

Each story is a TypeScript module exporting an object:
```ts
export const christmasGift = {
  id: 'christmasGift',
  title: 'A Christmas Gift',
  prologue: 'It was a snowy December evening...',
  scenes: [
    {
      id: 'scene_1',
      text: 'You arrive at the party.',
      backgroundImageKey: 'partyNight',
      choices: [
        { text: 'Say hello.', nextSceneIndex: 'scene_2' }
      ]
    }
  ]
};
🎨 Dynamic Background Images
Mapped in src/data/imageMap.tsx:

ts
Copy
Edit
export const backgroundImages = {
  partyNight: require('../assets/images/backgrounds/partyNight.png'),
  snowyStreet: require('../assets/images/backgrounds/snowyStreet.png'),
  default: require('../assets/images/backgrounds/defaultImage.png')
};
Used inside StorySceneScreen:

tsx
Copy
Edit
<Image
  source={backgroundImages[scene.backgroundImageKey] || backgroundImages.default}
  style={commonStyles.backgroundImage}
/>
📖 Future Roadmap
 Animated background transitions (React Native Reanimated)

 AI-generated dialogue via FastAPI backend

 Character avatars that change with mood

 Audio ambiance linked to backgrounds

 Profile management screen

 Full save/load system with multiple save slots

🧑‍💻 Author
John Hutchinson (Communications Technician & Indie Developer)

📄 License
This project is licensed for personal and educational use.

