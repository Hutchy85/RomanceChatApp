import imageMap from '../data/imageMap';

export interface ImageTrigger {
  keyword: string;
  images: string[];
}

export interface SceneTrigger {
  keyword: string;
  nextSceneIndex: string;
}

export interface Choice {
  text: string;
  nextSceneIndex?: string;
}

export interface Scene {
  id: string;
  type: 'chat' | 'story';
  text?: string;
  characterName?: string;
  systemPrompt?: string;
  imageTriggers?: ImageTrigger[];
  sceneTriggers?: SceneTrigger[];
  nextSceneIndex?: string;
  choices?: Choice[];
}

export interface Story {
  id: string;
  title: string;
  description: string;
  duration: string;
  prologue: string;
  theme: string;
  image: string;
  scenes: Scene[];
}


export const stories: Story[] = [
  {
    id: 'a-christmas-gift',
    title: 'A Christmas Gift',
    description: 'Its the day of your office christmas party and You and your wife are heading there tonight',
    duration: '30 minutes',
    prologue: `It's funny how time can slip away from you. One minute you're exchanging vows, promising to love and cherish each other, and the next thing you know, 12 years have passed. That's how long it's been since Holly and I got married. Twelve years of laughter, tears, and adventure.
            We've built a life together, one that's filled with love and comfort. Our relationship is strong, and I'm grateful for that. We still make each other laugh, still hold hands, still look into each other's eyes and feel that spark.
            But if I'm being honest, the excitement has worn off a little... in and out of the bedroom. We've fallen into a routine, a comfortable one, but a routine nonetheless. We know what to expect from each other, and while that's reassuring, it's also... predictable.
            I recently started a new job, hoping to shake things up a bit. I was feeling stagnant in my old role, and I thought a change of scenery would be just what I needed. But so far, it's been more of the same.
            I'm still adjusting, still trying to find my footing, but I'm not sure if it's going to be enough to reignite the spark that's been missing from our lives.
            As we approach another Christmas season, I'm reminded of how much I love this time of year. The lights, the decorations, the music... it all feels so festive and joyful. But amidst all the cheer, I have to admit that I'm not looking forward to one thing: the work party.
            It's a necessary evil, I suppose. A chance to mingle with colleagues and pretend to be interested in their lives. But for me, it's always been a source of stress. I'm not exactly the most outgoing person, and the thought of making small talk with people I barely know makes my skin crawl.
            Little did I know, tonight's party will be different. Tonight, something will happen that will change everything.
            As I sat at my desk pondering what to do about the party, my phone buzzed across the desk...`,

    theme: 'hotwife/cuckold',
    image: 'venice', // image key only
  scenes: [
    {
      id: 'chat',
      type: 'chat',
      characterName: 'Holly',
      systemPrompt: `You are Holly, a confident and playful woman in your mid-to-late 30s. You're married to John and want to convince him to attend his work Christmas party tonight.

Goals:

- Convince John to attend the Christmas party for networking purposes
- Help him feel more comfortable about meeting his new work colleagues
- Show him the two dress options (red dress and black jumpsuit) and ask for his opinion

Background:

- John has recently started a new job and hasn't had a chance to get to know his new colleagues yet.
- His new manager, Mike, is a bit of a bully and can be arrogant and obnoxious at times.
- John is feeling uneasy about attending the party and is hesitant to go.

Flow Order:

1. Acknowledge John's message and ask about his day
2. Mention the party and gauge his interest
3. Address his concerns about meeting new colleagues and dealing with Mike
4. Emphasize the importance of attending the party for networking purposes
5. Share some positive aspects of the party (e.g. having fun, relaxing with colleagues)
6. Show him the dress options and ask for his opinion
7. Ask to meet him back at home

Key Triggers:

- If John mentions feeling uneasy about meeting new colleagues, respond with a reassuring message and suggest that the party is a great opportunity to break the ice.
- If John expresses frustration about Mike, acknowledge his feelings and suggest that the party might be a chance to build a better relationship with him.
- If John asks about the dress code, send him the two dress options and ask for his opinion.
- If John asks, say "meet you at home"
Language and Tone:

- Be friendly and playful, but also understanding and empathetic.
- Use humor and sarcasm to help lighten the mood and make the conversation more enjoyable.
- Avoid being too pushy or aggressive in your attempts to convince John to attend the party.

Response Guidelines:

- Keep responses short and concise (1-2 sentences).
- Use a natural and conversational tone.
- Avoid repeating yourself or using overly formal language.
- Use only the following emojis: ❤️, 😘, and 🍷.

Example Responses:

- "Hey, how was your day? Anything exciting happen?"
- "I know you're feeling a bit uneasy about meeting new colleagues, but trust me, it'll be fine! The party is a great chance to break the ice and build some relationships."
- "I know Mike can be a bit much sometimes, but try to see the party as an opportunity to build a better relationship with him. Who knows, you might even have some fun!"
- "I was thinking of wearing either this red dress or this black jumpsuit. What do you think?"`
,
imageTriggers: [
  {
    keyword: 'red dress',
    images: [imageMap.redDress, imageMap.blackJumpsuit],
  },
],
sceneTriggers: [
  {
    keyword: 'home',
    nextSceneIndex: 'partyArrival',
  },
],
},
{
  id: 'partyArrival',
  type: 'story',
  text: "The party was in full swing. Fairy lights flickered around the room, and 'Jingle Bell Rock' filled the air. You stood by the drinks table, trying to smile as your coworkers told the same old office stories. Holly was radiant in a red dress, laughing easily with the other wives, her presence lighting up the room. Your boss, Mike, stood loudly holding court in the middle of the room, already half-cut. Holly leaned in. 'Wow, what an arsehole,' she whispered.",
  choices: [
    {
      text: "Laugh quietly and agree.",
      nextSceneIndex: 'party_scene_2a'
    },
    {
      text: "Stay quiet, unsure how to respond.",
      nextSceneIndex: 'party_scene_2b'
    },
    {
      text: "Say you want to leave already.",
      nextSceneIndex: 'party_scene_leave_early_check'
    }
  ]
},
{
  id: 'party_scene_2a',
  type: 'story',
  text: "'Yeah, he's a real treat,' you replied with a smirk. Holly grinned. 'Good, thought it was just me.' Just then, Mike stumbled over, his eyes roaming shamelessly over Holly. 'Well, well, look what we have here,' he slurred.",
  nextSceneIndex: 'party_scene_mike'
},
{
  id: 'party_scene_2b',
  type: 'story',
  text: "You stayed silent, not sure what to say. Holly gave you a sideways glance but didn’t push it. Just then, Mike stumbled over, his eyes roving all over Holly. 'Well, well, look what we have here,' he slurred.",
  nextSceneIndex: 'party_scene_mike'
},
{
  id: 'party_scene_mike',
  type: 'story',
  text: "'Hi Mike,' you said, but he barely acknowledged you. He turned to Holly with a sleazy grin. 'You must be the famous Holly. I see why John's so smug.' Your fists clenched involuntarily.",
  choices: [
    {
      text: "Confront Mike immediately.",
      nextSceneIndex: 'party_scene_confront'
    },
    {
      text: "Stay silent and let Holly deal with it.",
      nextSceneIndex: 'party_scene_holly_handles'
    }
  ]
},
{
  id: 'party_scene_confront',
  type: 'story',
  text: "'What exactly do you mean by that, Mike?' you asked, your tone tight. Mike laughed. 'Relax mate, just having a laugh.' Holly cut in coolly. 'I'll have a white wine, thanks.' Mike, deflated, shuffled off toward the bar.",
  nextSceneIndex: 'party_scene_check_in'
},
{
  id: 'party_scene_holly_handles',
  type: 'story',
  text: "You kept silent, letting Holly deal with it. 'I'll have a white wine, thanks,' she said flatly. Mike chuckled awkwardly and shuffled away toward the bar.",
  nextSceneIndex: 'party_scene_check_in'
},
{
  id: 'party_scene_check_in',
  type: 'story',
  text: "'You alright?' you asked as Holly turned back to you. 'Yeah,' she said, smiling faintly. 'What a creep though.' The music shifted to 'Last Christmas' as people kept drinking. You glanced around, unsure if you wanted to stay much longer.",
  choices: [
    {
      text: "'Let's leave now, this place is grim.'",
      nextSceneIndex: 'party_scene_leave'
    },
    {
      text: "'One more drink then we'll go.'",
      nextSceneIndex: 'party_scene_one_more'
    },
    {
      text: "'I should have punched him.'",
      nextSceneIndex: 'party_scene_holly_reacts'
    }
  ]
},
{
  id: 'party_scene_leave',
  type: 'story',
  text: "You took Holly’s hand. 'Let’s get out of here.' She smiled, relieved. You left the party behind, stepping out into the cold night air together.",
  nextSceneIndex: 'next_main_story_scene'
},
{
  id: 'party_scene_one_more',
  type: 'story',
  text: "'One more drink then we'll go,' you suggested. 'Alright,' Holly agreed. 'But you owe me pizza on the way home.' You both laughed.",
  nextSceneIndex: 'next_main_story_scene'
},
{
  id: 'party_scene_holly_reacts',
  type: 'story',
  text: "'I should've punched him,' you grumbled. Holly frowned. 'And make a scene? Nah. Not worth it.' You sensed a flicker of disappointment.",
  nextSceneIndex: 'party_scene_leave'
},
{
  id: 'party_scene_leave_early_check',
  type: 'story',
  text: "'I kinda wanna leave already,' you admitted. 'Bit early, isn't it?' Holly asked.",
  choices: [
    {
      text: "'Yeah, let's stick it out a bit longer.'",
      nextSceneIndex: 'party_scene_2a'
    },
    {
      text: "'Nah, let's just go.'",
      nextSceneIndex: 'party_scene_leave'
    }
  ]
},
{
      id: 'next_main_story_scene',
      type: 'chat',
      characterName: 'Mike',
      systemPrompt:
        `You are Mike, John's boss. You are a bit of a bully and can be arrogant and obnoxious at times. You have a tendency to make inappropriate comments, especially when you're drunk. You don't care about people's feelings and often put them down to make yourself feel superior.`,
      }
]
  },










{
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
},
{
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
},
];