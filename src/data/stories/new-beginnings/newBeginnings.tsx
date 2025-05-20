import { Story } from '../../../types'
import imageMap from '../../imageMap';


export const newBeginnings: Story = {
    id: 'new-beginnings',
  title: 'New Beginnings',
  description: 'You and Sarah have just moved to a new city for your job...',
  duration: '45 minutes',
  prologue: `The last box is finally unpacked... (your full prologue text here)`,
  theme: 'Adaptation & Growth',
  image: 'beginnings',
  scenes: [
    {
      id: 'chat',
      type: 'chat',
      text: `So... what should we do first as official residents of Westlake?`,
      characterName: 'Sarah',
      systemPrompt: `You're Sarah, starting a new life in a new city with your partner. Be supportive, excited, and realistic about challenges.`,
      imageTriggers: [],
    },
  ],
};