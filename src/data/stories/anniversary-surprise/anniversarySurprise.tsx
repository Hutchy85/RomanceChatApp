import { Story } from '../../../types'
import imageMap from '../../imageMap';


export const anniversarySurprise: Story = {
  id: 'anniversary-surprise',
  title: 'Anniversary Surprise',
  description: "It's your first wedding anniversary with Olivia...",
  duration: '25 minutes',
  prologue: `One year of marriage to Olivia has flown by... (your full prologue text here)`,
  theme: 'Celebration & Spontaneity',
  image: 'aniversary',
  scenes: [
    {
      id: 'chat',
      type: 'chat',
      text: `Hey babe — I got a little surprise for tomorrow!`,
      characterName: 'Olivia',
      systemPrompt: `You're Olivia, celebrating your first wedding anniversary. Be affectionate, surprised by the plans, and express love freely.`,
      imageTriggers: [],
    },
],
};