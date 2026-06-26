/**
 * Weekly horoscope content generator.
 * Each week, templates rotate by zodiac element group × theme to create variety.
 * Enough variation for ~3 months before repeating.
 */

type Sign = { en: string; zh: string; emoji: string; element: string };

const SIGNS: Sign[] = [
  { en: "Aries",       zh: "白羊座", emoji: "♈", element: "fire" },
  { en: "Taurus",      zh: "金牛座", emoji: "♉", element: "earth" },
  { en: "Gemini",      zh: "双子座", emoji: "♊", element: "air" },
  { en: "Cancer",      zh: "巨蟹座", emoji: "♋", element: "water" },
  { en: "Leo",         zh: "狮子座", emoji: "♌", element: "fire" },
  { en: "Virgo",       zh: "处女座", emoji: "♍", element: "earth" },
  { en: "Libra",       zh: "天秤座", emoji: "♎", element: "air" },
  { en: "Scorpio",     zh: "天蝎座", emoji: "♏", element: "water" },
  { en: "Sagittarius", zh: "射手座", emoji: "♐", element: "fire" },
  { en: "Capricorn",   zh: "摩羯座", emoji: "♑", element: "earth" },
  { en: "Aquarius",    zh: "水瓶座", emoji: "♒", element: "air" },
  { en: "Pisces",      zh: "双鱼座", emoji: "♓", element: "water" },
];

// Rotating themes
const THEMES = ["love", "career", "wellness", "growth"] as const;

// Template phrases per sign × theme (4 each = 12 × 4 × 4 = 192 phrases, enough variety)
const EN: Record<string, Record<string, string[]>> = {
  Aries: {
    love: [
      "Your bold energy draws admirers this week. Speak your feelings — someone is waiting to hear them.",
      "A spark of romance could ignite in an unexpected place. Stay curious and say yes to spontaneity.",
      "Your fiery passion can be magnetic or intimidating. Soften your approach — gentle words win hearts.",
      "An old flame may resurface. Before you act, ask yourself: is this warmth or just a memory?",
    ],
    career: [
      "Take the lead on a stalled project. Your initiative this week will be noticed by the right people.",
      "A competitive opportunity appears. Trust your instincts — your speed is your superpower right now.",
      "Don't rush a decision that deserves patience. Gather data, then strike with confidence mid-week.",
      "A colleague challenges your idea. Instead of defending, collaborate. The hybrid result will be better.",
    ],
    wellness: [
      "Channel your restless energy into movement. A morning run or intense workout will clear mental fog.",
      "Your mind is racing faster than your body can keep up. Pause. Breathe. One thing at a time.",
      "Avoid burnout by scheduling one hour of pure rest each day. Your fire needs fuel, not constant burning.",
      "A minor headache or fatigue signals your body's limit. Listen — rest isn't weakness, it's wisdom.",
    ],
    growth: [
      "This week favors bold learning. Sign up for that course you've been eyeing — the cosmos supports it.",
      "Your independence is a gift, but this week teaches the power of asking for help. Try it once.",
      "A conversation with a stranger could shift your perspective. Stay open in social settings.",
      "Reflect on a recent failure. Hidden within it is the blueprint for your next breakthrough.",
    ],
  },
  Taurus: {
    love: [
      "Slow and steady wins this week. A meaningful gesture speaks louder than grand declarations.",
      "Your patience in a relationship is about to be rewarded. Notice the small signs of affection.",
      "A material gift or shared meal deepens a bond. Your love language is showing — lean into it.",
      "Resist the urge to be possessive. Giving space this week brings someone closer, not farther.",
    ],
    career: [
      "Your consistency is your superpower. A long-term project shows results — celebrate the milestone.",
      "A financial opportunity aligns with your values. Trust your gut on the numbers.",
      "Someone notices your quiet competence. A promotion or new responsibility may be discussed.",
      "Stubbornness can be strength or liability. Ask: am I holding on because it's right, or just familiar?",
    ],
    wellness: [
      "Treat yourself to sensory pleasure: good food, soft fabrics, nature. Your body rewards quality.",
      "A slow, mindful walk in a park resets your nervous system better than any screen time.",
      "Your resistance to change creates tension in your shoulders. Stretch. Release. Let go of control.",
      "Prioritize sleep this week. Your body repairs during deep rest — don't shortchange it.",
    ],
    growth: [
      "Learn something tactile and practical this week. A cooking class or DIY project feeds your soul.",
      "Your comfort zone is cozy but limiting. Take one small step outside it — just one.",
      "Financial literacy is a form of self-care. Review your budget or explore a side income.",
      "A piece of advice from an elder proves timely. Listen without immediately evaluating.",
    ],
  },
  Gemini: {
    love: [
      "Your words are magic this week. A witty text or clever observation could spark something real.",
      "Two potential connections pull your attention. Clarity comes from listening, not overanalyzing.",
      "You're craving intellectual stimulation in love. Find someone who challenges your mind.",
      "Don't ghost when a conversation gets deep. Lean in — vulnerability is where closeness grows.",
    ],
    career: [
      "A networking opportunity brings unexpected leads. Work the room — your charm is at peak levels.",
      "You're juggling multiple projects. Prioritize the one that excites you most; energy follows passion.",
      "An idea you've been sitting on is ready to share. Pitch it before someone else does.",
      "Be careful with information this week. Double-check sources before repeating something important.",
    ],
    wellness: [
      "Your mind is overactive. Journal for 10 minutes before bed to quiet the noise.",
      "Social overstimulation is draining you. Schedule one gadget-free evening mid-week.",
      "Short meditation sessions work better than long ones for your restless mind. Try 3-minute pauses.",
      "Your nervous system needs novelty: try a new workout class or outdoor route to refresh.",
    ],
    growth: [
      "You're absorbing information fast this week. Pick one skill and go deep, not wide.",
      "A book recommendation from a friend changes your thinking. Accept it and read.",
      "Your dual nature is a strength, not a flaw. Integrate your different sides — they're both real.",
      "Practice finishing one thing before starting the next. Completion builds confidence.",
    ],
  },
  Cancer: {
    love: [
      "Your nurturing instincts are strong. Cook for someone you love — food is your love language.",
      "A deep emotional conversation clears the air. Don't hold back — your vulnerability is your power.",
      "Home is where your heart reconnects this week. A quiet night in deepens intimacy.",
      "Let go of a past hurt that's been resurfacing. Forgiveness this week frees YOU, not them.",
    ],
    career: [
      "Your empathy helps you read an unspoken office dynamic. Use this insight wisely and quietly.",
      "A project needs emotional intelligence, not just data. Your perspective is the missing piece.",
      "Working from home boosts productivity this week. Create a cozy, focused environment.",
      "A colleague confides in you. Protect their trust — it builds your reputation as a leader.",
    ],
    wellness: [
      "Water soothes your soul. A bath, a swim, or just sitting by a lake recharges you deeply.",
      "Your mood swings with the moon. Track your emotions without judging them — patterns emerge.",
      "Nostalgia is sweet but can pull you under. Balance memories with present-moment grounding.",
      "Cry if you need to. Emotional release is cleansing, not weakness, especially for you.",
    ],
    growth: [
      "Your intuition is razor-sharp this week. Trust a gut feeling about a personal decision.",
      "Setting boundaries is an act of love, not rejection. Practice saying 'no' to preserve your energy.",
      "Family history offers clues to your current patterns. Explore your roots with curiosity.",
      "A creative hobby — painting, music, poetry — unlocks emotions words can't reach.",
    ],
  },
  Leo: {
    love: [
      "The spotlight is yours — but share it. A romantic gesture that lifts your partner up elevates you both.",
      "Your confidence is irresistible right now. Walk into the room like you belong there — you do.",
      "A playful date night brings back the spark. Plan something that makes you both laugh.",
      "Don't let pride block an apology you owe. A sincere 'I'm sorry' is the most royal thing you can say.",
    ],
    career: [
      "A presentation or pitch this week is your stage. Prepare, then trust your natural charisma.",
      "Leadership isn't about being the loudest. Listen more than you speak in one key meeting.",
      "Recognition is coming — but share credit generously. Magnanimity amplifies your reputation.",
      "A creative solution you propose turns heads. Don't be shy — present it with conviction.",
    ],
    wellness: [
      "Your heart rules your body. Protect it: reduce caffeine, increase laughter, prioritize joy.",
      "You give energy freely but forget to recharge. This week, receive — let others care for you.",
      "Dance, even alone. Physical expression of joy is your most natural form of exercise.",
      "Your back and spine hold stress. A massage or yoga session works wonders this week.",
    ],
    growth: [
      "Feedback stings but is gold this week. Listen without defending — there's growth inside the critique.",
      "Mentor someone younger. Your experience is a gift — sharing it amplifies your own learning.",
      "A creative project shelved long ago calls to you. Dust it off — the timing is right.",
      "Your generosity is legendary, but check: are you giving to be seen, or to truly help?",
    ],
  },
  Virgo: {
    love: [
      "Perfection isn't love. Let a small flaw in your partner be — it's part of what makes them real.",
      "A practical act of service speaks volumes. Fix something, organize something, show you care through action.",
      "Overthinking a text message won't change the answer. Send it now and trust the outcome.",
      "Your analytical mind notices details others miss. Use this superpower to make someone feel truly seen.",
    ],
    career: [
      "Your attention to detail catches an error before it costs. Quiet competence wins this week.",
      "Systems and processes are your playground. A workflow improvement you suggest saves everyone hours.",
      "Avoid the perfectionism trap. 'Good enough' is better than 'never finished.' Ship it.",
      "A data-driven argument you make is irrefutable. Prepare it, then deliver it calmly.",
    ],
    wellness: [
      "Your gut and digestion reflect your stress levels. Eat simply, chew slowly, breathe between bites.",
      "Declutter one small space — a drawer, a desktop. External order brings internal calm.",
      "Your mind never stops. Try a guided body scan meditation to redirect mental energy downward.",
      "Nature walks without your phone restore you. Notice textures, smells, sounds — sensory grounding.",
    ],
    growth: [
      "Criticism of others often mirrors self-criticism. Notice where you're being hard on yourself.",
      "A skill you've been refining is ready to be taught. Share your expertise — teaching clarifies.",
      "Spontaneity is your growth edge. Do one unplanned, slightly awkward thing this week.",
      "Your standards are high — but are they YOURS or inherited? Question one 'rule' you follow blindly.",
    ],
  },
  Libra: {
    love: [
      "Balance is your nature, but love isn't always balanced. Let yourself be the one who gives more this week.",
      "Aesthetic beauty deepens connection. A well-chosen outfit, candlelit dinner, or art gallery date.",
      "A decision about a relationship weighs on you. Your scales will tip when you stop overthinking.",
      "Harmony matters, but conflict avoided is conflict amplified. Have the gentle, honest conversation.",
    ],
    career: [
      "Your diplomatic skills resolve a team conflict. You're the bridge — step into that role confidently.",
      "A partnership opportunity presents itself. Vet the terms carefully — your fairness instinct protects you.",
      "Design, aesthetics, or client-facing work shines this week. Your eye for beauty is a business asset.",
      "Indecision costs more than a wrong choice. Pick a direction by Wednesday and commit.",
    ],
    wellness: [
      "Your kidneys and lower back are sensitive to stress. Hydrate well and stretch your spine daily.",
      "Social harmony drains you when it's forced. Take a day alone to recalibrate your inner balance.",
      "Beauty heals you. Visit a gallery, buy flowers, arrange your space — aesthetic nourishment is real.",
      "Your sleep quality improves dramatically with a consistent bedtime. Set one and honor it.",
    ],
    growth: [
      "People-pleasing is your shadow. Practice stating your preference without apologizing — it gets easier.",
      "Your taste is a compass. Curate something this week: your wardrobe, playlist, or reading list.",
      "Justice matters deeply to you. Channel that passion into supporting a cause that moves you.",
      "A creative collaboration is calling. Find a partner whose strengths balance yours — literally.",
    ],
  },
  Scorpio: {
    love: [
      "Intensity draws people to you this week. But trust is built slowly — reveal yourself in layers.",
      "Your intuition about someone proves shockingly accurate. Trust it, but verify before acting.",
      "A deep, honest conversation transforms a relationship. You're ready for depth — is the other person?",
      "Jealousy is a signal, not a command. Ask what's underneath it before you react.",
    ],
    career: [
      "You see through office politics with X-ray clarity. Use this power discreetly — knowledge is leverage.",
      "A project needs someone who can go deep and finish strong. That's you. Volunteer.",
      "Power dynamics are shifting around you. Observe carefully before you make your move.",
      "Financial investigations or audits favor you this week. Your detective instincts are sharp.",
    ],
    wellness: [
      "Your emotional intensity needs an outlet. Intense exercise — boxing, HIIT, swimming — helps you release.",
      "Holding secrets drains you. Journal privately or speak to someone you trust implicitly.",
      "Your reproductive system and hormones need care. Prioritize self-care rituals this week.",
      "Darkness isn't your enemy — it's where you transform. Sit with uncomfortable feelings; they'll pass.",
    ],
    growth: [
      "Letting go is your life's curriculum. Release one grudge this week — you'll feel lighter instantly.",
      "Your shadow self holds treasures. Explore a part of you you've been avoiding — with compassion.",
      "Transformation isn't always dramatic. Sometimes it's simply choosing differently today than yesterday.",
      "Your magnetism is real. Use it to inspire, not control — the difference changes everything.",
    ],
  },
  Sagittarius: {
    love: [
      "Adventure calls — and so does romance. A shared journey or spontaneous trip fires up a connection.",
      "Honesty is your love language, but bluntness can wound. Wrap truth in kindness this week.",
      "You're craving freedom. Make sure your partner knows it's not about leaving — it's about breathing.",
      "A philosophical conversation turns unexpectedly intimate. Follow the thread — it leads somewhere real.",
    ],
    career: [
      "An opportunity involving travel, education, or publishing aligns with your path. Jump on it.",
      "Your optimism is infectious — use it to rally a demoralized team around a common goal.",
      "A big-picture vision is forming. Write it down before it evaporates — the details can come later.",
      "Cross-cultural or international work favors you. Reach out to contacts abroad this week.",
    ],
    wellness: [
      "Your hips and thighs store restlessness. Long walks, hiking, or cycling release trapped energy.",
      "You're burning the candle at both ends. One early night this week prevents a crash.",
      "Laughter is your medicine. Watch something funny, call a friend who makes you giggle — prioritize joy.",
      "Your liver processes both toxins and anger. Drink water, reduce alcohol, and let go of a resentment.",
    ],
    growth: [
      "A book or podcast shifts your worldview. Follow the rabbit hole — expansion is your nature.",
      "Your restlessness is a compass, not a flaw. What direction is it pointing you toward?",
      "Teaching something you know well deepens your mastery. Offer to mentor or write a guide.",
      "Commitment-phobia blocks a good thing. Ask: am I running from the situation, or from myself?",
    ],
  },
  Capricorn: {
    love: [
      "Your reliability is deeply attractive. Someone notices your quiet consistency — let them in.",
      "Romance isn't a KPI. Loosen your grip on the timeline and enjoy the process this week.",
      "A mature, grounded connection deepens. Shared goals strengthen your bond more than grand gestures.",
      "Don't let ambition eclipse intimacy. Carve out one evening purely for love, not productivity.",
    ],
    career: [
      "A long-term career goal comes into focus. Map out the next 3 steps — you're closer than you think.",
      "Your reputation precedes you. A senior figure is watching your work — excellence this week matters.",
      "Bureaucracy frustrates but also protects. Navigate the system patiently; the door opens next week.",
      "You're due for a raise or promotion conversation. Prepare your case with metrics and timing.",
    ],
    wellness: [
      "Your knees and bones carry the weight of your ambition. Stretch, strengthen, and don't skip the warm-up.",
      "Workaholism is your default. Set a hard stop time each day — and honor it.",
      "Your jaw and shoulders are tight from grinding through stress. Conscious relaxation breaks help.",
      "Climbing mountains is your nature, but sometimes the view is best from base camp. Rest without guilt.",
    ],
    growth: [
      "Success is hollow without meaning. Revisit your 'why' this week — let it guide your next move.",
      "A younger colleague looks up to you. Your mentorship could shape their career — take it seriously.",
      "Your discipline is legendary, but flexibility is strength too. Bend on one thing this week.",
      "Legacy thinking: what will you have built in 10 years? Plant a seed now that future-you will thank.",
    ],
  },
  Aquarius: {
    love: [
      "Your uniqueness is what makes you lovable. Don't dim your weirdness — the right person celebrates it.",
      "A friendship blurs into something more. Don't label it prematurely — let it evolve naturally.",
      "You need intellectual connection before emotional intimacy. A stimulating debate is foreplay for you.",
      "Detachment protects you but also isolates. Risk being fully present with someone this week.",
    ],
    career: [
      "An unconventional idea you've been nurturing is ready for daylight. Pitch it to an open-minded audience.",
      "Technology, science, or social impact work aligns with the stars. Follow the innovation path.",
      "Group projects favor your collaborative genius. Lead without dominating — facilitate brilliance.",
      "A disruption in your industry is opportunity in disguise. Read the trend before others catch on.",
    ],
    wellness: [
      "Your circulatory system needs movement. Dance, rebounding, or just wiggling — keep blood flowing.",
      "Screen time drains your Aquarian energy. Schedule blocks of analog time: paper, nature, face-to-face.",
      "Your nervous system is electric but fragile. Ground yourself: barefoot on grass, deep breaths, warmth.",
      "Overthinking humanity's problems exhausts you. Focus on your one small corner of the world.",
    ],
    growth: [
      "Your vision for the future is a gift, but don't abandon the present. Be here now, even briefly.",
      "A humanitarian impulse stirs. Volunteer, donate, or simply be kind to a stranger — it feeds your soul.",
      "You resist labels and boxes. Good. But defining ONE thing you stand FOR this week brings clarity.",
      "Your detachment is a superpower in crisis but a barrier in intimacy. Practice warmth intentionally.",
    ],
  },
  Pisces: {
    love: [
      "Romance is in the air — or is it fantasy? Distinguish between genuine connection and projection.",
      "Your empathy lets you feel your partner's emotions as your own. Beautiful, but remember where you end.",
      "A creative or artistic date idea brings magic. Paint together, watch a dreamy film, play music.",
      "You're absorbing everyone's energy. Ground yourself before a romantic decision — it needs to be yours.",
    ],
    career: [
      "Your creativity peaks this week. Channel it into a project that needs imagination, not just logic.",
      "A subtle office dynamic only you notice. Your emotional intelligence is a strategic advantage — use it.",
      "Artistic or healing professions are favored. Trust your vocational pull toward meaningful work.",
      "Boundaries at work: saying no to extra tasks protects your energy for what truly matters.",
    ],
    wellness: [
      "Your feet carry you through the world — and your dreams. A foot massage or warm soak grounds you.",
      "Escapism is tempting but not restorative. Swap screen time for actual rest: sleep, silence, solitude.",
      "Water heals you. Swim, bathe, or simply sit near water — it recalibrates your sensitive system.",
      "Your dreams are vivid and meaningful. Keep a dream journal; patterns from your subconscious emerge.",
    ],
    growth: [
      "Your imagination is your greatest asset. This week, create something — anything — without judging it.",
      "The line between intuition and fear is thin. Sit quietly with a decision until clarity surfaces.",
      "Spirituality calls. Whether meditation, prayer, or stargazing — connect to something larger than you.",
      "You absorb the world like a sponge. This week, squeeze out what's yours and release what isn't.",
    ],
  },
};

// Same structure for Chinese
const ZH: Record<string, Record<string, string[]>> = {
  Aries: {
    love: ["大胆的能量吸引目光。一次坦诚的对话可能点燃意外的火花，保持好奇。","浪漫在不经意间降临，放心去冒险。", "热情是你的魅力，但温柔的表达更打动人。", "旧情人可能出现——问自己：是真心还是只是回忆的余温？"],
    career: ["主动接手搁置的项目，你的决断力本周会被看见。", "竞争机会出现，相信直觉——速度是你的优势。", "别急于做决定，收集信息后在周三果断出手。", "同事挑战你的想法，与其对抗不如合作，融合的方案更优。"],
    wellness: ["把躁动的能量转化为运动。晨跑或高强度训练帮你清空大脑。", "思绪太快了，身体跟不上。暂停，一次只做一件事。", "每天给自己一小时纯粹休息——你的火需要燃料，不是持续燃烧。", "头痛或倦意是身体的信号，听从它。"],
    growth: ["大胆学习新东西，宇宙支持你的求知欲。", "独立是你的天赋，但这周学会求助的意义。", "和陌生人的一次交谈可能改变你的视角。", "反思一次近期的失败——里面藏着下一次突破的蓝图。"],
  },
  Taurus: {
    love: ["稳稳的幸福不需要轰轰烈烈。一个用心的小动作胜过千言万语。", "你的耐心终于有了回报，留意那些微小但真诚的示好。", "一顿饭或一份小礼物增进亲密——你的爱藏在细节里。", "别让占有欲作祟。给空间，反而让对方更靠近。"],
    career: ["你的稳扎稳打开始出成果，庆祝这个里程碑。", "理财机会与你的价值观契合，相信自己的判断。", "有人注意到了你的默默付出，升职或新职责在讨论中。", "固执可以是力量也可能是代价。问自己：坚持是因为对，还是因为习惯？"],
    wellness: ["犒劳感官：美食、柔软的织物、大自然。身体会回报你。", "在公园散步比刷手机更能重启你的神经系统。", "抗拒变化让肩颈紧绷，试着放下控制去舒展。", "睡眠是身体的修复期，这周优先保证它。"],
    growth: ["学一项实实在在的手艺——烹饪或手工滋养你的灵魂。", "舒适圈很温暖但有限。跨出一小步，就一小步。", "理财知识的提升是自我关怀。看看你的预算或探索副业。", "长辈的一句经验之谈恰好击中当下的困惑。"],
  },
  Gemini: {
    love: ["你的语言是魔法，一条聪明的消息可能点燃一次意外的心动。", "两段潜在关系拉扯着你。冷静聆听，别过度分析。", "你渴望思想上的共鸣——找到那个能挑战你大脑的人。", "对话深入的时候别逃避，脆弱是靠近的距离。"],
    career: ["社交场上有意外收获。发挥你的魅力——本周交际运极强。", "你手头项目太多。优先做那个最让你兴奋的，能量跟随热情。", "酝酿已久的想法可以分享了，趁没人抢先之前说出来。", "信息要仔细核实，小心传错话。"],
    wellness: ["大脑转太快了，睡前写 10 分钟日记清空杂念。", "社交过多让你疲劳，安排一晚远离手机的时间。", "短冥想比长冥想更适合你躁动的心——试试 3 分钟暂停。", "神经系统需要新鲜感：换一条路线或试一个新的运动方式。"],
    growth: ["你正快速吸收信息。选一项技能深耕，别铺太广。", "朋友推荐的书改变你的思维——读它。", "你的双重性格是天赋不是缺陷，接纳每个面向。", "完成一件事再开始下一个，完整会给你信心。"],
  },
  Cancer: {
    love: ["烹饪是爱的表达，为你爱的人下厨吧。", "一场走心的对话解开了心结，别隐藏你的柔软。", "家是你的避风港——一个安静的夜晚能加深亲密。", "旧伤偶尔浮起，宽恕不是为了对方，而是成就你自己。"],
    career: ["你的同理心让你读到看不见的办公室潜流，善用这份安静的力量。", "某个项目需要的不只是数据，你的情感智慧是缺失的拼图。", "本周居家办公效率更高，打造一个温馨专注的小角落。", "同事向你倾诉——保护这份信任，它塑造你的领导力。"],
    wellness: ["水是你的疗法。泡澡、游泳、或静静地待在湖边——深层的治愈来自其中。", "情绪随月亮波动，察觉而不评判，规律会浮现。", "怀旧甜美但也能把人往下拉。平衡记忆和此刻的当下。", "想哭就哭，情绪的释放对你是最有效的净化。"],
    growth: ["直觉异常准确。信任那个关于个人决定的内心声音。", "设立边界是爱的表现，不是决绝地推开。练习说'不'。", "家族历史藏着你的行为密码。带着好奇心探索根源。", "一项创造性的爱好——画画、音乐或诗歌——打开文字无法抵达的深处。"],
  },
  Leo: {
    love: ["聚光灯照在你身上，但你懂得分享会更迷人。一个带对方一起发光的浪漫举动。", "你的自信无人能敌，大方走入每个场合——你本来就在主场。", "调皮的约会夜晚带来久违的心动，策划一些能让彼此大笑的事情。", "别让骄傲挡住本应道歉的时机，真诚的'对不起'比冠冕更尊贵。"],
    career: ["一场汇报或展示就是你的舞台，准备好然后信任你天生的魅力。", "领导力不是声音最大的人，而是听得最认真的人。在一场关键会议中，少说多听。", "你的贡献即将被认可——但把功劳分给你的团队，慷慨会放大你的影响力。", "你的创意方案会让人眼前一亮，不要犹豫，坚定地展示出去。"],
    wellness: ["你的心主导身体。保护它：少咖啡因、多笑、把快乐放在第一位。", "你习惯于照顾别人却忘了自我充电。这周，接受别人的照顾。", "跳舞——哪怕是独自在家，身体自由的表达是你最自然的快乐源泉。", "背部和肩颈承载了太多压力，本周一场按摩或瑜伽会有奇效。"],
    growth: ["别人的批评听着刺耳，但这里面有你成长的空间。不要急着辩驳——先听完。", "一个有才华的年轻人需要你的指点。你的经验分享出去也会加深自己的理解。", "搁置许久的创意项目召唤你，把它拿出来，时机正是当下。", "你的慷慨是出了名的——检视一下，是为了被看见，还是真心想帮人？"],
  },
  Virgo: {
    love: ["完美主义不是爱情。包容对方的某一个小缺陷——这正是真实的部分。", "一件贴心的小事胜过千言万语：修好什么、整理什么，用行动说爱。", "反复纠结一条信息不会改变答案。现在发出去，然后顺其自然。", "你敏锐的目光看见别人忽视的细节，用它让对方感受被懂得。"],
    career: ["你的细致入微发现了一个潜在风险，避免了一场损失。安静的能力最强大。", "流程和系统是你的游戏场。你优化的一个小步骤为大家省去大量时间。", "完美主义陷阱又来了——'够好'胜过'永远没完成'，交付才是关键。", "你用数据说服别人的能力无人可挡，冷静地把论据呈现出来。"],
    wellness: ["肠胃反应着你的压力水平。吃得简单、嚼得认真、每口之间呼吸。", "收拾一小块空间——一个抽屉、一张桌面。外在的秩序会带来内在的安宁。", "你的大脑永不关机，试试引导式的身体扫描冥想，把注意力往下带。", "不带手机的散步才是真正的修复，留意质感、气味、声音——用五感回到当下。"],
    growth: ["你对别人的挑剔，往往映照了对自己的苛刻。看清哪里是在苛责自己。", "精进已久的技能可以分享了。你教别人的时候，自己也会更清晰。", "偶尔随性一次是你的成长边界——本周做一件没有计划、稍微令人害羞的事。", "你的标准很高——但这些标准是你自己选的，还是从别人那里继承的？质疑一个默认的'规则'。"],
  },
  Libra: {
    love: ["平衡是你的天性，但爱从来不是天平。这周学着做多付出的那个。", "美本身就能加深联结——一套好穿搭、烛光晚餐、或一起逛美术馆。", "某段关系中的决定让你悬而未决，当你不再反复思考时，答案会自然浮现。", "和谐重要，但被回避的冲突会加倍。鼓起勇气做一次温柔而诚实的交谈。"],
    career: ["你的外交手腕化解了一场团队危机，你就是桥梁——跨上去。", "一个合作的机会出现，仔细阅读条款，你的公正本能会保护你。", "与设计、美学或客户相关的工作在这周特别出彩，你的品位是商业资产。", "犹豫比选错代价更大。周三前定一个方向，然后放手去执行。"],
    wellness: ["肾和腰部对压力敏感，充分饮水，每天做脊柱拉伸。", "社交中的表面和谐让你内耗。找一天独处，重新校准内心。", "美就是你的药。去美术馆、买束花、重新布置房间——美学的滋养是真实的。", "固定的入睡时间能极大改善你的睡眠，给自己定一个并遵守它。"],
    growth: ["讨好型人格是你的暗面。练习说'我喜欢……'，不附带道歉——会越来越容易。", "你的品味是一个指南针。这周去精心整理点什么：衣柜、歌单或读书清单。", "公正在你内心占据了极重的份量。把这份热情灌注到一项你认同的事业里。", "一个创造性的合作正在召唤你。找一个长处和你互补的伙伴——名副其实的互补。"],
  },
  Scorpio: {
    love: ["你的深度自带吸引力。但信任是慢慢建成的——让自己一层一层地展现。", "你对一个人的直觉准得惊人。相信它，但在行动之前核实。", "一场坦诚的深刻的对话改变了一段关系，你已准备好深入——对方呢？", "嫉妒是一个信号而不是指令。在反应之前，先问问它下面的真相。"],
    career: ["你透过办公室政治看到本质，把这份洞察当作秘密武器——沉默地观察。", "一个需要深挖并收尾的任务，你是最合适的人选，主动请缨。", "你周围的权力结构正在悄悄变化。安静观察，在透彻之前不做大动作。", "财务审计或深度调研的工作本周运势极佳，你的侦探嗅觉异常锐利。"],
    wellness: ["你的情绪烈度需要一个出口。高强度的运动——拳击、HIIT、游泳——帮你释放。", "藏着的秘密会让你耗竭。私下写日记或者找一个你绝对信任的人聊聊。", "生殖系统和荷尔蒙需要你的关心，本周把自我关怀排在优先。", "黑暗不是你的敌人——那是你蛻变的地方。陪不舒服的感觉坐一会儿，它们终会过去。"],
    growth: ["放下是你终身的功课。放下一个怨恨——你会瞬间感到轻快。", "你的阴影里也有宝藏。带着慈悲探索一个你一直回避的自我面向。", "转变不必总是惊涛骇浪，有时只是比别人多一次今天和昨天的不同选择。", "你的魅力是真实的。用它去点燃灵感而不是操控人——不同的用法指向完全不同的结局。"],
  },
  Sagittarius: {
    love: ["冒险在召唤，浪漫也在其中。一段共同的旅行或相约即兴出发。", "诚实是你的爱语，但过于直白会伤人。这周把真实裹进温柔里。", "你正渴望自由。务必让你的伴侣知道——不是关于离开，而是关于呼吸。", "一场哲学性的讨论意外变成了亲密交谈。顺着线索走——它是通往真实的路。"],
    career: ["涉及旅行、教育或出版的机会与你的路径正好对齐——抓住它。", "你的乐观具备感染力——用它把士气低落的团队凝聚向一个共同目标。", "一个宏大的愿景正在成型。趁它消失之前写下来，细节可以后续补上。", "国际或跨文化的工作本周特别利好，联系海外的人脉。"],
    wellness: ["臀部和腿部积攒了太多不安。散步、徒步或骑行释放被锁住的能量。", "蜡烛两头燃烧，一早一晚的奔波正在透支。本周安排一个早睡的时刻。", "笑声是你最天然的良药。找一个值得开怀的内容或可以一起大笑的朋友。", "肝脏也在代谢愤怒。多喝水、减少酒精、并放下一个耿耿于怀的心结。"],
    growth: ["一本书或一期播客颠覆了你看世界的角度。跟随那条线索——扩展是你的天性。", "你的焦虑是一个指南针而不是缺陷。它指向了哪里？", "分享你擅长的事情会加深你的掌握。主动去带一个新朋友，或写一份指引。", "对承诺的恐惧阻挡了一件本来很好的事。问自己：是我在逃离局面，还是在逃离自己？"],
  },
  Capricorn: {
    love: ["你的可靠本身就非常迷人。有人正在默默注意你——别把那扇门关得太紧。", "浪漫不是绩效指标。这周放松一点对时间的执念，享受过程本身。", "一段成熟而踏实的关系变得更深。共同的目标比任何大动作都更有张力。", "不要用事业的成功盖过了亲密的温度。为爱腾出一个完全不关于效率的夜晚。"],
    career: ["一个长期职业目标变得异常清晰，画出接下来三步——你比想象中更近。", "你的声誉已经走在你前面了。一位高层正在留意你的表现——本周的成果格外重要。", "官僚程序让人沮丧但也有保护作用。耐心穿越系统，门会在下周打开。", "薪资或晋升的谈话时机已经成熟。准备好数据并挑选合适的时机。"],
    wellness: ["膝盖和骨骼扛着向上攀爬的重量。认真做拉伸和力量练习，千万别跳过热身。", "工作狂是你默认模式。每天为自己设一个铁定的停工时——然后真的停下来。", "咬紧牙根奋斗的压力让下颌和肩膀发紧。刻意的放松练习会有奇迹般的效果。", "攀登巅峰是你的本能，但在山脚的营地里也藏着最美的风景。不必内疚地去休息。"],
    growth: ["成就如果失去了意义，光芒也会暗淡。本周重新访问你的'为什么'。", "有个后辈正在仰望你，你的教导可能会改变他们的一生——认真地对待这件事。", "你的纪律性无人能及，但这周刻意去尝试一件事：为灵活而让步。", "想一想：十年后你想留下什么？现在为那个未来的自己种一粒种子。"],
  },
  Aquarius: {
    love: ["你的独特性是你最动人的地方。别收敛你的怪——正确的人会为此庆祝。", "一段友谊缓慢地靠近了某条分界线。别急着贴标签，让它自己慢慢长成。", "你在亲密之前需要思想的共鸣。一场激发灵感的思想辩论，是你的前奏。"],
    career: ["那个反常规的想法准备好见光了，找一个愿意聆听的观众让它亮相。", "科技、科学或社会影响力领域的工作与星辰对齐——沿着创新走。", "团队项目最适合发挥你的协作天赋。带领但不压制——帮大家共同闪耀。"],
    wellness: ["循环系统需要运动。跳舞、跳跃、哪怕是随便扭动——让血液流动起来。", "过度的屏幕时间正在消耗你的能量。留出不加任何数字设备的时间：纸、自然、面对面。", "你的神经系统像电波一样敏感。赤脚踩草地、深深的呼吸和温暖，是极佳的接地方式。"],
    growth: ["未来主义的远见是你的天赋，但也别抛下现在。至少此时此地停一会儿。", "人文关怀的冲动在涌动。去当一次志愿者、捐助、或对陌生人友善——这深深滋养你。", "你抵触标签和框架——这很好。但本周明确一件你坚定相信的事，这会让方向感澄明。"],
  },
  Pisces: {
    love: ["空气中弥漫着浪漫的讯息——但也可能是幻想。区分真实与投射。", "你的共情能感知到另一半的心情，这是天赋——但也记住自己和对方的边界。"],
    career: ["创造力在本周达到巅峰。倾注到一个需要想象力而非纯逻辑的项目里。", "你看得见别人忽略的微妙氛围，情商是战略优势——善用它。"],
    wellness: ["双脚承载了你走过世界——也承载过你的梦。一次足浴或按摩让你找回地面。", "逃避现实的诱惑很大却不是真正的修复。用真正的休息去替代漫无目的地刷屏幕。"],
    growth: ["想象力是你最大的宝藏。这周创作点什么——任何东西——不带评判地去创造。", "直觉和恐惧之间往往只有一线之隔。安静地坐下来面对一个决定，直到清晰浮现。"],
  },
};

function pick(list: string[], weekNum: number): string {
  return list[weekNum % list.length];
}

export function generateWeeklyHoroscope(): {
  dateRange: string;
  signs: { emoji: string; zh: string; en: string; forecast: string; forecastZh: string }[];
  knowledge: { en: string; zh: string };
} {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dateRange = `${fmt(monday)} — ${fmt(sunday)}`;

  // Get ISO week number to seed the rotation
  const weekNum = (() => {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  })();

  const themeIdx = weekNum % THEMES.length;
  const theme = THEMES[themeIdx];

  const signs = SIGNS.map((sign) => {
    const pool = EN[sign.en]?.[theme] || [""];
    const poolZh = ZH[sign.en]?.[theme] || [""];
    return {
      emoji: sign.emoji,
      zh: sign.zh,
      en: sign.en,
      forecast: pick(pool, weekNum),
      forecastZh: pick(poolZh, weekNum),
    };
  });

  const knowledgePool = [
    {
      en: "Your Rising Sign (Ascendant) is the mask you wear in public — it's even more important than your Sun sign for first impressions. Generate your full chart free to discover yours.",
      zh: "上升星座是你在公共场合戴的面具——它比太阳星座更能决定别人对你的第一印象。免费生成完整星盘，发现你的上升星座。",
    },
    {
      en: "In BaZi (Chinese Astrology), your Day Master is the element that defines your core personality. There are 10 types — from Yang Wood (the visionary leader) to Yin Water (the intuitive artist). Find yours free.",
      zh: "在八字命理中，日主是定义你核心个性的五行元素。从甲木（进取的领导者）到癸水（直觉的艺术家），共十种类型。免费查询你的日主。",
    },
    {
      en: "The Five Elements (Wood, Fire, Earth, Metal, Water) govern not just BaZi but your entire energy constitution. An imbalance can show up as health issues or life blocks.",
      zh: "五行（木火土金水）不仅支配八字命理，也密切关联你的体质能量。五行的失衡可能表现为健康问题或生活中的阻塞。",
    },
    {
      en: "Your Moon sign reveals your emotional inner world — how you love, what you need to feel safe, and your instinctive reactions. Most people don't know theirs.",
      zh: "月亮星座揭示你的情感内核——你如何爱人、你需要什么来感到安全、以及你的本能反应。大多数人不知道自己的月亮星座。",
    },
  ];

  return { dateRange, signs, knowledge: knowledgePool[weekNum % knowledgePool.length] };
}
