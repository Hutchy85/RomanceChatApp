export type {
  ImageTrigger,
  SceneTrigger,
  Choice,
  Scene,
  Story
} from '../types/index';

// Re-export the stories array
export { stories } from './stories/index';

// Re-export individual stories (optional, if needed elsewhere)
export { christmasGift } from './stories/a-christmas-gift/christmasGift';
export { newBeginnings } from './stories/new-beginnings/newBeginnings';
export { anniversarySurprise } from './stories/anniversary-surprise/anniversarySurprise';

// Keep the imageMap import for backward compatibility
import imageMap from './imageMap';
export { imageMap };