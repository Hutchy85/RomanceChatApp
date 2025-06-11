import { Audio } from 'expo-av';

let backgroundMusic: Audio.Sound | null = null;

export const playBackgroundMusic = async () => {
  if (backgroundMusic) return;

  backgroundMusic = new Audio.Sound();
  try {
    await backgroundMusic.loadAsync(require('../assets/audio/ambient_loop.mp3'));
    await backgroundMusic.setIsLoopingAsync(true);
    await backgroundMusic.playAsync();
  } catch (error) {
    console.log('Error playing background music:', error);
  }
};

export const stopBackgroundMusic = async () => {
  if (backgroundMusic) {
    await backgroundMusic.stopAsync();
    await backgroundMusic.unloadAsync();
    backgroundMusic = null;
  }
};

export const playSoundEffect = async (effectPath: any) => {
  const soundEffect = new Audio.Sound();
  try {
    await soundEffect.loadAsync(effectPath);
    await soundEffect.playAsync();
    // Clean up after playback
    soundEffect.setOnPlaybackStatusUpdate((status) => {
      if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
        soundEffect.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing sound effect:', error);
  }
};