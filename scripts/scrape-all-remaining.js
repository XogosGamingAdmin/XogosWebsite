/**
 * Scrape ALL Remaining Blog Posts from Xogos Gaming Wix Site
 * This script handles Colonial America, Age of Exploration, Ancient Africa,
 * Indus Valley, Ancient America, Industrial Revolution, Ancient China,
 * Ancient Rome, Civil War, Lesson Plans, and Creator's Notes
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Categorized posts
const postCategories = {
  'colonial-america': [
    '1-heroes-and-villains-of-colonial-life-in-the-americas-the-establishment-of-the-virginia-colony',
    '2-heroes-and-villains-of-colonial-life-in-the-americas-the-establishment-of-the-massachusetts-bay',
    '3-heroes-and-villains-of-colonial-life-in-the-america-maryland-and-the-refuge-for-catholics',
    '4-heroes-and-villains-of-colonial-life-in-the-americas-maryland-and-the-refuge-for-catholics',
    '5-heroes-and-villains-of-colonial-life-in-the-americas-spanish-settling-florida',
    '6-heroes-and-villains-of-colonial-life-in-the-americas-the-spanish-conquest-of-the-southwest-of-no',
    '7-heroes-and-villains-of-colonial-life-in-the-americas-spanish-exploration-and-settling-of-califor',
    '8-heroes-and-villains-of-colonial-life-in-the-americas-spanish-creation-of-mexico-city-new-spain',
    '9-heroes-and-villains-of-colonial-life-in-the-americas-the-finding-and-settlement-of-brazil-and-ca',
    '10-heroes-and-villains-of-colonial-life-in-the-americas-the-founding-and-establishment-of-rio-de-j',
    '11-heroes-and-villains-of-colonial-life-in-the-americas-the-establishment-of-new-sweden',
    '11-heroes-and-villains-of-colonial-life-in-the-americas-the-settlement-of-new-amsterdam-by-the-du',
    '13-heroes-and-villains-of-colonial-life-in-the-americas-the-settlement-of-russian-alaska',
    '13-heroes-and-villains-of-colonial-life-in-the-americas-other-important-dutch-settlements-moveme',
    '15-heroes-and-villains-of-colonial-life-in-the-americas-the-settlement-of-fort-ross-california',
    '16-heroes-and-villains-of-colonial-life-in-the-americas-quebec-city-and-montreal-by-the-french',
    '17-heroes-and-villains-of-colonial-life-in-the-americas-settlement-and-colonial-new-orleans',
    '18-heroes-and-villains-of-colonial-life-in-the-americas-the-settlement-of-st-louis',
    '19-heroes-and-villains-of-colonial-life-in-the-americas-the-settling-of-the-caribbean-and-south-am',
  ],
  'age-of-exploration': [
    '1-heroes-and-villains-of-the-age-of-exploration-the-norse-expedition-to-the-americas',
    '2-heroes-and-villains-of-the-age-of-exploration-early-european-exploration',
    '3-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-christopher-columbus-part-1',
    '4-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-christopher-columbus-part-2',
    '5-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-amerigo-vespucci',
    '5-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-john-cabot',
    '7-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-pedro-álvares-cabral',
    '8-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-juan-ponce-de-león',
    '9-heroes-and-villains-of-the-age-of-exploration-the-transatlantic-slave-trade',
    '10-heroes-and-villains-of-the-age-of-exploration-the-journey-of-ferdinand-magellan',
    '11-heroes-and-villains-of-the-age-of-exploration-the-journey-of-hernan-cortés-and-the-fall-of-the',
    '12-heroes-and-villains-of-the-age-of-exploration-the-conquest-of-the-mayan-civilization',
    '13-heroes-and-villains-of-the-age-of-exploration-the-journey-of-francisco-pizarro',
    '14-heroes-and-villains-of-the-age-of-exploration-the-british-colonial-ambitions',
    '15-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-sir-francis-drake',
    '16-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-sir-walter-raleign',
    '17-heroes-and-villains-of-the-age-of-exploration-the-jamestown-settlement',
    '18-heroes-and-villains-of-the-age-of-exploration-the-journey-and-fate-of-henry-hudson',
    '19-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-giovanni-da-verrazzano',
    '20-heroes-and-villains-of-the-age-of-exploration-the-journey-of-samuel-de-champlain',
    '20-heroes-and-villains-of-the-age-of-exploration-the-journeys-of-jacques-cartier',
  ],
  'ancient-africa': [
    '1-heroes-and-villains-of-ancient-africa-the-paleolithic-era-c-300-000-bc-c-10-000-bc',
    '2-heroes-and-villains-of-ancient-africa-the-mesolithic-era-c-10-000-bc-c-8-000-bc',
    '3-heroes-and-villains-of-ancient-africa-the-neolithic-era-c-8-000-bc-c-4-000-bc',
    '4-heroes-and-villains-of-ancient-africa-the-chalcolithic-era-c-4-000-bc-c-3-000-bc',
    '6-heroes-and-villains-of-ancient-africa-the-green-sahara-and-early-human-settlements',
    '7-heroes-and-villains-of-ancient-africa-the-domestication-of-plants-and-animals',
    '7-heroes-and-villains-of-ancient-africa-the-desertification-of-the-sahara-and-migration',
    '8-heroes-and-villains-of-ancient-africa-the-development-of-complex-societies-in-sub-saharan-africa',
    '9-heroes-and-villains-of-ancient-africa-the-san-hunter-and-gather-bushmen-culture',
    '10-heroes-and-villains-of-ancient-africa-the-nok-and-bantu-cultures',
    '11-heroes-and-villains-of-ancient-africa-the-niger-river-culture-from-ancient-times-to-islamic-er',
    '12-heroes-and-villains-of-ancient-africa-the-ghana-empire-the-islamic-transition',
    '13-heroes-and-villains-of-ancient-africa-the-songhai-empire',
    '14-heroes-and-villains-of-ancient-africa-formation-early-development-of-swahili-city-states-700',
    '15-heroes-and-villains-of-ancient-africa-the-golden-age-of-swahili-city-states-c-1-000-ad-1-30',
    '16-heroes-and-villains-of-ancient-africa-the-civilization-of-the-great-zimbabwe',
    '17-heroes-and-villains-of-ancient-africa-the-era-of-cultural-flourishing-and-early-christian-kingd',
  ],
  'indus-valley': [
    '1-heroes-and-villains-of-the-indus-valley-foundation-of-the-indus-valley',
    '2-heroes-and-villains-of-the-indus-valley-neolithic-and-early-settlements-e-g-mehrgarh',
    '3-heroes-and-villains-of-the-indus-valley-the-early-indus-valley-civilization',
    '4-heroes-and-villains-of-the-indus-valley-the-late-harappan-period-and-early-vedic-age-1900-15',
    '5-heroes-and-villains-of-the-indus-valley-hinduism-in-the-ancient-world',
    '5-heroes-and-villains-of-the-indus-valley-indo-aryan-migration-during-the-1500-1000bc',
    '6-heroes-and-villains-of-the-indus-valley-the-late-vedic-period-and-the-rise-of-kingdoms',
    '6-heroes-and-villains-of-the-indus-valley-buddhism-in-the-ancient-world',
    '7-heroes-and-villains-of-the-indus-valley-jainism-in-ancient-india',
    '11-heroes-and-villains-of-the-indus-valley-mahajanapadas-and-the-second-urbanization-600-300-bc',
    '11-heroes-and-villains-of-the-indus-valley-the-art-and-architecture-of-hinduism-buddhism-and-ja',
    '12-heroes-and-villains-of-the-indus-valley-alexander-the-great-invades-northwest-india',
    '13-heroes-and-villains-of-the-indus-valley-mauryan-empire-and-those-who-founded-and-expanded-it',
    '14-heroes-and-villains-of-the-indus-valley-ashoka-the-great-who-was-the-man-ruler-and-believer',
    '15-heroes-and-villains-of-the-indus-valley-gupta-empire-and-the-golden-age-of-india',
    '16-heroes-and-villains-of-the-indus-valley-the-legacy-of-ancient-india-and-southern-asia',
  ],
  'ancient-america': [
    '1-heroes-and-villains-of-ancient-america-the-paleo-indian-culture-tribes-and-history',
    '2-heroes-and-villains-of-ancient-america-the-arctic-culture-in-north-america',
    '4-heroes-and-villains-of-the-ancient-america-northwest-coast-cultures',
    '5-heroes-and-villains-of-the-ancient-america-northwest-coast-cult',
    '6-heroes-and-villains-of-the-ancient-america-the-poverty-point-culture',
    '7-heroes-and-villains-of-the-ancient-america-the-olmec-civilization',
    '8-heroes-and-villains-of-the-ancient-america-the-mayan-civilization',
    '9-heroes-and-villains-of-the-ancient-america-the-aztec-civilization-historical-figures',
    '10-heroes-and-villains-of-the-ancient-america-interaction-between-the-olmecs-mayan-aztec-outsi',
    '11-heroes-and-villains-of-the-ancient-america-the-inca-civilization-part-1',
    '12-heroes-and-villains-of-the-ancient-america-the-inca-civilization-part-2',
    '13-heroes-and-villains-of-the-ancient-america-the-tribes-civilizations-and-culture-of-eastern-s',
    '14-heroes-and-villains-of-the-ancient-america-the-mapuche-civilization',
    '15-heroes-and-villains-of-the-ancient-america-the-caribbean-tribes-and-cultures-part-1',
    '16-heroes-and-villains-of-the-ancient-america-the-caribbean-tribes-and-cultures-part-2',
  ],
  'industrial-revolution': [
    '1-heroes-and-villains-of-the-industrial-revolution-pre-industrial-society-agrarian-economy-cot',
    '2-heroes-and-villains-of-the-industrial-revolution-causes-of-the-industrial-revolution',
    '3-heroes-and-villains-of-the-industrial-revolution-early-industrial-centers-and-factories-urban',
    '4-heroes-and-villains-of-the-industrial-revolution-expansion-globalization-1750-1790-in-the-i',
    '5-heroes-and-villains-of-the-industrial-revolution-capitalism-and-the-greatest-inventors',
    '6-heroes-and-villains-of-the-industrial-revolution-stream-engine-trains-and-steam-boats',
    '7-heroes-and-villains-of-the-industrial-revolution-the-first-factories-in-america',
    '8-heroes-and-villains-of-the-industrial-revolution-the-communication-revolution',
    '9-heroes-and-villains-of-the-industrial-revolution-the-transportation-revolution',
    '10-heroes-and-villains-of-the-industrial-revolution-textile-industry-growth-the-rise-of-the-cott',
    '11-heroes-and-villains-of-the-industrial-revolution-the-oil-wars',
    '12-heroes-and-villains-of-the-industrial-revolution-the-food-and-medicine-wars',
    '13-heroes-and-villains-of-the-industrial-revolution-the-energy-wars',
    '14-heroes-and-villains-of-the-industrial-revolution-labor-unions-workers-rights',
    '15-heroes-and-villains-of-the-industrial-revolution-socialism-capitalism-marxism-utopian-soci',
    '16-heroes-and-villains-of-the-industrial-revolution-education-health-immigration-and-the-middle',
    '17-heroes-and-villains-of-the-industrial-revolution-the-political-the-industrial-presidents-and',
  ],
  'ancient-china': [
    '5-heroes-and-villians-of-ancient-china-the-spring-and-autumn-period',
    '6-heroes-and-villians-of-ancient-china-confucius-and-confucianism',
    '7-heroes-and-villians-of-ancient-china-daoism-and-laozi',
    '8-heroes-and-villians-of-ancient-china-legalism-xunzi-and-han-feizi',
    '9-heroes-and-villians-of-ancient-china-the-warring-period-of-ancient-china',
    '10-heroes-and-villians-of-ancient-china-the-qin-dynasty-of-ancient-china',
    '12-heroes-and-villians-of-ancient-china-the-innovations-of-the-han-dynasty',
    '13-heroes-and-villians-of-ancient-china-end-of-the-han-and-the-classical-era-of-china-and-its-leg',
    '14-heroes-and-villians-of-ancient-china-the-people-and-culture-under-the-han-dynasty',
    '14-heroes-and-villians-of-ancient-china-the-religions-of-the-han-dynasty',
  ],
  'ancient-rome': [
    'the-heroes-and-villians-series-ancient-rome-the-founding-of-rome',
    'the-heroes-and-villians-series-ancient-rome-the-roman-civil-wars',
    'the-heroes-and-villians-series-ancient-rome-the-rise-of-augustus',
    'the-heroes-and-villians-series-ancient-rome-the-punic-wars',
    'the-heroes-and-villians-series-ancient-rome-the-first-triumvirate',
    'the-heroes-and-villians-series-ancient-rome-the-second-triumvirate',
    'the-heroes-and-villians-series-ancient-rome-the-pax-romana-27-bc-ad-180',
    'the-heroes-and-villians-series-ancient-rome-how-power-and-corruption-destroyed-the-roman-republi',
    'the-heroes-and-villians-series-ancient-rome-the-founding-of-the-catholic-church-and-the-first-po',
  ],
  'civil-war': [
    'the-heroes-and-villians-series-civil-war-the-election-of-1864',
    'the-heroes-and-villians-series-civil-war-overland-campaign-the-battles-between-grant-and-lee',
    'the-heroes-and-villians-series-civil-war-cinco-de-mayo-saves-the-union',
    'the-heroes-and-villians-series-civil-war-the-fall-of-richmond-and-the-surrender-of-an-army',
    'the-heroes-and-villians-series-civil-war-the-election-of-1860-and-secession-winter-told-by-pres',
    'the-heroes-and-villians-series-civil-war-lincoln-s-assassination-and-the-beginning-of-a-new-presi',
    'the-heroes-and-villians-series-civil-war-the-railroad-to-the-civil-war',
    'the-heroes-and-villians-series-civil-war-women-s-roles-in-the-civil-war',
    'the-heroes-and-villians-series-civil-war-the-battles-of-gettysburg-and-vicksburg',
    'the-heroes-and-villians-series-civil-war-the-leaders-and-their-early-battles',
    'the-heroes-and-villians-series-civil-war-african-americans-in-the-civil-war',
    'the-heroes-and-villians-series-civil-war-sherman-s-march-and-those-left-behind',
    'the-heroes-and-villians-series-civil-war-the-road-to-the-war-and-president-buchanan-s-presidency',
    'the-heroes-and-villians-series-civil-war-spies-and-espionage-in-the-civil-war',
    'the-heroes-and-villians-series-civil-war-the-naval-forces-during-the-civil-war',
    'the-heroes-and-villians-series-civil-war-the-emancipation-proclamation',
    'the-heroes-and-villians-series-civil-war-the-war-begins-with-fort-sumter',
  ],
};

// Lesson Plans - organized by subject
const lessonPlans = [
  // Indus Valley Lesson Plans
  '1-lesson-plans-on-ancient-indus-valley-the-foundation-of-the-indus-valley',
  '2-lesson-plans-on-ancient-indus-valley-the-neolithic-era-of-the-indus-valley',
  '3-lesson-plans-on-ancient-indus-valley-the-rise-of-the-indus-valley-civilization',
  '4-lesson-plans-on-ancient-indus-valley-civilization-the-late-harappan-period-and-early-vedic-age',
  '5-lesson-plans-on-ancient-indus-valley-civilization-hinduism-in-the-ancient-world',
  '5-lesson-plans-on-ancient-indus-valley-civilization-the-indo-aryan-migration-between-1500-1000-bc',
  '6-lesson-plans-on-ancient-indus-valley-civilization-later-vedic-period-and-rise-of-kingdoms-1000',
  '6-lesson-plans-on-ancient-indus-valley-civilization-buddhism-in-ancient-indus-valley',
  '7-lesson-plans-on-ancient-indus-valley-civilization-the-art-and-architecture-of-hinduism-buddhism',
  '7-lesson-plans-on-ancient-indus-valley-civilization-jainism-of-ancient-india',
  '11-lesson-plans-on-ancient-indus-valley-civilization-mahajanapadas-and-the-second-urbanization-60',
  '12-lesson-plans-on-ancient-indus-valley-civilization-alexander-the-great-invades-northwest-india',
  '13-lesson-plans-on-ancient-indus-valley-civilization-mauryan-empire-and-those-who-founded-and-expa',
  '14-lesson-plans-on-ancient-indus-valley-civilization-ashoka-the-great-who-was-the-man-ruler-and',
  '15-lesson-plans-on-ancient-indus-valley-civilization-gupta-empire-and-the-golden-age-of-india',
  '16-lesson-plans-on-ancient-southern-asia-the-legacy-of-ancient-india-and-southern-asia',
  // Ancient China Lesson Plans
  '5-lesson-plans-for-ancient-rome-the-spring-and-autumn-period-of-chaos',
  '6-lesson-plans-on-ancient-china-confucius-and-confucianism',
  '7-lesson-plans-on-ancient-china-daoism-and-laozi',
  '8-lesson-plans-on-ancient-china-legalism-xunzi-and-han-feizi',
  '9-lesson-plans-on-ancient-china-the-warring-period-of-ancient-china',
  '10-lesson-plans-on-ancient-china-the-qin-dynasty-of-ancient-china',
  '11-lesson-plans-on-ancient-china-the-han-dynasty-of-ancient-china',
  '12-lesson-plans-on-ancient-china-the-innovations-and-expansions-of-the-han-dynasty',
  '12-lesson-plans-on-ancient-china-end-of-the-han-and-the-classical-era-of-china-and-its-legacy',
  '14-lesson-plans-on-ancient-china-the-people-and-culture-of-the-han-dynasty',
  '14-lesson-plans-on-ancient-china-the-religions-of-the-han-dynasty',
  // Ancient Rome Lesson Plans
  '7-lesson-plans-for-ancient-rome-the-rise-of-caesar-augustus-and-the-pax-romana',
  '9-lesson-plans-for-ancient-rome-the-pax-romana',
  '10-lesson-plans-for-ancient-rome-life-of-the-roman-people-both-patrician-and-plebian',
  '11-lesson-plans-for-ancient-rome-the-engineering-and-innovations-of-the-pax-romanainfrastructure-e',
  '12-lesson-on-ancient-rome-roman-religion-and-the-rise-of-christianity',
  '12-lesson-on-ancient-rome-the-crisis-of-the-third-century',
  '14-lesson-plans-for-ancient-rome-the-changing-of-the-guard-diocletian-and-constantine-the-great',
  '15-lesson-plans-for-ancient-rome-the-fall-and-legacy-of-rome',
  '15-lesson-plans-for-ancient-rome-the-barbarian-invasion-and-the-role-of-christianity',
  // Industrial Revolution Lesson Plans
  'lesson-plans-for-the-industrial-revolution-the-years-before-the-industrial-revolution-1',
  'lesson-plans-for-the-industrial-revolution-the-years-before-the-industrial-revolution',
  'lesson-plans-for-the-industrial-revolution-expansion-globalization-1750-1790',
  'lesson-plans-for-the-industrial-revolution-early-industrial-centers-britain-as-the-birthplace',
  'lesson-plans-for-the-industrial-revolution-capitalism-the-greatest-inventors-in-the-early-revolut',
  'lesson-plans-for-the-industrial-revolution-froam-steam-engines-to-locomotives',
  'lesson-plans-for-the-industrial-revolution-the-early-factory-system-and-how-women-saved-the-people',
  'lesson-plans-for-the-industrial-revolution-the-communication-revolution',
  'lesson-plans-for-the-industrial-revolution-the-transportation-revolution',
  'lesson-plans-for-the-industrial-revolution-the-growth-of-the-textile-industry',
  'lesson-plans-for-the-industrial-revolution-the-oil-revolution',
  'lesson-plans-for-the-industrial-revolution-the-food-and-medical-revolutions',
  'lesson-plans-for-the-industrial-revolution-the-energy-wars',
  'lesson-plans-on-the-industrial-revolution-labor-force-and-the-impact-of-immigration-in-the-u-s-an',
  'lesson-plans-for-the-industrial-revolution-capitalism-vs-socialism-in-the-industrial-revolution-and',
  'lesson-plans-for-the-industrial-revolution-public-schools-and-public-health',
  'lesson-plans-for-the-industrial-revolution-the-presidents-of-the-industrial-revolution-1885-1901',
  'lesson-plans-for-the-industrial-revolution-the-presidents-of-the-industrial-revolution-1885-1901-1',
  // U.S. Civil War Lesson Plans
  'lesson-plans-for-the-u-s-civil-war-the-legacy-of-the-war',
  'lesson-plans-for-the-u-s-civil-war-sherman-s-march-to-the-sea-the-fire-that-broke-the-confederacy',
  'lesson-plans-for-the-u-s-civil-war-the-home-front-and-women-in-the-war',
  'lesson-plans-for-the-u-s-civil-war-the-fall-of-richmond-lee-s-summit-and-the-surrender',
  'lesson-plans-for-the-u-s-civil-war-the-election-of-1860-and-the-secession-winter',
  'lesson-plans-for-the-u-s-civil-war-the-emancipation-proclamation',
  'lesson-plans-for-the-u-s-civil-war-spying-and-espionage-in-the-civil-war',
  'lesson-plans-for-the-u-s-civil-war-the-early-battles-of-the-civil-war',
  'lesson-plans-for-the-u-s-civil-war-cinco-de-mayo-as-a-united-states-celebration',
  'lesson-plans-for-the-u-s-civil-war-the-road-to-war',
  'lesson-plans-for-the-u-s-civil-war-the-battle-of-fort-sumter',
  'lesson-plans-for-the-u-s-civil-war-abraham-lincoln-s-assassination-and-the-legacy-of-the-civil-war',
  'lesson-plans-for-the-u-s-civil-war-grant-vs-lee-the-overland-campaign',
  'lesson-plans-for-the-u-s-civil-war-railroad-and-westward-expansion',
  'lesson-plans-for-the-u-s-civil-war-the-election-of-1864-lincoln-vs-mcclellan',
  'lesson-plans-for-the-u-s-civil-war-the-battle-of-gettysburg',
  'lesson-plans-for-the-u-s-civil-war-naval-forces-of-the-union-and-confederate-navies',
  // Expansion West Lesson Plans
  'lesson-plans-for-the-expansion-west-the-indian-wars-of-1860-1890',
  'lesson-plans-for-the-expansion-west-president-andrew-jackson-and-the-indian-removal-act',
  'lesson-plans-for-the-expansion-west-the-oregon-trail-and-oregon-country',
  'lesson-plans-for-the-expansion-west-the-rest-of-the-louisiana-purchase',
  'lesson-plans-for-the-expansion-west-the-mexican-american-war',
  'lesson-plans-for-the-expansion-west-the-settling-of-california-and-nevada',
  'lesson-plans-for-the-expansion-west-texas-independence-and-annexation-1836-1845',
  'lesson-plans-for-the-expansion-west-the-presidents-who-continued-the-expansion-westward',
  'lesson-plans-for-the-expansion-west-louisiana-purchase-and-the-many-expeditions',
  'lesson-plans-for-the-expansion-west-living-on-the-edge-of-the-frontier-1',
  'lesson-plans-for-the-expansion-west-living-on-the-edge-of-the-frontier',
  'lesson-plans-for-the-expansion-west-the-mormon-pioneers-and-other-religious-pioneers',
  'lesson-plans-for-the-expansion-west-cross-curricular-lessons',
  'lesson-plans-for-the-expansion-west-the-gold-rush-and-statehood-of-california',
  'lesson-plans-for-the-expansion-west-the-missouri-compromise-of-1820',
  'lesson-plans-for-the-expansion-west-the-presidents-who-led-to-the-annexation-of-texas',
  'lesson-plans-for-the-expansion-west-president-james-k-polk-and-his-manifest-destiny',
  // French and Indian War Lesson Plans
  'lesson-plans-for-the-french-and-indian-war-battle-of-montreal-and-the-end-of-french-canada',
  'lesson-plans-for-the-french-and-indian-war-the-siege-of-quebec-and-the-battle-of-the-plains-of-abra',
  'lesson-plans-for-the-french-and-indian-war-cross-curricular-math-1',
  'lesson-plans-for-the-french-and-indian-war-global-impact-and-british-dominance',
  'lesson-plans-for-the-french-and-indian-war-the-battle-of-minorca-and-european-stalemate-1',
  'lesson-plans-for-the-french-and-indian-war-consequences-of-the-war-and-start-of-rebellion',
  'lesson-plans-for-the-french-and-indian-war-the-treaty-of-paris-1763',
  // American Revolution Lesson Plans
  'lesson-plans-about-american-revolution-the-battles-of-lexington-and-concord',
  'lesson-plans-for-the-american-revolution-overview',
  'lesson-plans-for-the-american-revolution-the-british-acts-that-lead-to-resistence',
  'lesson-plans-for-the-american-revolution-the-culper-spy-ring',
  'lesson-plans-for-the-american-revolution-the-battles-of-saratoga',
  'lesson-plans-for-the-american-revolution-cross-curricular-science-activities',
  'lesson-plans-for-the-american-revolution-the-battles-of-stony-point-and-newton',
  'lesson-plans-for-the-american-revolution-the-southern-campaign-continues',
  // Birth of a Nation Lesson Plans
  'lesson-plans-for-the-birth-of-a-nation-the-end-of-the-american-revolution',
  'lesson-plans-for-the-birth-of-a-nation-the-creation-of-the-federal-government-and-their-first-elec',
  'lesson-plans-for-the-birth-of-a-nation-the-first-contested-presidential-election-for-the-second-pr',
  'lesson-plans-for-the-birth-of-a-nation-ratification-of-the-states',
  'lesson-plans-for-the-birth-of-a-nation-conflict-in-the-new-nation-the-whiskey-rebellion',
  'lesson-plans-for-the-birth-of-a-nation-cross-curricular-math-and-science',
  'lesson-plans-for-the-birth-of-a-nation-revolution-of-1800-peaceful-transfer-of-power-and-jeffe',
  'lesson-plans-for-the-birth-of-a-nation-focus-on-the-executive-and-judicial-branches-and-the-signin',
  // War of 1812 Lesson Plans
  'lesson-plans-for-the-war-of-1812-the-second-barbary-war-and-us-global-strength',
  'lesson-plans-for-the-war-of-1812-the-declaration-of-war-and-an-unprepared-nation-war-of-1812',
  'lesson-plans-for-the-war-of-1812-british-attempts-to-undermine-the-united-states-and-native-america',
  'lesson-plans-for-the-war-of-1812-free-market-capitalism-vs-government-interventions',
  'lesson-plans-for-the-war-of-1812-the-treaty-of-ghent-and-the-end-of-the-war',
  'lesson-plans-for-the-war-of-1812-the-battle-of-new-orleans',
  'lesson-plans-for-the-war-of-1812-the-birth-of-the-u-s-naval-strategy-in-the-war',
  // Trans-Atlantic Slave Trade Lesson Plans
  'lesson-plans-of-the-trans-atlantic-slave-trade-origins-of-slavery',
  'lesson-plans-of-the-trans-atlantic-slave-trade-the-rise-of-abolitionism',
  'lesson-plans-of-the-trans-atlantic-slave-trade-the-politics-of-slavery',
  // Religious Freedoms Lesson Plans
  'lesson-plans-for-america-s-religious-freedoms-religion-in-the-american-revolution',
  'lesson-plans-for-america-s-religious-freedoms-religious-diversity-and-new-movements',
  'lesson-plans-for-america-s-religious-freedoms-the-first-great-awakening',
  // Immigration Lesson Plans
  'lesson-plans-for-immigration-in-the-united-states-european-immigration',
];

// Creator's Notes and Misc
const creatorsNotes = [
  'make-history-fun',
  'empowering-education-through-play-how-xogos-and-the-sgo-program-are-transforming-student-learning',
];

function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gis, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gis, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gis, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gis, '#### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gis, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gis, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gis, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gis, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gis, '*$1*')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gis, '- $1\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, '[$2]($1)')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gis, '$1\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gis, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .trim();
}

async function scrapePost(browser, slug) {
  const url = `https://www.xogosgaming.com/post/${slug}`;
  const page = await browser.newPage();

  try {
    console.log(`Scraping: ${slug}`);

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    await page.waitForSelector('h1', { timeout: 15000 }).catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 3000));

    const data = await page.evaluate(() => {
      const titleEl = document.querySelector('h1');
      const title = titleEl ? titleEl.innerText.trim() : '';

      let contentHtml = '';
      const contentSelectors = [
        '[data-hook="post-description"]',
        '[data-hook="post-content"]',
        '.post-content',
        '.blog-post-page-font',
        '[class*="rich-content-viewer"]',
        'article',
        '.wixui-rich-text',
      ];

      for (const selector of contentSelectors) {
        const el = document.querySelector(selector);
        if (el && el.innerHTML.length > 100) {
          contentHtml = el.innerHTML;
          break;
        }
      }

      if (!contentHtml) {
        const main = document.querySelector('main') || document.body;
        contentHtml = main.innerHTML;
      }

      const firstP = document.querySelector('p');
      const excerpt = firstP ? firstP.innerText.substring(0, 300) : '';

      return { title, contentHtml, excerpt };
    });

    await page.close();
    return data;
  } catch (error) {
    console.error(`Error scraping ${slug}:`, error.message);
    await page.close();
    return null;
  }
}

function getTopicInfo(category) {
  const topicMap = {
    'colonial-america': { topic: 'Colonial America', image: '/images/games/ColonialAmerica.jpeg' },
    'age-of-exploration': { topic: 'Age of Exploration', image: '/images/games/AgeOfExploration.jpeg' },
    'ancient-africa': { topic: 'Ancient Africa', image: '/images/games/AncientAfrica.jpeg' },
    'indus-valley': { topic: 'Indus Valley', image: '/images/games/IndusValley.jpeg' },
    'ancient-america': { topic: 'Ancient America', image: '/images/games/AncientAmerica.jpeg' },
    'industrial-revolution': { topic: 'Industrial Revolution', image: '/images/games/IndustrialRevolution.jpeg' },
    'ancient-china': { topic: 'Ancient China', image: '/images/games/AncientChina.jpeg' },
    'ancient-rome': { topic: 'Ancient Rome', image: '/images/games/AncientRome.jpeg' },
    'civil-war': { topic: 'Civil War', image: '/images/games/CivilWar.jpeg' },
  };
  return topicMap[category] || { topic: 'History', image: '/images/fullLogo.jpeg' };
}

function saveHistoryPost(slug, data, category) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'history', category);

  // Ensure directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const { topic, image } = getTopicInfo(category);

  const title = data.title.replace(/^\d+\s*[-–—]\s*/i, '').trim();
  const chapterMatch = slug.match(/^(\d+)-/);
  const chapterNum = chapterMatch ? chapterMatch[1] : '';
  const fullTitle = chapterNum ? `Chapter ${chapterNum} - ${title}` : title;

  const markdown = `---
title: "${fullTitle.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "History"
topic: "${topic}"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "${image}"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

function saveLessonPlan(slug, data) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'lesson-plans');

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const markdown = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "Lesson Plans"
topic: "Lesson Plans"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/fullLogo.jpeg"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

function saveCreatorsNote(slug, data) {
  const postsDir = path.join(process.cwd(), 'content', 'posts', 'creators-notes');

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${slug}.md`);

  const content = htmlToMarkdown(data.contentHtml);
  const wordCount = content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const markdown = `---
title: "${data.title.replace(/"/g, '\\"')}"
excerpt: "${(data.excerpt || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
category: "Creator's Notes"
topic: "Creator's Notes"
publishedAt: "December 2, 2025"
author: "Zack Edwards"
imageUrl: "/images/fullLogo.jpeg"
readTime: "${readTime}"
---

${content}
`;

  fs.writeFileSync(filePath, markdown, 'utf8');
  console.log(`  Saved: ${slug} (${wordCount} words)`);
}

async function main() {
  console.log('Starting comprehensive blog scraper...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  let totalSuccess = 0;
  let totalFail = 0;

  // Scrape history categories
  for (const [category, posts] of Object.entries(postCategories)) {
    console.log(`\n=== Scraping ${category} (${posts.length} posts) ===\n`);

    for (const slug of posts) {
      const data = await scrapePost(browser, slug);

      if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
        saveHistoryPost(slug, data, category);
        totalSuccess++;
      } else {
        console.log(`  Skipped (no/insufficient content): ${slug}`);
        totalFail++;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Scrape lesson plans
  console.log(`\n=== Scraping Lesson Plans (${lessonPlans.length} posts) ===\n`);

  for (const slug of lessonPlans) {
    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      saveLessonPlan(slug, data);
      totalSuccess++;
    } else {
      console.log(`  Skipped (no/insufficient content): ${slug}`);
      totalFail++;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Scrape creator's notes
  console.log(`\n=== Scraping Creator's Notes (${creatorsNotes.length} posts) ===\n`);

  for (const slug of creatorsNotes) {
    const data = await scrapePost(browser, slug);

    if (data && data.title && data.contentHtml && data.contentHtml.length > 200) {
      saveCreatorsNote(slug, data);
      totalSuccess++;
    } else {
      console.log(`  Skipped (no/insufficient content): ${slug}`);
      totalFail++;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  await browser.close();

  console.log('\n========================================');
  console.log('=== SCRAPING COMPLETE ===');
  console.log('========================================');
  console.log(`Total Success: ${totalSuccess}`);
  console.log(`Total Failed: ${totalFail}`);
}

main().catch(console.error);
