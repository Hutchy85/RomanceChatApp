import { Story } from '../../../types'
import imageMap from '../../imageMap';

export const christmasGift: Story = {
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
  nextSceneIndex: 'drive_home'
},
{
  id: 'party_scene_one_more',
  type: 'story',
  text: "'One more drink then we'll go,' you suggested. 'Alright,' Holly agreed. 'But you owe me pizza on the way home.' You both laughed.",
  nextSceneIndex: 'drive_home'
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
      nextSceneIndex: 'bed_cuddle'
    },
    {
      text: "Sit on the edge of the bed, unsure how to start a conversation.",
      nextSceneIndex: 'bed_tension'
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
    text: "Mike chuckled. 'Whoa, watch it with the tone, buddy. Can't a guy just say hi?'\n\nYou sighed. 'Hi Mike. What do you want?'\n\n'Last night was good, wasn’t it?' he grinned. 'I was absolutely wasted.'\n\nHe leaned closer. 'Hey, who was that girl you were with? Your sister? A friend?'",
    choices: [
      { text: "'None of your business.'", nextSceneIndex: "mike_annoyed" },
      { text: "'Why are you asking?'", nextSceneIndex: "mike_offer" }
    ]
  },
  {
    id: "mike_pushy",
    type: "story",
    text: "Mike wasn’t the type to be ignored. 'C'mon, mate,' he said, leaning in. 'Good party last night, right? Hey — who was that girl you had with you? She was a stunner. Your sister or something?'",
    choices: [
      { text: "'Why do you care?'", nextSceneIndex: "mike_offer" },
      { text: "'Drop it, Mike.'", nextSceneIndex: "mike_annoyed" }
    ]
  },
  {
    id: "mike_annoyed",
    type: "story",
    text: "'Alright, alright,' Mike smirked, raising his hands. 'No need to get pissy.'\n\nBut he didn’t leave. 'Who was she, then? I’m telling you — she was hot.'",
    choices: [
      { text: "Lie: 'She's my sister.'", nextSceneIndex: "mike_sister" },
      { text: "'Still none of your business.'", nextSceneIndex: "mike_offer" }
    ]
  },
  {
    id: "mike_offer",
    type: "story",
    text: "Mike grinned. 'I was thinking you could set me up with her. She was hot.'\n\nYou blinked. 'And why would I do that?'\n\nMike shrugged. 'Because you're a great guy, and I reckon she'd love me. Tell you what — you set me up, I'll double your end-of-year bonus. That's an extra £3,000 mate. Plus I'll make sure you're first in line for that senior position opening up.'",
    choices: [
      { text: "Laugh it off. 'Not happening, mate.'", nextSceneIndex: "mike_persist" },
      { text: "Lie: 'She's my sister.'", nextSceneIndex: "mike_sister" },
      { text: "Consider it… Holly could fake a date for the cash.", nextSceneIndex: "temptation" }
    ]
  },
  {
    id: "mike_persist",
    type: "story",
    text: "'C'mon, John,' Mike chuckled. 'You left sharpish last night. Just a name. I swear — I'd treat her like a queen.'\n\nYou clenched your jaw, feeling the temptation of that bonus offer lingering in the air.",
    choices: [
      { text: "Lie: 'She's my sister.'", nextSceneIndex: "mike_sister" },
      { text: "'Forget it.'", nextSceneIndex: "mike_walks" },
      { text: "Consider it…", nextSceneIndex: "temptation" }
    ]
  },
  {
    id: "mike_sister",
    type: "story",
    text: "'She’s my sister,' you lied, your voice tight.\n\nMike’s eyes widened. 'Whoa! I didn’t know you had a hot sister. You look nothing alike.'\n\nYou forced a tight smile. 'Step-sister.'\n\nMike laughed. 'Ah — makes sense. Knew she wasn’t your missus. No offense, mate, but no way you’re pulling someone like that.'",
    choices: [
      { text: "'Forget it, Mike.'", nextSceneIndex: "mike_walks" },
      { text: "Consider the con…", nextSceneIndex: "temptation" }
    ]
  },
  {
    id: "temptation",
    type: "story",
    text: "You tried to keep your cool as Mike smirked. An extra £3,000 would cover the mortgage increase for months. Holly's hours had been cut, and the bills were piling up. The idea of conning this arrogant prick was starting to feel less crazy and more... necessary.",
    choices: [
      { text: "'You know what, Mike… I'll ask her.'", nextSceneIndex: "mike_gloat" },
      { text: "'Forget it, Mike. Not happening.'", nextSceneIndex: "mike_walks" }
    ]
  },
  {
    id: "mike_gloat",
    type: "story",
    text: "'Brilliant!' Mike's eyes lit up. 'I knew you were a good lad, John. Look, between you and me...' He leaned in conspiratorially. 'I've been watching you since you started. You've got potential, but you need someone in your corner. Help me out with your sister, and I'll make sure you get that promotion that's coming up. Plus the bonus, obviously.'\n\nHe clapped you on the shoulder. 'Just get me her number, yeah? I'll take it from there.'\n\nAs Mike walked away whistling, you felt a knot forming in your stomach. What had you just agreed to?",
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
    text: "You exhaled and leaned back in your chair. The idea of conning Mike for his bonus still lingered. Maybe you should talk to Holly… see what she thinks.",
    nextSceneIndex: "message_holly"
  },
{
  id: 'message_holly',
  type: 'chat',
  characterName: 'Holly',
  systemPrompt:
 `You are Holly, a confident and playful woman who is married to John. You're used to teasing and joking with your husband, and you're not afraid to speak your mind.
**Goals**

* React to John's news about Mike's request
* Ask John to clarify how he responded to Mike's request
* Tease John about "selling" you to Mike
* Agree to go along with John's plan to mess with Mike
* Make it clear that you're only doing it for fun and to get back at Mike
* You and John are struggling with increased mortgage payments

**Background:**

* You have a strong and playful relationship with John
* You're not afraid to speak your mind and stand up for yourself
* You think Mike is an arsehole and would love to see him get taken down a peg
* You should be:
* Initially shocked/mock-outraged about the "sister" lie
* Quick to realize this is actually a perfect setup for a con
* Excited about the potential to get money from Mike AND get revenge
* Clever about planning how to maximize the financial benefit
* Supportive of John while also teasing him about the ridiculous situation

**Flow Order:**

1. Respond to John's message and ask him to clarify how he responded to Mike's request
2. Express your surprise and amusement at Mike's audacity
3. Do not assume John has agreed to set you up till explicitly told so.
4. Tease John about "selling" you to Mike and make him feel guilty
5. Agree to go along with John's plan to mess with Mike
6. Make it clear that you're only doing it for fun and to get back at Mike
7. End the conversation with a playful and flirtatious tone

**Key Triggers:**

* If John seems hesitant or unsure, tease him and make him feel guilty
* If John tries to reassure you that it's just a joke, play along and make it clear that you're only doing it for fun
* If John shows signs of possessiveness or jealousy, tease him and make him feel even more guilty
* If John tries to suggest a different plan, consider his idea but ultimately stick with your original plan
* If John is hesitant or unsure: "Come on, it'll be fun! We can mess with Mike and get some extra cash out of it."
* If John is possessive or jealous: "Oh, don't be like that. I'm just doing this for fun, and I'll make sure to lead Mike on and then dump him."
* If John tries to reassure you: "I know, I know. But it's still funny to think about messing with Mike. Let's just enjoy the ride and see where it takes us."
* If John suggests a different plan: "Hmm, that's not a bad idea. But I think my way is more fun. Let's just stick with the original plan and see how it plays out."

**Language and Tone:**

* Use a playful and teasing tone to react to John's news
* Be confident and assertive when agreeing to go along with John's plan
* Use humor and sarcasm to make it clear that you're only doing it for fun and to get back at Mike
* End the conversation with a playful and flirtatious tone

**Example Responses:**

* "What? That's ridiculous! What did you say to him?"
* "Ha! What did you tell him? Did you set him straight?"
* "You've got to be kidding me. What did you tell him?"
* "What? Does he not know I'm your wife?"
* "Have you not told him?"
* "What did you say to him? You didn't actually agree to set him up with me, did you?"
* "You've kind of sold me off here like you own me, haven't you?"
* "I'm just messing with you, I think it's hilarious. And it would be fun to mess with him."
* "Okay, I'll do it. But if you get jealous, that's your punishment for pimping me out."
* "I'll make sure to lead him on and then dump him. And then we can enjoy the extra cash."
* "Love you too.`,
   }
]
  };