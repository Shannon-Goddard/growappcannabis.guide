const horoscopes = {
    aries: [
        "Aries, your fiery spirit will ignite a group chat argument today—congratulations, you’re trending! Just don’t burn the house down with your spicy takes.",
        "Bold Aries, the stars say you’ll try to ‘fix’ your Wi-Fi by yelling at it. Spoiler: It won’t work, but your passion is inspiring!",
        "Charge into today like the ram you are, Aries, but maybe avoid headbutting that coworker who stole your lunch. Diplomacy is your secret weapon.",
        "Aries, your vibe is giving main character energy, but the universe suggests a side quest: clean your inbox before it becomes a Netflix drama.",
        "The cosmos whisper that you’ll impulse-buy a gym membership today, Aries. You’ll go once, call it a win, and celebrate with tacos.",
        "Aries, the stars predict you’ll challenge someone to a race—and win—only to realize it was a slow walk to the fridge. Pace yourself!",
        "Your courage shines, Aries, but don’t roar at the barista for forgetting your extra shot. A polite nudge works wonders.",
        "Aries, the universe says it’s a great day to start a revolution… or at least a heated debate about pineapple on pizza.",
        "Expect a burst of energy, Aries, but channel it into something productive—like finally assembling that IKEA furniture.",
        "Aries, your bold ideas will impress your boss, but maybe don’t pitch ‘office dodgeball’ during the meeting.",
        "The stars see you leading a spontaneous road trip, Aries. Pack snacks, not just your ego!",
        "Aries, you’ll conquer a fear today—spiders, heights, or that awkward small talk. The cosmos applauds your bravery!",
        "Your competitive streak kicks in, Aries, but don’t turn the family game night into a WWE match. Keep it fun!",
        "Aries, the universe hints at a wild night out. Just don’t challenge the bouncer to an arm-wrestling contest.",
        "Get ready to charge through a challenge, Aries, but don’t trample your friends’ feelings in the process—use that ram charm!"
    ],
    taurus: [
        "Taurus, your stubborn streak is stronger than your Wi-Fi signal today. Compromise on that pizza topping debate, or you’ll eat alone.",
        "The stars predict a cozy night in, Taurus, but your couch might file for divorce if you don’t get up soon. Balance is key!",
        "Indulgent Taurus, you’ll be tempted to buy that overpriced candle. Spoiler: It smells like regret. Save your cash for snacks.",
        "Your grounded nature is a gift, Taurus, but don’t plant yourself so firmly that you miss the party. Dance like nobody’s watching!",
        "Taurus, the universe is serving you a buffet of opportunities. Don’t just stick to the mashed potatoes—try something new!",
        "Taurus, the stars see you napping through a golden opportunity. Set an alarm, or your bed might win this round!",
        "Your love for luxury shines, Taurus, but don’t max out your card on that velvet robe—save some for dessert.",
        "Taurus, the cosmos suggest a garden day, but don’t argue with the weeds—they’re just trying to live too!",
        "Expect a craving for comfort food, Taurus. The stars say it’s fine, as long as you share with your plants.",
        "Taurus, your patience will save a friendship today, but don’t let it turn into a marathon listening session.",
        "The universe gifts you a lazy day, Taurus, but don’t let your blanket fort become a permanent residence.",
        "Taurus, you’ll resist change like a champ, but the stars say trying that new café might be worth it.",
        "Your stubborn charm wins hearts, Taurus, but don’t dig in your heels over who gets the armrest on the couch.",
        "Taurus, the stars predict a shopping spree—stick to sales, or your wallet will stage a revolt!",
        "Enjoy a slow morning, Taurus, but don’t let your coffee get cold while you admire your own zen."
    ],
    gemini: [
        "Gemini, your dual nature means you’ll start three group chats and ghost two of them today. Commit to one vibe, just for 24 hours!",
        "The stars say you’ll charm someone with your wit, Gemini, but they’ll be less impressed when you leave dishes in the sink. Multitask wisely.",
        "Curious Gemini, you’ll Google ‘why do I procrastinate’ while procrastinating. The universe suggests a to-do list and some self-control.",
        "Your social butterfly wings are flapping, Gemini, but don’t RSVP ‘maybe’ to every event. Pick one and actually show up!",
        "Gemini, your brain is moving faster than a TikTok trend. Slow down, or you’ll accidentally text your boss that meme meant for your BFF.",
        "Gemini, the stars see you juggling two conversations at once—don’t drop the one with your mom!",
        "Your quick wit saves the day, Gemini, but don’t use it to talk your way out of doing the dishes.",
        "Gemini, the universe predicts a debate with yourself. Flip a coin to settle it and move on!",
        "Expect a burst of ideas, Gemini, but don’t start five projects before finishing your coffee.",
        "Gemini, your charm is on fleek, but don’t flirt with trouble by promising too many plans.",
        "The stars say you’ll master a new skill, Gemini—until you get bored and switch to knitting.",
        "Gemini, your dual personality might lead to a costume change mid-day. Own it with style!",
        "You’ll network like a pro, Gemini, but don’t collect business cards you’ll never call.",
        "Gemini, the cosmos hint at a gossip session—keep it light, or you’ll start a rumor war!",
        "Your curiosity leads to adventure, Gemini, but don’t get lost in a Wikipedia rabbit hole."
    ],
    cancer: [
        "Cancer, your emotional radar is picking up all the feels today. Channel that energy into a group hug, not a group cry.",
        "The stars see you baking cookies to avoid your problems, Cancer. Share the batch, and you’ll win hearts instead of stress-eating.",
        "Nurturing Cancer, you’ll want to adopt a stray cat or a friend’s drama today. Set boundaries, or your couch becomes a shelter!",
        "Your intuition is spot-on, Cancer, but don’t assume your barista’s smile means they’re in love. It’s just coffee, not destiny.",
        "Cancer, the moon says it’s time to declutter your heart. Forgive that grudge, but maybe keep the grudge against bad Wi-Fi.",
        "Cancer, the stars predict a tearjerker movie night. Stock up on tissues and chocolate!",
        "Your empathy shines, Cancer, but don’t absorb everyone’s drama—save some energy for yourself.",
        "Cancer, the universe says to nest today—redecorate, but don’t cry over spilled paint.",
        "Expect a mood swing, Cancer. The stars suggest a cozy blanket and a playlist to ride it out.",
        "Cancer, your intuition warns of a bad decision—trust it, even if it’s skipping that sketchy taco truck.",
        "The moon blesses you with creativity, Cancer—paint a masterpiece, not your walls by accident!",
        "Cancer, you’ll comfort a friend, but don’t let their sob story ruin your day too.",
        "The stars see a family reunion, Cancer—bring your famous soup, but leave the drama at home.",
        "Cancer, your sensitivity is a gift, but don’t take that passive-aggressive text to heart.",
        "Get ready to pamper yourself, Cancer—the cosmos say a bubble bath beats a breakdown!"
    ],
    leo: [
        "Leo, your spotlight is brighter than a supernova today, but don’t blind everyone with your selfie game. Share the stage!",
        "The stars predict you’ll plan a dramatic entrance to a Zoom call, Leo. Nail it, but don’t expect an Oscar for punctuality.",
        "Charismatic Leo, you’ll charm the socks off someone today, but they’ll notice if you borrowed those socks. Be authentic!",
        "Your confidence is contagious, Leo, but don’t let it turn into ‘I’ll do it tomorrow’ energy. Slay that to-do list now.",
        "Leo, the universe is your stage, but maybe rehearse your lines before you pitch that wild idea to your boss.",
        "Leo, the stars see a grand gesture—don’t propose via meme unless you mean it!",
        "Your leadership shines, Leo, but don’t turn the team meeting into your personal fan club.",
        "Leo, the cosmos predict a photoshoot day—strike a pose, but don’t scare the cat with the flash!",
        "Expect applause for your efforts, Leo, but don’t demand a standing ovation from your dog.",
        "Leo, your flair for drama will spice up a dull party—keep it fun, not a soap opera!",
        "The stars say you’ll host a feast, Leo—cook with passion, but don’t burn the kitchen down.",
        "Leo, your confidence inspires, but don’t bet your rent on that poker bluff!",
        "Get ready to shine, Leo—the universe loves your strut, just don’t trip on the catwalk.",
        "Leo, the stars hint at a bold outfit—rock it, but don’t outshine the bride at the wedding!",
        "Your royal vibe is strong, Leo, but don’t decree pizza night without a vote."
    ],
    virgo: [
        "Virgo, your to-do list is longer than a CVS receipt today. Prioritize, or you’ll be organizing your sock drawer at midnight.",
        "The stars suggest you’ll fix everyone’s problems but your own, Virgo. Take a break from being the group therapist and pamper yourself.",
        "Perfectionist Virgo, you’ll rewrite that email five times today. Send it already—the typos are part of your charm!",
        "Your analytical brain is a superpower, Virgo, but don’t overthink your takeout order. Pizza is always the right answer.",
        "Virgo, the cosmos say your spreadsheet game is strong, but your social game needs a boost. Say yes to that invite!",
        "Virgo, the stars see you cleaning obsessively—polish the trophies, not your neighbor’s car!",
        "Your attention to detail saves the day, Virgo, but don’t nitpick the font on your friend’s birthday card.",
        "Virgo, the universe suggests a break—step away from the planner before it plans your life!",
        "Expect a health kick, Virgo—try yoga, but don’t judge your cat’s downward dog.",
        "Virgo, your organization skills impress, but don’t alphabetize the spice rack mid-dinner.",
        "The stars predict a DIY project, Virgo—nail it, but don’t turn it into a perfectionist nightmare.",
        "Virgo, your critiques are spot-on, but don’t roast the chef at the family BBQ.",
        "Get ready to analyze, Virgo—the cosmos say it’s fine, as long as it’s not your dreams!",
        "Virgo, the stars hint at a tidy desk—organize it, but don’t file your snacks!",
        "Your practicality shines, Virgo, but don’t budget every penny of your fun fund."
    ],
    libra: [
        "Libra, your charm could sell ice to penguins today, but don’t flirt with disaster by ignoring that deadline. Balance is your mantra.",
        "The stars see you redecorating your space for the third time this month, Libra. Commit to a vibe before your wallet cries.",
        "Indecisive Libra, you’ll spend 20 minutes choosing a Netflix show. The universe suggests picking the first one and vibing.",
        "Your diplomacy saves the day, Libra, but don’t say ‘I’m fine’ when you’re not. The stars demand honesty!",
        "Libra, your aesthetic is on point, but don’t let a cute Instagram filter distract you from real-world connections.",
        "Libra, the stars predict a fashion dilemma—pick an outfit, or you’ll miss the party!",
        "Your peace-making skills shine, Libra, but don’t mediate a cat fight at 3 a.m.",
        "Libra, the universe suggests a spa day—balance it with a workout, or skip the guilt!",
        "Expect a romantic vibe, Libra, but don’t serenade your crush with off-key karaoke.",
        "Libra, your eye for beauty is unmatched, but don’t reframe every photo on the wall today.",
        "The stars see a social invite, Libra—RSVP yes, but don’t overthink the outfit.",
        "Libra, your charm wins a debate, but don’t sway the vote with a smile alone!",
        "Get ready to balance work and play, Libra—the cosmos say it’s possible with coffee.",
        "Libra, the stars hint at a gift—buy it for someone, not just your mirror selfie!",
        "Your harmony-seeking nature calms a storm, Libra, but don’t tiptoe around your own needs."
    ],
    scorpio: [
        "Scorpio, your mysterious aura is drawing people in today, but don’t scare them off with that intense stare. Soften the vibe!",
        "The stars predict you’ll uncover someone’s secret, Scorpio. Resist the urge to turn it into a true crime podcast.",
        "Passionate Scorpio, you’ll dive into a new obsession today. Just make sure it’s not your ex’s Instagram story.",
        "Your intuition is sharper than a detective’s, Scorpio, but don’t assume your roommate ate your leftovers. Check the fridge first.",
        "Scorpio, the universe says it’s time to let go of that grudge. It’s heavier than your collection of black hoodies.",
        "Scorpio, the stars see a power move—use it to impress, not intimidate!",
        "Your intensity electrifies a date, Scorpio, but don’t stare into their soul too long.",
        "Scorpio, the cosmos predict a deep convo—keep it intriguing, not an interrogation!",
        "Expect a transformation, Scorpio—new look, new vibe, but don’t shed your old friends.",
        "Scorpio, your magnetism draws a crowd, but don’t turn it into a cult meeting!",
        "The stars hint at a mystery to solve, Scorpio—start with your lost keys, not a conspiracy!",
        "Scorpio, your passion fuels a project, but don’t burn out chasing perfection.",
        "Get ready to uncover truth, Scorpio—the universe loves your detective skills!",
        "Scorpio, the stars see a bold flirt—go for it, but don’t sting with rejection!",
        "Your dark humor wins laughs, Scorpio, but don’t scare the party with a ghost story."
    ],
    sagittarius: [
        "Sagittarius, your wanderlust is calling, but the stars suggest not booking a flight during a Zoom meeting. Multitask smarter!",
        "The cosmos predict you’ll tell a story that leaves everyone in stitches, Sagittarius. Just don’t exaggerate the part about the aliens.",
        "Adventurous Sagittarius, you’ll try a new hobby today. Spoiler: It’s fun until you realize it’s not free. Budget wisely!",
        "Your optimism is infectious, Sagittarius, but don’t promise to ‘be there in 5’ when you’re still in pajamas.",
        "Sagittarius, the stars say your next big idea is gold, but maybe don’t pitch it at 3 a.m. in the group chat.",
        "Sagittarius, the universe plans a getaway—pack light, but don’t leave your charger!",
        "Your humor lights up the room, Sagittarius, but don’t joke about the boss’s tie!",
        "Sagittarius, the stars see a spontaneous hike—bring water, not just your phone!",
        "Expect a philosophical debate, Sagittarius—win it with facts, not wild guesses!",
        "Sagittarius, your free spirit shines, but don’t ditch plans for a random road trip.",
        "The cosmos gift you a learning day, Sagittarius—try a language app, not a bar tab!",
        "Sagittarius, the stars predict a bold move—ask that crush out, but don’t oversell it!",
        "Get ready to explore, Sagittarius—the universe says yes, even if it’s just the backyard!",
        "Sagittarius, your optimism lifts spirits, but don’t bet the rent on a lucky hunch.",
        "The stars see a party invite, Sagittarius—go, but don’t turn it into a travelogue!"
    ],
    capricorn: [
        "Capricorn, your work ethic is legendary, but the stars say to clock out before you turn into a robot. Netflix awaits!",
        "The cosmos predict you’ll organize your desk and your life today, Capricorn. Leave room for spontaneous fun, though!",
        "Ambitious Capricorn, you’ll climb the ladder of success, but don’t trip over that coffee cup you’ve ignored for days.",
        "Your discipline is unmatched, Capricorn, but don’t schedule your naps. Let the universe surprise you with a cozy moment.",
        "Capricorn, the stars say your hustle is paying off, but don’t forget to text your friends back. They miss you!",
        "Capricorn, the stars see a promotion—earn it, but don’t work through lunch!",
        "Your practicality saves cash, Capricorn, but don’t skip the coffee date to save a buck.",
        "Capricorn, the universe suggests a goal—set it high, but don’t climb in heels!",
        "Expect a productive day, Capricorn—organize, but don’t file your dreams away.",
        "Capricorn, your focus is laser-sharp, but don’t ignore the sunset for a spreadsheet.",
        "The stars predict a raise, Capricorn—celebrate, but don’t buy a yacht yet!",
        "Capricorn, your ambition inspires, but don’t boss the dog into a workout routine.",
        "Get ready to plan, Capricorn—the cosmos love your strategy, not your stress!",
        "Capricorn, the stars hint at a side hustle—try it, but don’t neglect sleep.",
        "Your determination shines, Capricorn, but don’t turn a hobby into a second job!"
    ],
    aquarius: [
        "Aquarius, your quirky ideas are sparking a revolution today, but maybe don’t redesign the internet at 2 a.m.",
        "The stars see you joining a cause, Aquarius, but don’t get lost in the group chat planning world domination. Sleep first!",
        "Visionary Aquarius, you’ll invent something brilliant today, but it might just be a new way to avoid laundry.",
        "Your independence is your superpower, Aquarius, but don’t ghost your BFF when they need your weird wisdom.",
        "Aquarius, the universe says your vibe is out-of-this-world, but ground yourself before you float away in a daydream.",
        "Aquarius, the stars predict a tech breakthrough—fix your Wi-Fi, not your neighbor’s!",
        "Your originality shines, Aquarius, but don’t wear socks with sandals to the gala.",
        "Aquarius, the cosmos see a protest—march for justice, not just a snack break!",
        "Expect a wild idea, Aquarius—pitch it, but don’t confuse your cat with the details!",
        "Aquarius, your eccentricity charms, but don’t dye your hair neon during a meeting.",
        "The stars hint at a group project, Aquarius—lead it, but don’t alienate the team!",
        "Aquarius, your future vision is clear, but don’t predict the weather with a spoon!",
        "Get ready to innovate, Aquarius—the universe loves your quirks, not your chaos!",
        "Aquarius, the stars see a friend in need—help with advice, not a UFO theory!",
        "Your rebel spirit inspires, Aquarius, but don’t rebel against bedtime tonight!"
    ],
    pisces: [
        "Pisces, your dreamy vibe is painting the world in pastels today, but don’t forget to pay that bill before it’s a nightmare.",
        "The stars predict you’ll write a poem or cry over a TikTok, Pisces. Either way, keep tissues handy!",
        "Empathetic Pisces, you’ll feel everyone’s emotions today. Protect your energy, or you’ll need a nap by noon.",
        "Your imagination is a gift, Pisces, but don’t let it convince you that your cat is plotting against you.",
        "Pisces, the cosmos say you’ll find inspiration in a sunset or a meme. Turn it into art, not a 3-hour daydream.",
        "Pisces, the stars see a mystical dream—write it down, but don’t call it a prophecy!",
        "Your compassion heals a friend, Pisces, but don’t drown in their tears.",
        "Pisces, the universe suggests a swim—literal or metaphorical, just avoid the drama!",
        "Expect a creative surge, Pisces—paint, but don’t use the walls as your canvas!",
        "Pisces, your intuition guides you, but don’t trust it to pick lottery numbers.",
        "The stars predict a romantic escape, Pisces—plan it, but don’t ghost reality!",
        "Pisces, your empathy is a superpower, but don’t adopt every stray emotion.",
        "Get ready to daydream, Pisces—the cosmos say it’s fine, as long as you wake up!",
        "Pisces, the moon blesses your art—share it, but don’t sell your soul for likes.",
        "Your gentle nature soothes, Pisces, but don’t let it turn into people-pleasing!"
    ]
};

function getHoroscope() {
    const zodiac = document.getElementById('zodiac').value;
    const horoscopeDiv = document.getElementById('horoscope');

    if (!zodiac) {
        horoscopeDiv.innerHTML = "Please select a zodiac sign to reveal your fate!";
        return;
    }

    const messages = horoscopes[zodiac];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    horoscopeDiv.innerHTML = randomMessage;
    horoscopeDiv.style.opacity = 0;
    setTimeout(() => {
        horoscopeDiv.style.opacity = 1;
    }, 100);
}