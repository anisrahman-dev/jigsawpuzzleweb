// Hand-written single-puzzle pages - one photo per page, each written for a
// search term people actually use (see Search Console). Each lives at a short
// URL with no image id: /<category>/<slug>, e.g. /christmas/christmas-market-jigsaw-puzzle.
//
// Imported by BOTH the React app (src/router.ts, src/components/PuzzlePage.tsx)
// and the prerender step (scripts/seo-build.mjs), so the static HTML and the
// hydrated page say exactly the same thing. Plain ESM; types in
// featuredPuzzles.d.mts.
//
// The old generated URL for each photo (/puzzle/<category>/<id>/<name>-by-<author>)
// permanently redirects here - see vercel.json, which seo-build keeps in sync.

export const FEATURED_PUZZLES = [
  {
    // Query: "christmas jigsaw puzzles free", "xmas puzzles online".
    category: 'christmas',
    id: '4705885',
    image: 'https://cdn.pixabay.com/photo/2019/12/19/10/56/christmas-market-4705885_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2019/12/19/10/56/christmas-market-4705885_640.jpg',
    width: 7952,
    height: 5304,
    slug: 'christmas-market-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Christmas Market Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      "Play a free Christmas market jigsaw puzzle online: a carousel glowing at Frankfurt's Christmas market at night. 12 to 300 pieces, no download or sign-up.",
    h1: 'Christmas Market Jigsaw Puzzle',
    alt: 'Carousel lit up at night at the Frankfurt Christmas market, in front of old half-timbered houses',
    lead:
      "A carousel glows gold at Frankfurt's Christmas market, ringed with lights and set against the dark, timber-framed houses of the old town. This free Christmas jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.",
    recommended: {
      pieces: 108,
      why: "108 pieces is the sweet spot for this picture: the lights give you plenty to work with, and the dark areas stay manageable. Choose 48 for a relaxed game, or 300 if you want the night sky and rooftops to put up a real fight.",
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          "Frankfurt's Christmas market is one of the oldest in Germany - it is first mentioned in records from 1393 - and one of the biggest. Each year from late November until just before Christmas, rows of wooden stalls fill the old town around the Römerberg square, selling mulled wine (Glühwein), roasted almonds and Bethmännchen, the marzipan pastries Frankfurt is known for.",
          "It's a perfect xmas puzzle to unwind with on a winter evening. This photo was taken after dark, when the market is at its best. A traditional carousel turns under a canopy of lights, and behind it stand the steep, half-timbered house fronts that give the old town its storybook look.",
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          'The carousel fills the middle of the frame. A golden horse stands on top of its roof, and below it the canopy is lined with rows of warm bulbs that light up the painted panels and the figures riding round underneath.',
          'Behind the carousel rise the fronts of half-timbered houses: dark red-brown beams criss-crossing pale plaster, with rows of small windows across every floor. On either side, little Christmas trees covered in fairy lights stand among the market stalls, and to the lower right a glowing round sign hangs above a stall roof.',
          'Along the bottom edge, out-of-focus blue and gold lights sparkle in the foreground, as if you were looking at the scene over the heads of the crowd.',
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a lit-up carousel at a Christmas market at night',
          "Location: Frankfurt am Main, Germany - the old town's Christmas market",
          'Main colours: gold, amber, deep red, black and a touch of blue',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (7952 × 5304 pixels), so it stays sharp even at 300 pieces',
          'Best piece count: 108 pieces',
          'Good for: Christmas evenings, families, seniors and anyone who loves festive lights',
        ],
      },
      {
        heading: 'Christmas market traditions in Germany',
        paras: [
          "Germany's Christmas markets go back to the late Middle Ages, when towns held markets at the start of winter for people to stock up for the cold months. Over time they turned into festive gatherings, and today almost every German town has one. Dresden's Striezelmarkt and Nuremberg's Christkindlesmarkt are among the most famous, alongside Frankfurt's.",
          'Wherever you go, you will find the same favourites: mulled wine served in a souvenir mug, gingerbread (Lebkuchen), sugared nuts, hand-carved wooden toys, and nutcrackers and incense smokers from the Ore Mountains. Frankfurt adds its own treats - Bethmännchen and Brenten, both made with marzipan - and a giant Christmas tree on the Römerberg.',
          'Many of the half-timbered houses on the Römerberg were destroyed in the Second World War. The row facing the town hall was rebuilt in the early 1980s, faithful to the originals - which is why the old town looks centuries old even though much of it is newer than it appears.',
        ],
      },
      {
        heading: 'A short history of the carousel',
        paras: [
          'The word carousel comes from the Italian "carosello", a mock battle that horsemen staged in the 1600s. Riders practised their skills by spearing rings while galloping in circles, and wooden training machines that spun riders round on model horses followed.',
          'By the 1800s these machines had become fairground rides, at first pushed round by people or ponies and later driven by steam and then electricity. Today a historic-style carousel is part of many German Christmas markets, and it is often the brightest thing on the square after dark - just as it is in this photo.',
        ],
      },
      {
        heading: 'Why this photo makes a good jigsaw puzzle',
        paras: [
          'A good jigsaw picture has areas that each look different, so you can tell where a piece belongs just by looking at it. This one has several: the golden carousel in the middle, the red-brown timber-framed houses behind it, the dark rooftops and sky above, and blurred blue and gold lights in the foreground.',
          'The warm colours are pleasant to work with for a long time, and the strong contrast between light and dark helps you separate the pieces into groups before you start.',
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - big pieces and a quick finish. Good for young children or a short break.',
          '48 pieces (Medium) - a relaxed game where the carousel and houses come together quickly. A good choice for seniors and casual players.',
          '108 pieces (Hard) - our recommendation. Enough pieces to get absorbed, without the dark areas becoming frustrating.',
          '300 pieces (Expert) - a proper challenge. The night sky and shadowed rooftops break into many similar dark pieces that you have to fit by shape.',
        ],
      },
      {
        heading: 'How to solve this Christmas market puzzle',
        paras: [
          'First, sort your pieces into five piles: edges, bright carousel lights, timber house fronts, dark rooftops and sky, and the blurred blue lights from the bottom of the picture. Splitting them up early makes every later step faster.',
          'Start with the carousel. Its ring of lights is the brightest part of the picture and forms an easy curve to build around. The golden horse on top is easy to spot and makes a useful landmark.',
          'Next, do the house fronts. The pale plaster crossed with dark timber beams makes strong lines that show you exactly how neighbouring pieces fit together.',
          'Leave the night sky and the darkest corners until last. With little detail to go on, sort those pieces by shape - and turn on the preview if you want a faint copy of the finished picture to work over.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is this Christmas market jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game. Pick 12 or 48 for a quick, easy one, or 300 for a long challenge - the dark night sky makes it much harder at the larger sizes.',
      },
      {
        q: 'Where was this photo taken?',
        a: "At the Christmas market in Frankfurt am Main, Germany - one of the country's oldest Christmas markets, held in the old town around the Römerberg square.",
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Who took this photo?',
        a: 'The photo is by chriswanders and is shared on Pixabay, a free photo library.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "christmas jigsaw puzzles free", "xmas puzzles online".
    category: 'christmas',
    id: '6796079',
    image: 'https://cdn.pixabay.com/photo/2021/11/15/00/54/gingerbread-house-6796079_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2021/11/15/00/54/gingerbread-house-6796079_640.jpg',
    width: 3697,
    height: 2748,
    slug: 'gingerbread-house-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Gingerbread House Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free gingerbread house jigsaw puzzle online: a candy-covered Christmas cottage between snowy fir trees. 12 to 300 pieces, no download or sign-up.',
    h1: 'Gingerbread House Jigsaw Puzzle',
    alt: 'Gingerbread house decorated with icing, sweets and a red poinsettia, between two fir trees under falling snow',
    lead: `A gingerbread house dripping with white icing and studded with colourful sweets sits between two fir trees as snow falls from a bright blue sky. This free Christmas jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 48,
      why: `48 pieces suits this cheerful picture best: the house, the trees and the sky are each easy to tell apart, so it comes together quickly and happily. Step up to 108 for a longer game - but at 300, the big blue sky full of snowflakes becomes a real test.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This is a festive, storybook-style Christmas picture. A gingerbread house - the kind families build and decorate together in December - stands in the snow, its roof thick with icing and its walls covered in sweets. The background has a painted, illustrated feel, with deep-green fir trees and snowflakes drifting across a vivid blue sky.`,
          `It is a bright, happy image with no dark areas at all, which makes it one of the friendliest Christmas jigsaw puzzles on the site - a lovely choice for children, grandparents, or anyone who wants a relaxing xmas puzzle.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The gingerbread house sits low in the middle of the frame. Its roof is coated in white icing dotted with rows of blue, red, green and yellow sweets, and a large red poinsettia flower sits at the top beside a little iced chimney. Candy canes stand at the corners, and the front is trimmed with garlands of icing and coloured beads.`,
          `Look closely and you will find a small gingerbread man by the door and a tiny decorated tree on the left of the house. Along the bottom runs a thick layer of white icing "snow" with more sweets pressed into it.`,
          `Two tall fir trees frame the house - one on the left, one on the right - and the rest of the picture is a bright blue sky scattered with white snowflakes.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a decorated gingerbread house in the snow',
          'Style: bright, illustrated Christmas scene',
          'Main colours: sky blue, fir green, gingerbread brown, white icing, red',
          'Shape: landscape (a little wider than it is tall, about 4:3)',
          'Photo quality: high resolution (3697 × 2748 pixels)',
          'Best piece count: 48 pieces',
          'Good for: children, families, seniors and relaxed Christmas afternoons',
        ],
      },
      {
        heading: 'A short history of gingerbread houses',
        paras: [
          `Spiced honey cakes have been baked in Europe for centuries, and German towns such as Nuremberg became famous for their gingerbread, called Lebkuchen. Bakers there formed guilds and turned gingerbread into an art, pressing it into carved moulds and decorating it for fairs and holidays.`,
          `Gingerbread houses became fashionable in Germany in the 1800s. The trend is often linked to the Brothers Grimm's fairy tale of Hansel and Gretel, published in 1812, in which two children find a house made of bread, cake and sugar in the forest. Bakers began building little edible cottages covered in sweets, and the custom spread across Europe and North America.`,
          `Today, building and decorating a gingerbread house is a Christmas tradition in many homes - and with a jigsaw version, nobody has to worry about the roof caving in.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The picture splits neatly into areas that look nothing alike: the busy, colourful house at the bottom, the dark green trees on each side, and the plain blue sky at the top. That makes it very easy to sort the pieces and see where each one belongs.`,
          `The house itself is full of small details - every sweet and icing drip is a clue - so the most satisfying part of the puzzle is also the easiest to place.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - a quick, happy puzzle that young children can finish on their own.',
          '48 pieces (Medium) - our recommendation. The house and trees come together nicely, and the sky stays easy.',
          '108 pieces (Hard) - a longer game where the blue sky starts to need a little patience.',
          '300 pieces (Expert) - a real challenge: the sky breaks into lots of blue pieces with only snowflakes to tell them apart.',
        ],
      },
      {
        heading: 'How to solve this gingerbread house puzzle',
        paras: [
          `Sort your pieces into four piles first: edges, the colourful house, green fir tree, and plain blue sky.`,
          `Build the gingerbread house first. The white icing roof line and the red poinsettia on top are easy landmarks, and every sweet helps you match neighbouring pieces.`,
          `Next add the two fir trees, working up from the house towards their tips. Finish with the sky - at higher piece counts, match the snowflakes that cross from one piece to the next, and use the preview if you get stuck.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this gingerbread house jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 48 pieces for a cheerful, relaxed game. Choose 12 for young children, or 108 or 300 if you want the blue sky to make it harder.',
      },
      {
        q: 'Is this a good Christmas puzzle for kids?',
        a: 'Yes. The bright colours, clear shapes and lack of dark areas make it one of the easiest Christmas puzzles on the site, especially at 12 or 48 pieces.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Where do gingerbread houses come from?',
        a: 'They became popular in Germany in the 1800s, a fashion often linked to the fairy tale of Hansel and Gretel, and later spread around the world as a Christmas tradition.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "christmas jigsaw puzzles", "xmas puzzles online".
    category: 'christmas',
    id: '3584366',
    image: 'https://cdn.pixabay.com/photo/2018/08/04/20/22/nutcracker-3584366_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2018/08/04/20/22/nutcracker-3584366_640.jpg',
    width: 5184,
    height: 3456,
    slug: 'nutcracker-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Nutcracker Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free nutcracker jigsaw puzzle online: a wooden nutcracker king in gold and red against colourful Christmas lights. 12 to 300 pieces, no download.',
    h1: 'Nutcracker Jigsaw Puzzle',
    alt: 'Wooden nutcracker king with a gold crown, white beard and red coat, holding a sceptre, against blurred colourful Christmas lights',
    lead: `A wooden nutcracker king in a gold crown and red coat stares out from a dark background full of glowing, colourful Christmas lights. This free Christmas jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 48,
      why: `48 pieces is ideal: the nutcracker is big and bold, and the coloured lights make the background much easier than plain black would be. Try 108 for a longer game; at 300, the dark spaces between the lights get tricky.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This close-up shows a classic carved wooden nutcracker, painted as a king. He has a golden crown, a fluffy white beard and hair, a painted black moustache, wide blue eyes and a bright red coat with gold trim. In his hand he holds a tall golden sceptre.`,
          `Behind him, the photographer has blurred a string of Christmas lights into big soft circles of pink, red, orange, yellow, green and blue against a black background - the effect photographers call "bokeh". It turns a simple ornament into a glowing Christmas portrait.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The nutcracker stands on the left half of the picture, cut off just below the waist. His crown has a red top with a gold knob, and his white beard spills out on both sides of his face. Look for the open mouth with its row of painted teeth - in a real nutcracker, this is where the nut goes.`,
          `His red coat is decorated with gold stripes and black painted patterns, and a white fur trim runs down the front. The sceptre rises on the left edge, topped with a striped gold finial and a round ball near its base.`,
          `The right half of the picture is almost entirely background: dark, with about two dozen coloured circles of light floating in it.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a wooden nutcracker king with Christmas lights behind',
          'Main colours: red, gold, white, black, with spots of pink, blue, green and yellow',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (5184 × 3456 pixels)',
          'Best piece count: 48 pieces',
          'Good for: Christmas evenings, fans of The Nutcracker ballet, and quick festive breaks',
        ],
      },
      {
        heading: 'Where nutcrackers come from',
        paras: [
          `Carved wooden nutcrackers in the shape of soldiers, kings and policemen come from the Ore Mountains (Erzgebirge) in eastern Germany, a region famous for its wooden toys. Woodworkers there began making them in the 1800s, and the toymaker Wilhelm Füchtner of Seiffen is often credited with producing the first in large numbers, in the 1870s.`,
          `The figures were usually powerful people - kings, soldiers, officials - and there was a joke in it: the mighty were made to do the humble job of cracking nuts for ordinary families. In German folklore, a nutcracker in the home was also said to bring good luck and guard against evil.`,
          `Their link with Christmas grew from E.T.A. Hoffmann's story "The Nutcracker and the Mouse King" (1816) and above all from Tchaikovsky's ballet The Nutcracker, first performed in 1892. Today, nutcrackers stand on mantelpieces and in shop windows all over the world every December.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The nutcracker is large and full of strong colours and shapes - gold crown, white beard, red coat - so it builds quickly and every piece is easy to place.`,
          `The background could have been a hard, solid black, but the coloured lights change that. Each glowing circle crosses several pieces, giving you colour to match where there would otherwise be nothing.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - a very quick puzzle; the nutcracker practically assembles itself.',
          '48 pieces (Medium) - our recommendation. Bold and satisfying, with a background that stays friendly.',
          '108 pieces (Hard) - a longer game where you start to rely on the coloured lights to place the background.',
          '300 pieces (Expert) - a challenge: many background pieces are dark with only part of a light circle on them.',
        ],
      },
      {
        heading: 'How to solve this nutcracker puzzle',
        paras: [
          `Sort first: edges, nutcracker pieces (anything gold, red or white), pieces with a coloured light on them, and plain dark pieces.`,
          `Build the face and crown first - the blue eyes, moustache and gold crown are the most recognisable part of the picture. Then work down through the beard and red coat, and up and down the sceptre on the left.`,
          `For the background, match the light circles: each one is a single colour, so a pink half-circle on one piece will have its other half nearby. Fill the remaining dark pieces last, by shape.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this nutcracker jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 48 pieces for a bold, satisfying game. Choose 12 for a quick break, or 108 or 300 for more of a challenge in the dark background.',
      },
      {
        q: 'Where do nutcrackers come from?',
        a: "Carved wooden nutcrackers come from Germany's Ore Mountains (Erzgebirge), where toymakers began producing them in the 1800s.",
      },
      {
        q: 'Why are nutcrackers a Christmas decoration?',
        a: 'Mainly because of The Nutcracker - E.T.A. Hoffmann\'s 1816 story and Tchaikovsky\'s 1892 ballet, which is performed every Christmas season.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "christmas jigsaw puzzles free", winter puzzles.
    category: 'christmas',
    id: '1882635',
    image: 'https://cdn.pixabay.com/photo/2016/12/04/21/22/snowman-1882635_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2016/12/04/21/22/snowman-1882635_640.jpg',
    width: 4896,
    height: 3264,
    slug: 'snowman-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Snowman Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free snowman jigsaw puzzle online: a little snowman in a red hat and green scarf, with a pine cone and cinnamon sticks. 12 to 300 pieces, no download.',
    h1: 'Snowman Jigsaw Puzzle',
    alt: 'Small snowman figure in a red knitted hat and green scarf holding a star, in sparkling snow beside a pine cone and cinnamon sticks',
    lead: `A little snowman in a red knitted hat and green scarf stands in sparkling snow, holding a star, with a big pine cone behind him and cinnamon sticks at his side. This free Christmas jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 48,
      why: `48 pieces works best here: the snowman, the pine cone and the cinnamon sticks are each easy to recognise. At 108 and above, the large areas of white snow make it noticeably harder.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This cosy winter close-up shows a small snowman ornament - not a real snowman, but a little figure about the size of a hand - set in fresh, glittering snow on a sunny day. He wears a red knitted hat with a white bobble, a green knitted scarf, and has a carrot-orange nose, rosy cheeks and a smile made of black dots.`,
          `Around him, the photographer has arranged a large pine cone and a few cinnamon sticks dusted with snow - two classic Christmas decorations that bring a warm, spicy feel to an otherwise cold scene.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The snowman stands just left of centre. In one arm he holds a brown star-shaped ornament decorated with seeds, and his body is marked with three black buttons. Flecks of snow sit on his hat and shoulders.`,
          `Behind him, a big pine cone fills the top of the picture, its brown scales tipped with white snow. On the right, three or four cinnamon sticks lie in the snow at an angle, with snow caught along their edges.`,
          `The rest of the picture is snow - sparkling white in the foreground, with soft blue shadows towards the top right where the background is out of focus.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a small snowman ornament in the snow',
          'Main colours: white, pale blue, red, green and warm brown',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (4896 × 3264 pixels)',
          'Best piece count: 48 pieces',
          'Good for: winter and Christmas puzzling, children, and anyone who likes a gentle, cosy picture',
        ],
      },
      {
        heading: 'A short history of the snowman',
        paras: [
          `People have almost certainly been building snowmen for as long as there has been snow, but because snowmen melt, they leave very little behind. One of the earliest known pictures of a snowman appears in the margin of a prayer book from around 1380, now kept in the Netherlands.`,
          `In the winter of 1511, the people of Brussels filled their city with more than a hundred snow sculptures during a long freeze - an event remembered as the "Miracle of 1511". Over the following centuries, snowmen moved from street art into children's games, Christmas cards, songs and films.`,
          `Today, a snowman with a carrot nose, a hat and a scarf - just like the little figure in this picture - is one of the best-loved symbols of winter.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The snowman is full of bright, distinct colours - the red hat, green scarf and orange nose stand out sharply against the white snow - so he is easy and satisfying to build.`,
          `The pine cone and cinnamon sticks add warm brown textures that look completely different from the snow, which helps you sort the pieces at a glance.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - quick and gentle, perfect for young children.',
          '48 pieces (Medium) - our recommendation. Every part of the picture is easy to recognise.',
          '108 pieces (Hard) - a longer game where the snow starts to need careful matching.',
          '300 pieces (Expert) - a real challenge: lots of near-white snow pieces to fit by shape and sparkle.',
        ],
      },
      {
        heading: 'How to solve this snowman puzzle',
        paras: [
          `Sort your pieces first: edges, the snowman (red, green, orange and black), pine cone (dark brown scales), cinnamon sticks (reddish brown) and plain snow.`,
          `Build the snowman's face and hat first - the red hat and orange nose are the clearest landmarks in the picture. Then add the scarf, the star and his body.`,
          `Next, build the pine cone above him and the cinnamon sticks on the right. Leave the snow until last, and look for its small differences: the brighter, sparkling snow at the bottom and the bluer, softer snow towards the top right.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this snowman jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 48 pieces for a cosy, relaxed game. Choose 12 for young children, or 108 or 300 if you want the white snow to make it harder.',
      },
      {
        q: 'Is the snowman in the picture real?',
        a: 'No - it is a small snowman ornament, about the size of a hand, photographed in real snow with a pine cone and cinnamon sticks.',
      },
      {
        q: 'Is this a Christmas puzzle or a winter puzzle?',
        a: 'Both. The snowman, pine cone and cinnamon make it a lovely Christmas puzzle, but it suits any snowy winter day just as well.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "christmas jigsaw puzzles free", "xmas puzzles online".
    category: 'christmas',
    id: '7590151',
    image: 'https://cdn.pixabay.com/photo/2022/11/13/20/39/santa-claus-7590151_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2022/11/13/20/39/santa-claus-7590151_640.jpg',
    width: 5867,
    height: 3911,
    slug: 'santa-claus-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Santa Claus Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free Santa Claus jigsaw puzzle online: a Santa snow globe among candles, gold baubles and a pine cone. 12 to 300 pieces, no download or sign-up.',
    h1: 'Santa Claus Jigsaw Puzzle',
    alt: 'Santa Claus snow globe on white artificial snow, surrounded by red candles, gold baubles, a gold bead garland, a pine cone and a white lantern',
    lead: `A tiny Santa Claus waves from inside a snow globe, surrounded by flickering red candles, gold baubles, a string of gold beads and a pine cone, all set on a bed of white snow. This free Christmas jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces is the sweet spot: the picture is packed with small, distinct objects - candles, baubles, beads - so there is always something to match. Choose 48 for a quicker game, or 300 for a long, absorbing one.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This warm Christmas still life is built around a small snow globe. Inside the glass dome sits a cheerful Santa Claus with round glasses, a white beard and a red hat, and below it the globe's base is shaped like Santa's red body with his arms spread wide.`,
          `The photographer has surrounded him with the classic colours of Christmas: candles burning in red holders, shiny gold baubles, a golden bead garland, a pine cone, and a white lantern with another candle glowing inside. Everything sits on fluffy artificial snow, with a red tinsel background sparkling behind.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The snow globe stands in the centre. Above and behind it is a dark red, out-of-focus background of tinsel and lights, with tiny glints of gold.`,
          `On the left, two red candles burn in round holders, with two silver-and-gold glitter baubles above them. On the right stands a white lantern with a red candle inside, and between the globe and the lantern sits a brown pine cone.`,
          `In front, a long garland of gold beads curves across the snow from the bottom left towards the right, and two large gold baubles shine - one on the right and one at the bottom of the picture.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a Santa Claus snow globe with Christmas decorations',
          'Main colours: red, gold, white and warm candlelight',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (5867 × 3911 pixels)',
          'Best piece count: 108 pieces',
          'Good for: Christmas Eve puzzling, families and anyone who loves classic red-and-gold decorations',
        ],
      },
      {
        heading: 'From Saint Nicholas to Santa Claus',
        paras: [
          `Santa Claus grew out of Saint Nicholas, a 4th-century bishop of Myra, in what is now Turkey, who was known for his generosity and for secretly giving gifts. His feast day, 6 December, is still a day of presents in many European countries.`,
          `Dutch settlers brought their "Sinterklaas" to America, where over the 1800s he slowly became Santa Claus. Poems and stories gave him a sleigh, reindeer and a home at the North Pole, and illustrators settled on the image we know today: a round, jolly man with a white beard and a red suit trimmed with white fur.`,
        ],
      },
      {
        heading: 'A short history of snow globes',
        paras: [
          `Snow globes appeared in France in the 19th century and were shown at the Paris Exposition of 1878. Around 1900, the Viennese instrument maker Erwin Perzy began producing them in his workshop - and his family firm still makes snow globes in Vienna today.`,
          `Since then, snow globes have become one of the most popular Christmas keepsakes, and Santa is one of their favourite subjects.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The picture is full of separate objects - each candle, bauble and pine cone has its own shape, colour and shine - so it is easy to tell where most pieces belong. The bead garland curving across the snow works like a path you can follow from piece to piece.`,
          `The warm candlelight and red-and-gold colours make it a lovely, cosy picture to spend time with.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - quick and cheerful; Santa is together in moments.',
          '48 pieces (Medium) - a relaxed game with plenty of colour in every piece.',
          '108 pieces (Hard) - our recommendation. Lots to sort, but every object gives you a clear target.',
          '300 pieces (Expert) - a long, absorbing puzzle; the white snow and red background take real patience.',
        ],
      },
      {
        heading: 'How to solve this Santa Claus puzzle',
        paras: [
          `Sort your pieces into piles: edges, Santa and the snow globe, candles and their flames, gold baubles and beads, the pine cone and lantern, plain snow, and dark red background.`,
          `Start with the snow globe in the middle - Santa's face, glasses and red hat are the clearest part of the picture. Then build the candles on the left and the lantern on the right; the bright flames are easy to spot.`,
          `Follow the gold bead garland across the bottom to place the snow pieces around it, and finish with the dark red background at the top.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this Santa Claus jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game. Choose 12 or 48 for something quicker, or 300 for a long Christmas challenge.',
      },
      {
        q: 'Who was the real Santa Claus?',
        a: 'Santa Claus grew out of Saint Nicholas, a 4th-century bishop known for secret gift-giving, whose feast day is 6 December.',
      },
      {
        q: 'Is this a good puzzle for Christmas Eve?',
        a: 'Yes - its candlelight, red and gold colours and cheerful Santa make it a cosy choice for a Christmas Eve puzzle with the family.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "train jigsaw puzzles", "download free train jigsaw puzzles", "rails puzzle".
    category: 'trains',
    id: '4362166',
    image: 'https://cdn.pixabay.com/photo/2019/07/25/09/38/train-4362166_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2019/07/25/09/38/train-4362166_640.jpg',
    width: 5760,
    height: 3840,
    slug: 'steam-train-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Steam Train Jigsaw Puzzle: Glenfinnan Viaduct | JigsawJam',
    description:
      'Play a free steam train jigsaw puzzle online: the Jacobite crossing the Glenfinnan Viaduct in the Scottish Highlands. 12 to 300 pieces, no download.',
    h1: 'Steam Train Jigsaw Puzzle',
    alt: 'View from a maroon steam train carriage as it curves across the arches of the Glenfinnan Viaduct in the green Scottish Highlands, with steam rising',
    lead: `Lean out of the window of a steam train as it curves across the stone arches of the Glenfinnan Viaduct, deep in the green, misty Scottish Highlands, with a cloud of steam rising ahead. This free train jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces is ideal: the viaduct's arches, the maroon carriages and the white steam each give you a clear area to build. Choose 48 for a quicker game, or 300 if you want the green hillside to really test you.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This photo was taken from a carriage window of the Jacobite, a steam train that runs through the Scottish Highlands, as it crosses the Glenfinnan Viaduct. The train is bending round the viaduct's famous curve, so you can see the carriages ahead, the line of stone arches beneath them, and the steam from the locomotive drifting into the sky.`,
          `It is one of the most famous railway views in the world. The viaduct appears in the Harry Potter films, where the Hogwarts Express crosses it, and thousands of visitors come every year to watch the steam train go over.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The right side of the picture is filled by the side of the carriage you are riding in: deep maroon paintwork and a window that reflects the viaduct's arches. Ahead, the rest of the train - a line of maroon carriages - curves away to the left along the top of the viaduct.`,
          `Below the train, the viaduct's tall, narrow arches march across the valley from left to right. At the bottom left, a small dirt track, a little hut and a patch of grass sit among dark green trees.`,
          `Above it all, a big white cloud of steam rises from the locomotive into a grey, misty sky, and steep green hills fill the background.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: the Jacobite steam train crossing the Glenfinnan Viaduct',
          'Location: Glenfinnan, in the Highlands of Scotland',
          'Main colours: maroon red, stone grey, deep green and white steam',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (5760 × 3840 pixels)',
          'Best piece count: 108 pieces',
          'Good for: train lovers, Scotland fans, film fans and anyone who likes a dramatic landscape',
        ],
      },
      {
        heading: 'About the Glenfinnan Viaduct',
        paras: [
          `The Glenfinnan Viaduct carries the West Highland Line, the railway between Fort William and Mallaig on Scotland's west coast. It was built between 1897 and 1901 by the firm of Robert McAlpine - nicknamed "Concrete Bob" - and was one of the first big structures in the world made of mass concrete instead of stone or brick.`,
          `It has 21 arches, stretches about 380 metres (1,248 feet) and stands around 30 metres (100 feet) above the valley at its highest point. Its gentle curve is what makes this photo possible: from a carriage window, you can look forward and see the train you are riding on.`,
          `The viaduct overlooks Loch Shiel and the Glenfinnan Monument, which marks the spot where Bonnie Prince Charlie raised his standard in 1745 at the start of the Jacobite rising - the event the Jacobite train is named after.`,
        ],
      },
      {
        heading: 'About the Jacobite steam train',
        paras: [
          `The Jacobite runs between Fort William and Mallaig, a journey of about 42 miles (68 km) each way through some of the finest scenery in Britain - past Ben Nevis, across the viaduct and along the coast to the fishing port of Mallaig. It usually runs from spring to autumn, and its departures are some of the most popular steam train rides anywhere.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The photo has strong lines that guide you: the curve of the train, the row of arches and the edge of the viaduct all cut across many pieces, so they link the puzzle together.`,
          `Each part of the picture also has its own look - shiny maroon carriage, grey concrete arches, soft white steam and green hills - which makes sorting quick.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - a quick way to enjoy the view.',
          '48 pieces (Medium) - a relaxed game where the train and viaduct come together nicely.',
          '108 pieces (Hard) - our recommendation. The arches and curves give you plenty to work with.',
          '300 pieces (Expert) - a real challenge: the misty hills and trees break into many similar green pieces.',
        ],
      },
      {
        heading: 'How to solve this steam train puzzle',
        paras: [
          `Sort first: edges, maroon carriage, viaduct arches (grey), steam and sky (white and pale grey), and green hills and trees.`,
          `Start with the big carriage on the right - the maroon paint is unmistakable - then follow the line of carriages along the curve to the left.`,
          `Next build the arches under the train; each arch has the same shape, so use the light and shadow inside each one to tell them apart. Finish with the steam, the sky and the green hillside.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this steam train jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game. Choose 12 or 48 for something quicker, or 300 for a long challenge in the green hills.',
      },
      {
        q: 'Where was this photo taken?',
        a: 'On the Glenfinnan Viaduct in the Scottish Highlands, from a carriage of the Jacobite steam train between Fort William and Mallaig.',
      },
      {
        q: 'Is this the Harry Potter train bridge?',
        a: 'Yes. The Glenfinnan Viaduct is the bridge the Hogwarts Express crosses in the Harry Potter films.',
      },
      {
        q: 'Can I download this train jigsaw puzzle?',
        a: 'There is nothing to download - the puzzle plays instantly in your web browser on a phone, tablet or computer.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "dog jigsaw puzzles online".
    category: 'dogs',
    id: '7991199',
    image: 'https://cdn.pixabay.com/photo/2023/05/13/19/20/dog-7991199_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2023/05/13/19/20/dog-7991199_640.jpg',
    width: 6016,
    height: 4016,
    slug: 'dog-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Dog Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free dog jigsaw puzzle online: a fluffy, smiling Eurasier dog among purple wildflowers in a summer meadow. 12 to 300 pieces, no download or sign-up.',
    h1: 'Dog Jigsaw Puzzle',
    alt: 'Fluffy cream and grey Eurasier dog with its tongue out, smiling among purple wildflowers in a green summer meadow',
    lead: `A fluffy Eurasier dog smiles at the camera with its tongue out, surrounded by purple wildflowers in a summer meadow. This free dog jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces is the sweet spot: the dog's face gives you a strong centre to build from, and the purple flowers break up the meadow. Pick 48 for a gentle game, or 300 if you want the fur and grass to keep you busy for a while.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This happy portrait shows a Eurasier, a fluffy, medium-sized dog breed, standing in a summer meadow full of purple wildflowers. Its thick coat is cream and pale gold around the face, fading to grey and darker tips on its ears and body. Its mouth is open in a relaxed smile, with its tongue hanging out.`,
          `The photographer took the picture at the dog's eye level, with flowers in front and behind, so the dog seems to be looking right at you from the middle of the meadow.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The dog's head and chest fill the centre of the picture. Look for its dark eyes, black nose, short pointed ears with dark tips, and its long pink-and-lilac tongue.`,
          `On both sides, tall green stems rise up with curled purple flower heads at their tips - more on the right than on the left. Smaller flowers and green leaves fill the bottom of the picture.`,
          `Behind the dog, the meadow fades into a soft blur of green grass and trees, under a pale, cloudy sky.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a Eurasier dog in a meadow of purple wildflowers',
          'Main colours: cream, gold and grey fur, purple flowers, green meadow and a pale sky',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (6016 × 4016 pixels)',
          'Best piece count: 108 pieces',
          'Good for: dog lovers, nature lovers, families and a relaxing afternoon',
        ],
      },
      {
        heading: 'About the Eurasier',
        paras: [
          `The Eurasier is a young breed. It was created in Germany in 1960 by Julius Wipfel, who wanted a calm, friendly family dog. He crossed the German Wolfspitz with the Chow Chow, and later added the Samoyed. The breed was officially recognised in 1973.`,
          `Eurasiers are known for being gentle, loyal and quiet - they bond closely with their family and are usually calm and reserved with strangers. Their thick double coat comes in many colours, from cream and red to wolf-grey and black.`,
          `One unusual trait comes from their Chow Chow ancestors: a Eurasier's tongue can be pink, blue-black or spotted - and the dog in this picture has a pink tongue with a lilac tint.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The dog's face is a clear, friendly centre point: eyes, nose and tongue are easy to spot, and the fur around them changes colour gradually from cream to grey, which helps you place each piece.`,
          `The purple flowers scattered through the meadow act like landmarks, so even the green parts of the picture have something to match.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - a quick, happy puzzle for young dog lovers.',
          '48 pieces (Medium) - relaxed and satisfying; the dog comes together fast.',
          '108 pieces (Hard) - our recommendation. Plenty to do, with the flowers keeping the background interesting.',
          '300 pieces (Expert) - a long challenge: soft fur and blurred meadow make many pieces look alike.',
        ],
      },
      {
        heading: 'How to solve this dog puzzle',
        paras: [
          `Sort first: edges, dog (cream, gold and grey fur), purple flowers, green meadow, and pale sky.`,
          `Build the dog's face first - start with the black nose and pink tongue, then add the eyes and ears. Work outwards through the fur, watching how it changes from cream around the face to grey on the body.`,
          `Next, add the purple flowers on each side of the dog, then fill in the green meadow and finally the pale sky along the top.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this dog jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game. Choose 12 or 48 for something quicker, or 300 for a long challenge.',
      },
      {
        q: 'What breed is the dog in the picture?',
        a: 'It is a Eurasier, a calm, fluffy family dog breed created in Germany in 1960 from the Wolfspitz, the Chow Chow and the Samoyed.',
      },
      {
        q: 'Is this a good puzzle for children?',
        a: 'Yes. At 12 or 48 pieces, the friendly dog and bright flowers make it an easy, happy puzzle for kids.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "aquarium puzzle", "aquarium puzzles".
    category: 'fish',
    id: '5975834',
    image: 'https://cdn.pixabay.com/photo/2021/02/02/23/18/fish-5975834_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2021/02/02/23/18/fish-5975834_640.jpg',
    width: 4000,
    height: 2249,
    slug: 'clownfish-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Clownfish Jigsaw Puzzle - Free Aquarium Puzzle | JigsawJam',
    description:
      'Play a free clownfish jigsaw puzzle online: a bright orange clownfish swimming over a colourful reef in an aquarium. 12 to 300 pieces, no download.',
    h1: 'Clownfish Jigsaw Puzzle',
    alt: 'Orange clownfish with white black-edged stripes swimming above a pink, purple and green coral reef in an aquarium',
    lead: `A bright orange clownfish with bold white stripes swims over a bumpy reef of pink, purple and green coral in an aquarium. This free aquarium jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces suits this picture well: the clownfish is unmistakable, and the reef is full of texture and colour to match. Choose 48 for a quick game, or 300 if you want the reef to become a proper challenge.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This underwater close-up shows a clownfish in a reef aquarium. Its body is a vivid orange, crossed by three white bands, each outlined in black, and its fins are tipped with black too. It is swimming just above a carpet of coral covered in tiny rounded bumps in shades of pink, mauve and green.`,
          `The background fades into a dim, purple-blue blur, which makes the bright fish and the colourful reef stand out even more.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The clownfish swims across the upper part of the picture, curving from its tail on the left up to its head at the top right. Count its three white bands - one behind the head, one across the middle and one near the tail - each edged in black, and look for the orange fin tucked under its head.`,
          `Below and to the right, the reef fills most of the picture: rounded mounds covered in short, knobbly polyps, mostly pink and mauve with bright green centres. A few paler, lighter-green clusters sit near the bottom.`,
          `The top and left edges are soft and out of focus - deep purple and blue water with blurred rocks.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: a clownfish swimming over a coral reef in an aquarium',
          'Main colours: bright orange, white and black, pink, mauve, green and deep purple',
          'Shape: wide landscape (16:9)',
          'Photo quality: high resolution (4000 × 2249 pixels)',
          'Best piece count: 108 pieces',
          'Good for: aquarium and ocean lovers, children, and fans of colourful puzzles',
        ],
      },
      {
        heading: 'About clownfish',
        paras: [
          `Clownfish (also called anemonefish) live in the warm waters of the Indian and Pacific Oceans. They are famous for living among sea anemones, whose stinging tentacles would harm most fish. A special coat of mucus protects the clownfish, so it can shelter among the tentacles safely - and in return it helps keep the anemone clean and chases away fish that might eat it.`,
          `Clownfish have an unusual life story: they are all born male. Each group has one large female at its head, and if she dies, the largest male changes into a female to take her place.`,
          `They became one of the most famous fish in the world after the 2003 animated film Finding Nemo, and today they are among the most popular fish for home aquariums. Most clownfish sold for aquariums are now bred in captivity rather than taken from the wild.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The clownfish is one of the boldest shapes you will find in any puzzle: bright orange, cleanly divided by white and black stripes. It is easy to build and lovely to see come together.`,
          `The reef is full of small textures and changes of colour - pink here, green there - so even the busy parts of the picture give you plenty of clues.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - quick and colourful, ideal for young children.',
          '48 pieces (Medium) - a relaxed game where the fish and reef come together quickly.',
          '108 pieces (Hard) - our recommendation. The reef keeps it interesting without becoming frustrating.',
          '300 pieces (Expert) - a real challenge: the knobbly reef repeats across many pieces.',
        ],
      },
      {
        heading: 'How to solve this clownfish puzzle',
        paras: [
          `Sort first: edges, clownfish (orange, white and black), pink and mauve reef, green reef, and dark purple-blue background.`,
          `Build the clownfish first - follow the white stripes from head to tail. Then work down into the reef directly below it.`,
          `Use colour to place the reef: the pink and mauve mounds sit mostly in the middle and right, the paler green clusters near the bottom. Finish with the dark, blurred background along the top and left.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this clownfish jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game. Choose 12 or 48 for something quicker, or 300 for a real challenge in the reef.',
      },
      {
        q: 'Was this photo taken in an aquarium?',
        a: 'Yes. It shows a clownfish in a reef aquarium, swimming over coral.',
      },
      {
        q: 'Why do clownfish live in sea anemones?',
        a: 'A coat of mucus protects them from the anemone\'s stings, so the anemone gives them a safe home, and in return they keep it clean and chase away predators.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "castle jigsaw puzzles".
    category: 'castles',
    id: '532850',
    image: 'https://cdn.pixabay.com/photo/2014/11/15/23/29/fairytale-532850_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2014/11/15/23/29/fairytale-532850_640.jpg',
    width: 5616,
    height: 3744,
    slug: 'neuschwanstein-castle-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Neuschwanstein Castle Jigsaw Puzzle - Free Online | JigsawJam',
    description:
      "Play a free Neuschwanstein Castle jigsaw puzzle online: Bavaria's fairytale castle above green forest and blue lakes. 12 to 300 pieces, no download.",
    h1: 'Neuschwanstein Castle Jigsaw Puzzle',
    alt: 'Neuschwanstein Castle in Bavaria, white towers and grey roofs rising above green forest, with lakes and farmland under a blue sky behind',
    lead: `Neuschwanstein Castle rises above a forested crag in Bavaria, its white towers and grey slate roofs set against a bright blue sky, with lakes and farmland stretching away behind. This free castle jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces is the sweet spot: the castle's towers and windows give you lots of detail to work with, and the sky and forest stay manageable. Choose 300 for a classic, long castle puzzle.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `Neuschwanstein Castle is one of the most famous castles in the world, and this photo shows why. Seen from the side on a clear summer day, it seems to grow straight out of the rocks and trees beneath it, with its pale stone walls, pointed towers and steep roofs looking just like a castle from a fairy tale.`,
          `Behind it, the land opens out into the foothills of the Alps: blue lakes, green fields and small villages, all under a wide blue sky with a few white clouds.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The castle fills the middle of the picture. On the left stands its tallest part, with a slender pointed spire, and behind it the long main building with rows of arched windows under a dark grey roof. On the right, a round tower with a battlemented top rises above the trees.`,
          `Below, the castle stands on a rocky crag covered in dense green forest, which fills the whole bottom third of the picture. A thin waterfall-like streak of pale rock shows through the trees beneath the castle.`,
          `Behind the castle, on both sides, you can see blue lakes, flat green farmland and the red roofs of a village, fading towards hills on the horizon. The top of the picture is a clear blue sky with a few wispy clouds.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: Neuschwanstein Castle on a sunny summer day',
          'Location: near Füssen, Bavaria, in southern Germany',
          'Main colours: white and pale stone, slate grey, forest green and sky blue',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (5616 × 3744 pixels)',
          'Best piece count: 108 pieces',
          'Good for: castle lovers, travellers, history fans and classic landscape puzzlers',
        ],
      },
      {
        heading: 'The story of Neuschwanstein',
        paras: [
          `Neuschwanstein was built for King Ludwig II of Bavaria, a shy, romantic king who loved medieval legends and the operas of Richard Wagner. Work began in 1869 on a crag above the village of Hohenschwangau, close to the castle where Ludwig had grown up.`,
          `It was never a fortress: Ludwig wanted a private retreat that looked like a knight's castle from a story, filled with paintings of the legends he loved. He lived there for only a few months before his death in 1886, and the castle was never fully finished. Just weeks after he died, it was opened to the public.`,
          `Today Neuschwanstein is one of the most visited sights in Europe, welcoming more than a million people a year. It is often said to have inspired the castle in Disney's Sleeping Beauty.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `A castle is a classic jigsaw subject, and this one is ideal: the pale walls stand out sharply against the dark forest and the blue sky, so the edges between them are easy to find.`,
          `The castle is full of small details - windows, turrets, roof lines - that make each piece unique, and the distant lakes and fields add a band of extra colour across the middle.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - a quick way to build the famous castle.',
          '48 pieces (Medium) - relaxed, with the castle coming together nicely.',
          '108 pieces (Hard) - our recommendation. Plenty of detail to enjoy without too much plain sky.',
          '300 pieces (Expert) - a classic long castle puzzle; the forest and sky take patience.',
        ],
      },
      {
        heading: 'How to solve this castle puzzle',
        paras: [
          `Sort first: edges, castle (white stone and grey roofs), forest (dark green), lakes and fields (blue, light green and red roofs), and sky.`,
          `Build the castle first. Start with the tall spire on the left and the round tower on the right, then fill in the main building between them using the rows of windows.`,
          `Next, add the band of lakes and fields behind the castle, then the forest below. Finish with the sky - look for the faint white clouds, and notice how the blue gets lighter towards the horizon.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this Neuschwanstein Castle jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a satisfying game, or 300 for a classic, long castle puzzle. Choose 12 or 48 for something quicker.',
      },
      {
        q: 'Where is Neuschwanstein Castle?',
        a: 'In Bavaria, in southern Germany, above the village of Hohenschwangau near the town of Füssen, close to the Austrian border.',
      },
      {
        q: 'Who built Neuschwanstein Castle?',
        a: 'King Ludwig II of Bavaria, who began building it in 1869 as a romantic private retreat. It was never fully finished.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },

  {
    // Query: "flower jigsaw puzzles".
    category: 'flowers',
    id: '1719119',
    image: 'https://cdn.pixabay.com/photo/2016/10/06/14/07/sunflowers-1719119_1280.jpg',
    thumb: 'https://cdn.pixabay.com/photo/2016/10/06/14/07/sunflowers-1719119_640.jpg',
    width: 5276,
    height: 3517,
    slug: 'sunflower-jigsaw-puzzle',
    published: '2026-11-19',
    updated: '2026-11-19',
    title: 'Sunflower Jigsaw Puzzle - Play Free Online | JigsawJam',
    description:
      'Play a free sunflower jigsaw puzzle online: a bunch of sunflowers in a white jug on a picnic basket in a golden meadow. 12 to 300 pieces, no download.',
    h1: 'Sunflower Jigsaw Puzzle',
    alt: 'Bunch of yellow sunflowers in a white jug on a cloth-covered wicker picnic basket, in a sunlit meadow of wild grasses',
    lead: `A bunch of bright yellow sunflowers stands in a white jug on a wicker picnic basket, glowing in warm sunlight in the middle of a wild meadow. This free flower jigsaw puzzle plays right in your browser: choose 12, 48, 108 or 300 pieces and start - no download, no sign-up.`,
    recommended: {
      pieces: 108,
      why: `108 pieces is ideal: the sunflowers, jug and basket are easy to build, and the soft meadow around them gives you a pleasant, gentle challenge. Pick 48 for a relaxed game or 300 for a long, peaceful one.`,
    },
    sections: [
      {
        heading: 'About this picture',
        paras: [
          `This summery still life shows a bunch of sunflowers arranged in a cream-white jug, standing on a wicker picnic basket draped with a white cloth. It has been set down in the middle of a wild meadow, as if someone had just stopped for a picnic.`,
          `Golden sunlight streams in from the top left, giving the whole picture a warm, hazy glow and lighting up the grasses and leaves around the basket in shades of green, red and purple.`,
        ],
      },
      {
        heading: "What's in the picture",
        paras: [
          `The sunflowers sit in the upper middle of the picture - about half a dozen large blooms with dark brown centres and bright yellow petals, some facing you and some turned to the side.`,
          `Below them, the white jug has two little handles and stands on a white cloth with a few fallen yellow petals lying on it. The cloth covers a brown wicker picnic basket, and you can see its woven sides and one curved handle at the front.`,
          `All around, the meadow is a soft blur of wild grasses and plants: green leaves, reddish stems and touches of purple, with bright sunlight glowing through the top left corner.`,
        ],
      },
      {
        heading: 'This puzzle at a glance',
        items: [
          'Subject: sunflowers in a white jug on a picnic basket in a meadow',
          'Main colours: sunflower yellow, dark brown, cream white, wicker brown and soft green',
          'Shape: landscape (wider than it is tall, 3:2)',
          'Photo quality: high resolution (5276 × 3517 pixels)',
          'Best piece count: 108 pieces',
          'Good for: flower lovers, seniors, and anyone who wants a calm, sunny puzzle',
        ],
      },
      {
        heading: 'About sunflowers',
        paras: [
          `Sunflowers come from North America, where Native American peoples were growing them for food, oil and dye thousands of years ago. Spanish explorers brought them to Europe in the 1500s, and today they are grown all over the world.`,
          `What looks like one big flower is actually hundreds of tiny flowers, called florets, packed together. The florets in the centre are arranged in two sets of spirals turning in opposite directions - a pattern that follows the famous Fibonacci sequence and lets the flower pack in as many seeds as possible.`,
          `Young sunflowers turn to follow the sun across the sky during the day. Once they bloom, most settle facing east, towards the morning sun. Vincent van Gogh painted a famous series of sunflowers in a vase in Arles, in the south of France, in 1888 and 1889.`,
        ],
      },
      {
        heading: 'Why this picture makes a good jigsaw puzzle',
        paras: [
          `The sunflowers' bright yellow petals and dark centres make them very easy to spot, and the white jug and cloth stand out clearly from the meadow, giving you a strong shape in the middle to build around.`,
          `The meadow around it is soft and gentle rather than busy, with patches of colour - red stems, purple flowers, golden light - that help you place the pieces without making the puzzle stressful.`,
        ],
      },
      {
        heading: 'Choosing your piece count',
        items: [
          '12 pieces (Easy) - quick and cheerful.',
          '48 pieces (Medium) - a relaxed game; the flowers and basket come together fast.',
          '108 pieces (Hard) - our recommendation. A pleasant, calm challenge with plenty of colour.',
          '300 pieces (Expert) - a long, peaceful puzzle; the soft meadow needs patience.',
        ],
      },
      {
        heading: 'How to solve this sunflower puzzle',
        paras: [
          `Sort first: edges, sunflowers (yellow and dark brown), jug and cloth (white and cream), basket (wicker brown), and meadow (greens, reds and purples).`,
          `Start with the sunflowers - each bloom is a little puzzle of its own, with petals around a dark centre. Then build the white jug beneath them and the cloth and basket below.`,
          `Finish with the meadow. Use the light to guide you: the top left is bright and golden, while the bottom and right are darker and greener.`,
        ],
      },
    ],
    faq: [
      {
        q: 'Is this sunflower jigsaw puzzle free?',
        a: 'Yes. It is completely free to play online - no login, no app and nothing to download.',
      },
      {
        q: 'How many pieces should I choose?',
        a: 'Try 108 pieces for a calm, satisfying game. Choose 12 or 48 for something quicker, or 300 for a long, peaceful puzzle.',
      },
      {
        q: 'Is this a good puzzle for seniors?',
        a: 'Yes. The bright, clear sunflowers and gentle meadow make it a relaxing choice, especially at 48 or 108 pieces.',
      },
      {
        q: 'Where do sunflowers come from?',
        a: 'Sunflowers are native to North America, where they were grown by Native American peoples thousands of years ago.',
      },
      {
        q: 'Can I play it on a phone or tablet?',
        a: 'Yes. The puzzle runs in your web browser, so it works on phones, tablets and computers.',
      },
      {
        q: 'Is there a way to make it easier?',
        a: 'Yes. Choose fewer pieces, or turn on the preview while you play to see a faint copy of the finished picture under the pieces.',
      },
    ],
  },
]

/** Pages every hand-written puzzle page links to, besides the other puzzles. */
export const FEATURED_LINKS = [
  { href: '/', label: 'Free online jigsaw puzzles' },
  { href: '/jigsaw-puzzles-for-seniors', label: 'Jigsaw puzzles for seniors' },
  { href: '/create-a-custom-jigsaw-puzzle', label: 'Make a jigsaw puzzle from your own photo' },
]

/**
 * One-line card summary, taken from the meta description
 * ("... online: <summary>. 12 to 300 pieces ...").
 */
export function featuredBlurb(f) {
  const m = f.description.match(/: (.+?)\. 12 to 300/)
  if (!m) return f.description
  return m[1].charAt(0).toUpperCase() + m[1].slice(1) + '.'
}

/** Site path of a featured puzzle page, e.g. "/christmas/christmas-market-jigsaw-puzzle". */
export function featuredPath(f) {
  return `/${f.category}/${f.slug}`
}

/** The featured puzzle at a site path, if any. */
export function featuredByPath(path) {
  const clean = String(path).replace(/\/+$/, '')
  return FEATURED_PUZZLES.find((f) => featuredPath(f) === clean)
}

/**
 * The featured puzzle for a catalogue photo, if any. Matched on the photo id
 * alone: a photo can sit in several categories (the dog is also in "funny"),
 * and every copy should lead to the one hand-written page.
 */
export function featuredFor(_category, id) {
  return FEATURED_PUZZLES.find((f) => f.id === String(id))
}
