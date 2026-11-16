// Blog posts for /blog, prerendered by scripts/seo-build.mjs as plain static
// pages (no React bundle - the SPA has no blog route, so hydrating would
// replace the article). Each post targets an informational version of a query
// cluster from Search Console and links into the matching site pages.
//
// Block types: { h2 } | { p } | { ul: [] } | { ol: [] } | { table: { head: [], rows: [[]] } }
// Inline links in any text: [label](/path)
//
// Facts quoted here (piece grids, controls, counts) come from the game itself:
// grids from src/engine/fitGrid.mjs, controls from src/components/Controls.tsx
// and SettingsModal.tsx. Update them together.

export const POSTS = [
  {
    slug: 'how-to-play-jigsaw-puzzles-online-free',
    title: 'How to Play Jigsaw Puzzles Online Free - No Download, No Login',
    h1: 'How to Play Jigsaw Puzzles Online for Free (No Download Needed)',
    description:
      'A step-by-step guide to playing free online jigsaw puzzles in your browser - no download, no app and no account. Pick a photo, choose 12 to 300 pieces and start.',
    date: '2026-11-16',
    readMins: 5,
    blocks: [
      { p: 'Jigsaw puzzles used to mean a box, a table and a few evenings. Today you can play the same puzzle in a web browser in under ten seconds - on a laptop, a tablet or a phone - and most good sites are completely free. This guide walks through how online jigsaw puzzles work, what to look for in a free site, and how to start your first one on JigsawJam without downloading anything.' },
      { h2: 'Do you need to download anything?' },
      { p: 'No. Modern online jigsaw puzzles run entirely in the browser using standard web technology - the same thing that shows you a news article or a map. There is no app to install, no Flash or Java plugin, and nothing is saved to your computer except an optional record of your progress and scores.' },
      { p: 'That matters for three reasons. It is safer (no installers from unknown publishers), it works on shared or locked-down computers where you cannot install software, and it works on any device: the same puzzle plays on Windows, Mac, Chromebook, iPhone, iPad or Android.' },
      { h2: 'How to start a free jigsaw puzzle in your browser' },
      { ol: [
        'Open [JigsawJam](/) in any modern browser - Chrome, Safari, Edge or Firefox.',
        'Pick a picture. Browse by theme on the [categories page](/categories), or go straight to a favourite like [landscapes](/landscapes-online-free-jigsaw-puzzles), [dogs](/dogs-online-free-jigsaw-puzzles) or [flowers](/flowers-online-free-jigsaw-puzzles).',
        'Choose a difficulty: Easy (12 pieces), Medium (48), Hard (108) or Expert (300).',
        'Press Play. The pieces are scattered around the board; drag one near its neighbour and it snaps into place.',
        'Finish the picture. Your time and score are shown at the end - or switch the timer off and just relax.',
      ] },
      { p: 'There is no sign-up step anywhere in that list, and that is deliberate. You should be able to go from "I fancy a puzzle" to moving pieces without handing over an email address.' },
      { h2: 'What makes a good free online jigsaw site?' },
      { ul: [
        '**No download and no login.** If a site insists you install something or register before the first puzzle, keep looking.',
        '**Real photographs, not clip art.** Sharp, high-resolution photos are what make a jigsaw satisfying, especially at higher piece counts.',
        '**A choice of piece counts.** A 12-piece puzzle is a two-minute break; a 300-piece one is an evening. You want both.',
        '**Classic interlocking pieces.** Traditional tab-and-blank shapes that snap together feel like a real jigsaw. Square tiles you swap around are a different, simpler game.',
        '**Comfort controls.** Zoom, full screen, a way to hide the timer, and a preview of the finished image make long puzzles pleasant instead of fiddly.',
      ] },
      { h2: 'Controls worth knowing' },
      { p: 'Once a puzzle is open, the control bar has everything you need: **Preview** shows the finished picture whenever you lose your place, **Shuffle** scatters the loose pieces again if they have piled up, **Full screen** gives you the whole display, and the zoom buttons let you work on detail without squinting. If you would rather not be timed, switch the **Timer** off - or turn on Relaxed mode in Settings to keep it off for every puzzle.' },
      { p: 'Settings also has larger text, a high-contrast mode and a reduce-motion option, which make a real difference on small screens or for anyone who finds busy animation tiring.' },
      { h2: 'A new puzzle every day' },
      { p: 'If you like a routine, the [daily jigsaw puzzle](/daily-jigsaw-puzzle) is a featured Puzzle of the Day that changes every day. Everyone gets the same picture, so it works well as a shared habit with friends or family. During seasonal events such as Halloween and Christmas, themed puzzles also earn triple points.' },
      { h2: 'Puzzles for every age' },
      { p: 'Because you choose the piece count, the same site works for everyone in the house. Younger players usually enjoy bright animals at 12 or 48 pieces - see [jigsaw puzzles for kids](/jigsaw-puzzles-for-kids). Adults often settle into 108 or 300-piece landscapes and architecture - see [jigsaw puzzles for adults](/jigsaw-puzzles-for-adults). And for clear, calm photos with high contrast, try [jigsaw puzzles for seniors](/jigsaw-puzzles-for-seniors).' },
      { h2: 'Turn your own photo into a puzzle' },
      { p: 'Any picture on your phone can become a jigsaw too - a pet, a holiday, a family photo. The [custom jigsaw puzzle maker](/create-a-custom-jigsaw-puzzle) cuts your own image into the same classic pieces, right in the browser.' },
      { h2: 'Frequently asked questions' },
      { faq: [
        ['Are online jigsaw puzzles really free?', 'On JigsawJam, yes - every puzzle is free to play with no subscription, no account and no download.'],
        ['Can I play jigsaw puzzles online on my phone?', 'Yes. The puzzles run in your phone’s browser. Lower piece counts (12 or 48) are the most comfortable on a small screen; use zoom and full screen for bigger ones.'],
        ['Are my scores saved without an account?', 'Yes. Your points and profile are kept in your browser on that device, so there is no account to create or log into.'],
      ] },
    ],
  },

  {
    slug: 'how-to-solve-jigsaw-puzzles-faster',
    title: 'How to Solve a Jigsaw Puzzle Faster: 10 Tips That Work',
    h1: 'How to Solve a Jigsaw Puzzle Faster: 10 Tips That Actually Work',
    description:
      'Ten practical jigsaw puzzle tips - edges first, sort by colour, work the detail, handle skies and water - that work for online and boxed puzzles from 12 to 300 pieces.',
    date: '2026-11-16',
    readMins: 6,
    blocks: [
      { p: 'Speed in a jigsaw puzzle is not about moving pieces quickly. It is about making fewer wrong guesses. Every tip below cuts down the number of pieces you have to try before you find the right one - which is why they work just as well on a 48-piece online puzzle as on a 1,000-piece boxed one.' },
      { h2: '1. Do the edges first' },
      { p: 'Border pieces have one straight side, so they are the easiest to identify and they give you a frame to build into. Pull every straight-edged piece to one side, assemble the border, and the rest of the puzzle has a fixed size and shape. Corners - two straight sides - are your first four anchors.' },
      { h2: '2. Sort by colour before you build' },
      { p: 'Five or six rough piles - sky, foliage, buildings, shadows, the bright subject - turn one 300-piece problem into six 50-piece problems. Online, drag pieces into loose clusters in different corners of the board. It feels slow for the first two minutes and saves you twenty.' },
      { h2: '3. Start with the most detailed area' },
      { p: 'Text, faces, eyes, windows and sharp edges are unique: each piece can only go in one place. Build those first. The plain areas go much faster once everything around them is finished, because the gaps tell you the shapes you are looking for.' },
      { h2: '4. Use the picture' },
      { p: 'There is no prize for solving from memory. Check the finished image often - online, the Preview button shows it instantly. Look for where a colour sits in the picture before you hunt for its pieces.' },
      { h2: '5. Read piece shapes, not just colours' },
      { p: 'Classic pieces have tabs (knobs) and blanks (holes). When colour stops helping - in skies, snow or water - shape takes over. Note what a gap needs ("two tabs on the sides, a blank on top") and scan only for pieces with that pattern.' },
      { h2: '6. Break skies and water into bands' },
      { p: 'Large areas of one colour are the classic slowdown. Almost no sky is truly uniform: it gets lighter toward the horizon and warmer near the sun. Sort sky pieces by lightness, then build in horizontal bands. Water works the same way, with ripple direction and highlights as your clues - try it on our [beach puzzles](/beaches-online-free-jigsaw-puzzles).' },
      { h2: '7. Build sub-assemblies' },
      { p: 'You do not have to grow the puzzle from the border inward. Assemble a whole object - a boat, a flower, a train - on its own, then slot it in. Online, joined pieces move together as one group, so a finished cluster is easy to carry into place.' },
      { h2: '8. Use landmarks as anchors' },
      { p: 'Find the few things that cut across the picture - a horizon, a ridge line, a road, a tree trunk - and place them early. They split the image into regions, and each region is a smaller, easier puzzle. Mountain and [landscape puzzles](/landscapes-online-free-jigsaw-puzzles) are perfect practice for this.' },
      { h2: '9. Pick the right piece count' },
      { p: 'Getting faster means practising at the edge of your ability, not far beyond it. If 300 pieces feels like a wall, spend a few sessions at 108 first. Our guide to [choosing how many pieces](/blog/how-many-pieces-jigsaw-puzzle) explains what changes at each size.' },
      { h2: '10. Reset the board when it gets messy' },
      { p: 'Piles of overlapping pieces hide the one you need. Spread them out so every piece is visible - online, the Shuffle button does it in one click. Zoom in when pieces are small, and use full screen to give yourself room.' },
      { h2: 'Practice every day' },
      { p: 'Like any skill, puzzle speed improves with regular short sessions more than with occasional marathons. The [daily jigsaw puzzle](/daily-jigsaw-puzzle) is a good habit to build: one new picture a day, the same for everyone, at whatever size you choose.' },
    ],
  },

  {
    slug: 'how-many-pieces-jigsaw-puzzle',
    title: 'How Many Pieces Should a Jigsaw Puzzle Have? 12 to 300 Explained',
    h1: 'How Many Pieces Should a Jigsaw Puzzle Have? From 12 to 300 Pieces',
    description:
      'Choosing a jigsaw size: what 12, 48, 108 and 300-piece puzzles feel like, how long they take, how the picture is cut into a grid, and which size suits kids, adults and seniors.',
    date: '2026-11-16',
    readMins: 5,
    blocks: [
      { p: 'The piece count decides almost everything about a jigsaw puzzle: how long it takes, how small each piece is, and whether it feels relaxing or demanding. Online you can change it for free on every picture, so it is worth knowing what each size is actually like.' },
      { h2: 'The four sizes at a glance' },
      { table: {
        head: ['Difficulty', 'Pieces', 'Feels like', 'Good for'],
        rows: [
          ['Easy', '12', 'A quick two-minute break', 'Young children, phones, warm-ups'],
          ['Medium', '48', 'A coffee-break puzzle', 'Older kids, casual play, small screens'],
          ['Hard', '108', 'A proper puzzle with real sorting', 'Adults and regular puzzlers'],
          ['Expert', '300', 'An evening project', 'Experienced puzzlers, large screens'],
        ],
      } },
      { h2: 'How a photo is cut into pieces' },
      { p: 'A jigsaw is cut on a grid of columns and rows, and the grid follows the shape of the picture so each piece stays close to square. That is why the exact count varies slightly from photo to photo. On JigsawJam, a standard 3:2 landscape photo is cut like this:' },
      { table: {
        head: ['Difficulty', 'Landscape (3:2)', 'Portrait (2:3)', 'Square'],
        rows: [
          ['Easy', '4 × 3 = 12', '3 × 4 = 12', '3 × 4 = 12'],
          ['Medium', '8 × 6 = 48', '6 × 8 = 48', '7 × 7 = 49'],
          ['Hard', '13 × 8 = 104', '8 × 14 = 112', '10 × 11 = 110'],
          ['Expert', '21 × 14 = 294', '14 × 21 = 294', '17 × 18 = 306'],
        ],
      } },
      { p: 'Every individual puzzle page lists the exact grid for that photo, so you know what you are getting before you press Play.' },
      { h2: 'Why piece count changes difficulty so much' },
      { p: 'Doubling the pieces more than doubles the work. With more pieces, each one carries less of the picture, so colour alone stops being enough to place it. At 12 pieces every piece shows something recognisable. At 300, many pieces are a patch of sky or a bit of leaf, and you start relying on shape and careful sorting - see our [tips for solving jigsaw puzzles faster](/blog/how-to-solve-jigsaw-puzzles-faster).' },
      { p: 'The photo matters as much as the count. A busy, colourful picture at 300 pieces can be easier than a misty seascape at 108. When you move up a size, choose a photo with strong detail and clear regions - [castles](/castles-online-free-jigsaw-puzzles), [trains](/trains-online-free-jigsaw-puzzles) and city streets are ideal.' },
      { h2: 'Choosing a size by age' },
      { ul: [
        '**Young children:** start at 12 pieces with a single clear subject - a dog, a cat, a bright bird. Move to 48 once 12 feels easy. See [jigsaw puzzles for kids](/jigsaw-puzzles-for-kids).',
        '**Adults:** 108 is the sweet spot for a satisfying puzzle in one sitting; 300 for a longer, absorbing session. See [jigsaw puzzles for adults](/jigsaw-puzzles-for-adults).',
        '**Seniors:** 48 or 108 pieces with calm, high-contrast photos - flowers, gardens, coastlines - keeps pieces a comfortable size. Larger text and high-contrast mode are in Settings. See [jigsaw puzzles for seniors](/jigsaw-puzzles-for-seniors).',
      ] },
      { h2: 'Choosing a size by screen' },
      { p: 'On a phone, 12 or 48 pieces keeps each piece big enough to grab easily; zoom and full screen help if you want to go bigger. Tablets handle 108 comfortably. For 300 pieces, a laptop or desktop screen - or a tablet in full screen - gives the pieces room to breathe. For a big challenge, try our [300-piece jigsaw puzzles](/300-piece-jigsaw-puzzles).' },
      { h2: 'Try them all on the same picture' },
      { p: 'Because size is a free choice on every puzzle, the best way to find your level is to play one photo at two sizes. Pick today’s [daily jigsaw puzzle](/daily-jigsaw-puzzle), play it at 48 pieces, then try it at 108 - you will feel the difference immediately.' },
    ],
  },
]
