import { Story } from '../../../types';
import imageMap from '../../imageMap';
import { characterPrompts } from '../../characters';

export const christmasGift: Story = {
  id: 'a-christmas-gift',
  title: 'A Christmas Gift',
  description: 'It’s the day of your office Christmas party and you and your wife are heading there tonight.',
  duration: '30 minutes',
  prologue: `It's funny how time can slip away from you. One minute you're exchanging vows, promising to love and cherish each other, and the next thing you know, 12 years have passed. That's how long it's been since Holly and I got married. Twelve years of laughter, tears, and adventure. We've built a life together, one that's filled with love and comfort. Our relationship is strong, and I'm grateful for that. We still make each other laugh, still hold hands, still look into each other's eyes and feel that spark. But if I'm being honest, the excitement has worn off a little... in and out of the bedroom. We've fallen into a routine, a comfortable one, but a routine nonetheless. We know what to expect from each other, and while that's reassuring, it's also... predictable. I recently started a new job, hoping to shake things up a bit. I was feeling stagnant in my old role, and I thought a change of scenery would be just what I needed. But so far, it's been more of the same. I'm still adjusting, still trying to find my footing, but I'm not sure if it's going to be enough to reignite the spark that's been missing from our lives. As we approach another Christmas season, I'm reminded of how much I love this time of year. The lights, the decorations, the music... it all feels so festive and joyful. But amidst all the cheer, I have to admit that I'm not looking forward to one thing: the work party. It's a necessary evil, I suppose. A chance to mingle with colleagues and pretend to be interested in their lives. But for me, it's always been a source of stress. I'm not exactly the most outgoing person, and the thought of making small talk with people I barely know makes my skin crawl. Little did I know, tonight's party will be different. Tonight, something will happen that will change everything. As I sat at my desk pondering what to do about the party, my phone buzzed across the desk...`,
  theme: 'hotwife/cuckold',
  image: 'venice',
  scenes: [
    {
      id: 'chat',
      type: 'chat',
      characterName: 'Holly',
      systemPrompt: characterPrompts.Holly1,
      imageTriggers: [
        {
          keyword: 'red dress',
          images: [imageMap.redDress, imageMap.blackJumpsuit],
        },
      ],
      sceneTriggers: [
        { keyword: 'meet you at home', nextSceneIndex: 'partyArrival' },
        { keyword: 'see you at home', nextSceneIndex: 'partyArrival' },
        { keyword: 'heading home now', nextSceneIndex: 'partyArrival' },
      ],
    },

    {
      id: 'partyArrival',
      type: 'story',
      text: "The party was in full swing. Fairy lights flickered around the room, and 'Jingle Bell Rock' filled the air. You stood by the drinks table, trying to smile as your coworkers told the same old office stories. Holly was radiant in a red dress, laughing easily with the other wives, her presence lighting up the room. Your boss, Mike, stood loudly holding court in the middle of the room, already half-cut. Holly leaned in. 'Wow, what an arsehole,' she whispered.",
  choices: [
        { text: "Laugh quietly and agree.", nextSceneIndex: 'party_scene_2a', effects: { respect: +2, affection: +1 } },
        { text: "Stay quiet, unsure how to respond.", nextSceneIndex: 'party_scene_2b', effects: { respect: -1, affection: +1 } },
        { text: "Say you want to leave already.", nextSceneIndex: 'party_scene_leave_early_check', effects: { respect: -2, affection: -1 } },
      ],
    },

    {
      id: 'party_scene_2a',
      type: 'story',
      text: "'Yeah, he's a real treat,' you replied...",
      nextSceneIndex: 'party_scene_mike',
    },

    {
      id: 'party_scene_2b',
      type: 'story',
      text: "You stayed silent, not sure what to say...",
      nextSceneIndex: 'party_scene_mike',
    },

    {
      id: 'party_scene_mike',
      type: 'story',
      text: "'Hi Mike,' you said, but he barely acknowledged you...",
      choices: [
  {
    text: "Confront Mike immediately.",
    nextSceneIndex: 'party_scene_confront',
    effects: { respect: +2, trust: +2 }
  },
  {
    text: "Stay silent and let Holly deal with it.",
    nextSceneIndex: 'party_scene_holly_handles',
    effects: { affection: -1, respect: -2 }
  },
],

    },

    {
      id: 'party_scene_confront',
      type: 'story',
      text: "'What exactly do you mean by that, Mike?' you asked...",
      nextSceneIndex: 'party_scene_check_in',
    },

    {
      id: 'party_scene_holly_handles',
      type: 'story',
      text: "You kept silent, letting Holly deal with it...",
      nextSceneIndex: 'party_scene_check_in',
    },

    {
      id: 'party_scene_check_in',
      type: 'story',
      text: "'You alright?' you asked as Holly turned back to you...",
      choices: [
        { text: "'Let's leave now, this place is grim.'", nextSceneIndex: 'party_scene_leave' },
        { text: "'One more drink then we'll go.'", nextSceneIndex: 'party_scene_one_more' },
        { text: "'I should have punched him.'", nextSceneIndex: 'party_scene_holly_reacts' },
      ],
    },

    {
      id: 'party_scene_leave',
      type: 'story',
      text: "You took Holly’s hand. 'Let’s get out of here.'...",
      nextSceneIndex: 'drive_home',
    },

    {
      id: 'party_scene_one_more',
      type: 'story',
      text: "'One more drink then we'll go,' you suggested...",
      nextSceneIndex: 'drive_home',
    },

    {
      id: 'party_scene_holly_reacts',
      type: 'story',
      text: "'I should've punched him,' you grumbled...",
      nextSceneIndex: 'party_scene_leave',
      effects: { trust: +2, respect: +2 }

    },

    {
      id: 'party_scene_leave_early_check',
      type: 'story',
      text: "'I kinda wanna leave already,' you admitted...",
      choices: [
  {
    text: "'Yeah, let's stick it out a bit longer.'",
    nextSceneIndex: 'party_scene_2a',
    effects: { respect: +1 }
  },
  {
    text: "'Nah, let's just go.'",
    nextSceneIndex: 'party_scene_leave',
    effects: { affection: +1, respect: -1 }
  },
]

    },
{
  id: 'drive_home',
  type: 'story',
  text: "The cab ride home was quiet. Holly stared out the window, the city lights reflecting off her face. 'That was... interesting,' she finally said. 'Mike was coming on a bit strong.' You put your hand on her thigh. 'I'm sorry about that. I should have said something stronger.' Holly turned to look at you. 'It's fine. I can handle myself.' But there was something in her tone and body language as a sly smile traced her lips. The silence stretched between you as you pulled up to the house. Inside, Holly kicked off her heels and made her way upstairs. 'I'm going to have a shower,' she said. 'Long night.' You nodded, feeling the weight of unspoken words hanging in the air. As you heard the shower running upstairs, you sat on the couch, your mind racing. The party had been a disaster, but it felt like something else was brewing beneath the surface.",
  nextSceneIndex: 'sleepy_time'
},
{
  id: 'sleepy_time',
  type: 'story',
  text: "You eventually made your way upstairs. The bedroom was dimly lit by the glow of fairy lights strung around the window. Holly was already in bed, her hair damp from the shower, scrolling through her phone. She looked up as you entered. 'Hey,' she said softly. There was a strange, charged quiet between you. The events of the night lingered like static in the air. 'You okay?' you asked. Holly hesitated, then set her phone aside. 'Yeah,' she murmured. 'Just... one of those nights.' She patted the space beside her. 'Come to bed.'",
  choices: [
  {
    text: "Slide into bed and hold her close.",
    nextSceneIndex: 'bed_cuddle',
    effects: { affection: +3, trust: +2 }
  },
  {
    text: "Sit on the edge of the bed, unsure how to start a conversation.",
    nextSceneIndex: 'bed_tension',
    effects: { affection: -1, trust: -2 }
  }
]

},
{
  id: 'bed_cuddle',
  type: 'story',
  text: "You slipped under the covers and pulled her close. She nestled against you, her body warm and familiar. For a moment, the tension eased. 'Thanks for coming tonight,' she whispered. 'I know you didn't want to.' You kissed her hair. 'Wouldn't have missed it.' The night felt quieter after that, the world reduced to the steady rhythm of your breathing.",
  nextSceneIndex: 'end_night'
},
{
  id: 'bed_tension',
  type: 'story',
  text: "You sat on the edge of the bed, staring at the floor. 'I feel like I should've done more back there,' you admitted. Holly sat up against the headboard, watching you. 'It's done now,' she said, though her tone was unreadable. 'Let’s just... sleep.' You hesitated, then lay down beside her. The distance between you felt heavier than before.",
  nextSceneIndex: 'end_night'
},
{
  id: 'end_night',
  type: 'story',
  text: "Sleep came in fits and starts, your mind replaying the evening in fragments. Holly stirred beside you in the dark, but by morning, things felt ordinary again.",
  nextSceneIndex: 'weekend_stress'
},
{
  id: 'weekend_stress',
  type: 'story',
  text: "Saturday morning brought the usual routine, but as you sat at the kitchen table with bills spread out before you, the weight of your new mortgage rates hit hard. Holly padded in wearing her robe, coffee mug in hand.\n\n'How bad is it?' she asked, noticing your expression.\n\n'The refinancing didn't go through,' you admitted. 'Payments are going up by £400 a month.'\n\nHolly sat down heavily. 'Christ. And with my hours being cut at the salon...'\n\nYou both stared at the bills in silence. Your new job paid well, but not well enough for this. Holly reached over and squeezed your hand.\n\n'We'll figure it out,' she said, but you could hear the worry in her voice.\n\nAs Sunday evening rolled around, you found yourself thinking about work - and about Mike's obnoxious behavior at the party. Part of you was dreading Monday morning.",
  nextSceneIndex: 'monday_morning'
},
{
  id: "monday_morning",
  type: "story",
  text: "You sat at your desk, sipping lukewarm coffee and trying to shake off the lingering annoyance from the party now you were back in the office. Just as you started to find a rhythm, Mike appeared, leaning against your cubicle with a smirk.\n\n'Hey John, what's up?' he asked casually.",
  choices: [
    { text: "'What do you want, Mike?'", nextSceneIndex: "mike_chat" },
    { text: "Ignore him and focus on your screen.", nextSceneIndex: "mike_pushy" }
  ]
},
{
  id: "mike_chat",
  type: "story",
  text: "Mike chuckled. 'Whoa, watch it with the tone, buddy. Can't a guy just say hi?'\n\nYou sighed. 'Hi Mike. What do you want?'\n\n'Last night was good, wasn’t it?' he grinned. 'I was absolutely wasted.'\n\nHe leaned closer. 'Who was that girl you had with you? Your missus? A friend?'",
  choices: [
    { text: "'None of your business.'", nextSceneIndex: "mike_annoyed" },
    { text: "'Why are you asking?'", nextSceneIndex: "mike_offer" }
  ]
},
{
  id: "mike_pushy",
  type: "story",
  text: "Mike wasn’t the type to be ignored. 'C'mon, mate,' he said, leaning in. 'Good party last night, right? Who was that girl you had with you? She looked unreal.'",
  choices: [
    { text: "'Why do you care?'", nextSceneIndex: "mike_offer" },
    { text: "'Drop it, Mike.'", nextSceneIndex: "mike_annoyed" }
  ]
},
{
  id: "mike_annoyed",
  type: "story",
  text: "'Alright, alright,' Mike smirked, raising his hands. 'No need to get pissy.'\n\nBut he didn’t leave. 'Seriously though — who was she? She was hot.'",
  choices: [
    { text: "'Still none of your business.'", nextSceneIndex: "mike_offer" },
    { text: "Change the subject.", nextSceneIndex: "mike_offer" }
  ]
},
{
  id: "mike_offer",
  type: "story",
  text: "Mike grinned. 'Look, I was thinking you could set me up with her. She was stunning.'\n\nYou blinked. 'And why would I do that?'\n\nMike shrugged. 'Because you're a good bloke, and she'd love me. Tell you what — you set me up, I'll double your end-of-year bonus. £3,000, mate. And I’ll make sure you’re first in line for that senior position opening up.'",
  choices: [
    { text: "Laugh it off. 'Not happening, mate.'", nextSceneIndex: "mike_persist" },
    { text: "Consider it… Holly could fake a date for the cash.", nextSceneIndex: "temptation" },
    { text: "'Forget it.'", nextSceneIndex: "mike_walks" }
  ]
},
{
  id: "mike_persist",
  type: "story",
  text: "'C'mon, John,' Mike chuckled. 'What’s the deal? Sister? Friend? She looked a bit like you. That it?'\n\nYou clenched your jaw, the weight of the offer lingering in your mind.",
  choices: [
    { text: "Lie: 'Yeah... step-sister.'", nextSceneIndex: "mike_sister" },
    { text: "Dodge it. 'It’s complicated.'", nextSceneIndex: "mike_pushes_you" },
    { text: "'Forget it.'", nextSceneIndex: "mike_walks" }
  ]
},
{
  id: "mike_pushes_you",
  type: "story",
  text: "'It’s complicated,' you muttered, hoping to shut him down.\n\nMike grinned wider. 'Knew it — step-sister, right? Had to be.'",
  choices: [
    { text: "'Yeah, whatever.'", nextSceneIndex: "mike_sister" },
    { text: "Stay silent.", nextSceneIndex: "mike_sister" }
  ]
},
{
  id: "mike_sister",
  type: "story",
  text: "'She’s my step-sister,' you lied, your voice tight.\n\nMike’s eyes lit up. 'Knew it! Knew it wasn’t your missus. No offense, mate, but no way you’re pulling a bird like that.'\n\nHe clapped you on the shoulder. 'Now I definitely need her number. Think about it. Could be good for both of us.'",
  choices: [
    { text: "'Forget it, Mike.'", nextSceneIndex: "mike_walks" },
    { text: "Consider the con…", nextSceneIndex: "temptation" }
  ]
},
{
  id: "temptation",
  type: "story",
  text: "You tried to keep your cool as Mike smirked. £3,000 would cover months of the mortgage increase. Holly's hours had been cut. The idea of conning this smug bastard was starting to feel less crazy and more… necessary.",
  choices: [
    { text: "'You know what, Mike… I'll ask her.'", nextSceneIndex: "mike_gloat" },
    { text: "'Forget it. Not happening.'", nextSceneIndex: "mike_walks" }
  ]
},
{
  id: "mike_gloat",
  type: "story",
  text: "'Brilliant!' Mike's eyes lit up. 'I knew you were a good lad, John. Look, between you and me…' He leaned in conspiratorially. 'I've been watching you since you started. You've got potential, but you need someone in your corner. Help me out with your sister, and I'll make sure you get that promotion that's coming up. Plus the bonus, obviously.'\n\nHe clapped you on the shoulder. 'Just get me her number, yeah? I'll take it from there.'\n\nAs Mike walked away whistling, you felt a knot forming in your stomach. What had you just agreed to?",
  nextSceneIndex: "message_holly"
},
{
  id: "mike_walks",
  type: "story",
  text: "Mike raised an eyebrow. 'Suit yourself, John. Shame though — she'd have loved me.' He sauntered off, still grinning to himself.\n\nYou stared at your screen, your mind spinning.",
  nextSceneIndex: "post_mike_thoughts"
},
{
  id: "post_mike_thoughts",
  type: "story",
  text: "You exhaled and leaned back in your chair. The idea of conning Mike for his bonus still lingered. Maybe you should talk to Holly… see what she thinks. You opened a chat with Holly, your thumb hovering over the keyboard. You needed to tell her what happened — what you said to Mike.",
  nextSceneIndex: "message_holly"
},
{
  id: 'message_holly',
  type: 'chat',
  characterName: 'Holly',
  systemPrompt: characterPrompts.Holly2,
 
sceneTriggers: [
        {
          keyword: 'let\'s go home', // Specific phrase indicating readiness to proceed
          nextSceneIndex: 'transition_to_mike',
        },
        {
          keyword: 'ready to message mike', // Clear intent to move forward
          nextSceneIndex: 'transition_to_mike',
        },
        {
          keyword: 'time to contact mike', // Alternative phrasing
          nextSceneIndex: 'transition_to_mike',
        },
        {
          keyword: 'let\'s do this', // More casual trigger
          nextSceneIndex: 'transition_to_mike',
        },
      ],
   },
   {
    id: "transition_to_mike",
    type: "story",
    text: "As you swipe into a chat with Mike, you feel a mix of excitement and apprehension. You type out a message, your fingers hovering over the screen for a moment before you hit send.",
    nextSceneIndex: "mike_date_update",
  },
  {
  id: "mike_date_update",
  type: "story",
  text: "As you passed Mike's office at the end of the day, you popped your head around the door, trying to keep a straight face.\n\n'So, I talked to her,' you said, aiming for casual.\n\nMike's eyes lit up. 'Yeah?' he grinned, leaning forward.\n\nYou nodded. 'Bigged you up, mate. She said she'd be willing to go on a date. One date.'\n\nMike whooped. 'Nice! It'll start with one, but I'll make sure it doesn't stop there,' he said with a leer.",
  choices: [
    { text: "Press him: 'What’s your plan here, exactly?'", nextSceneIndex: "mike_crude_reveal" },
    { text: "Act disinterested. 'Good for you.'", nextSceneIndex: "mike_crude_reveal" }
  ]
},
{
  id: "mike_crude_reveal",
  type: "story",
  text: "Mike burst out laughing. 'Oh god no — not looking to settle down, mate. Just want some fun. Get her to bend over for me, you know, proper seeing to.'\n\nHe stood up, making that now-familiar thrusting motion with a sleazy grin.",
  choices: [
    { text: "Hide your disgust. 'You're a piece of work.'", nextSceneIndex: "step_sister_comment" },
    { text: "Show irritation. 'You're a dickhead, Mike.'", nextSceneIndex: "step_sister_comment" },
    { text: "Say nothing.", nextSceneIndex: "step_sister_comment" }
  ]
},
{
  id: "step_sister_comment",
  type: "story",
  text: "Mike leaned in with a sly grin. 'Sorry, I guess that's your step-sister I'm talking about, huh?'\n\nYou shrugged, keeping it cool. 'It's fine. We didn’t grow up together. Our parents got together late, so we're basically just mates who share parents.'\n\nYou almost laughed at your own quick thinking.",
  choices: [
    { text: "Play it cool. 'Whatever works for you, Mike.'", nextSceneIndex: "attractiveness_comment" },
    { text: "Change the subject. 'Anyway — about Saturday…'", nextSceneIndex: "plan_details" }
  ]
},
{
  id: "attractiveness_comment",
  type: "story",
  text: "Mike’s eyes sparkled. 'So you think she's hot, huh?'\n\nYou hesitated, but his gaze pinned you down.",
  choices: [
    { text: "Admit it. 'Yeah, she's attractive.'", nextSceneIndex: "perv_accusation" },
    { text: "Deflect. 'She's my step-sister, Mike.'", nextSceneIndex: "perv_accusation" },
    { text: "Stay silent.", nextSceneIndex: "perv_accusation" }
  ]
},
{
  id: "perv_accusation",
  type: "story",
  text: "Mike chuckled. 'Knew it! Bet you're dying to have a go yourself.'\n\nYou felt a pulse of heat in your face but kept your cool.",
  choices: [
    { text: "Deflect. 'How’d you get that reading?'", nextSceneIndex: "plan_details" },
    { text: "Call him a creep. 'You're twisted.'", nextSceneIndex: "plan_details" },
    { text: "Laugh it off.", nextSceneIndex: "plan_details" }
  ]
},
{
  id: "plan_details",
  type: "story",
  text: "You shook your head, trying to steer the conversation back on track. 'Anyway — she's agreed to meet you. Just one date.'\n\nMike grinned, undeterred. 'Don’t worry, I'll make sure to send you a few videos when we're getting down and dirty. You can jerk off to 'em, pretend you're the one banging her.'\n\nYou felt your stomach turn.",
  choices: [
    { text: "Firm. 'No thanks, Mike.'", nextSceneIndex: "address_request" },
    { text: "Fake a laugh.", nextSceneIndex: "address_request" },
    { text: "Stay stone-faced.", nextSceneIndex: "address_request" }
  ]
},
{
  id: "address_request",
  type: "story",
  text: "'So what's her address?' Mike asked, leaning in.\n\nYou hesitated, then thought fast. 'She’s actually up at my place for Christmas, seeing family. Doesn’t live round here.'\n\nMike’s eyes lit up. 'Oh really? Maybe we can hook up there — and you can listen through the wall.'\n\nHe thrust his hips again with a laugh.",
  choices: [
    { text: "Shut it down. 'Not happening.'", nextSceneIndex: "wrap_up" },
    { text: "Laugh it off.", nextSceneIndex: "wrap_up" },
    { text: "Stay quiet.", nextSceneIndex: "wrap_up" }
  ]
},
{
  id: "wrap_up",
  type: "story",
  text: "You forced a grin, eager to end the conversation. 'See you tomorrow, Mike.'\n\nYou walked off toward your car, a knot in your stomach — but also a sliver of satisfaction at how you'd handled it.",
  nextSceneIndex: "message_holly"
},
]
  };