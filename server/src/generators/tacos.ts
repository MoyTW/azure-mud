/* eslint-disable quotes */

import tracery from 'tracery-grammar'

export const actionString = (tacos: string) => {
  return `You inhale a scrumptious ${tacos}.`
}

export const generate = () => {
  var grammar = tracery.createGrammar({
    origin: [
      "taco with #monster# meat and #bean#"
    ],
    monster: [
      'Ice Giant',
      'Slime',
      'Crab',
      'Balrog',
      'Cockatrice',
      'Kobold',
      'Mimic',
      'Bat',
      'Dragon',
      'Emu',
      'Venus Flytrap',
      'Jabberwock',
      'Quagga',
      'Rattlesnake',
      'Xeroc',
      'Yeti',
      'Eel',
      'Cobra',
      'Proto Gator',
      'Proto Shark',
      'Proto Mammoth',
      'Jellyfish',
      'Giant Ant',
      'Killer Hornet',
      'Jumping Spider',
      'Tarantula',
      'Magic Moth',
      'Millipede',
      'Shark',
      'Gator',
      'Sea Cucumber',
      'Urchin',
      'Cave Toad',
      'Giant Squid',
      'Piranha',
      'Grizzly Bear',
      'Python',
      'Dire Wolf',
      'Tyrannosaurus',
      'Mastodon',
      'Raptor',
      'Ankylosaurus',
      'Iguanodon',
      'Utahraptor',
      'Parasite',
      'Polar Bear',
      'Arctic Seal',
      'Giant Clam',
      'Barracuda',
      'Trilobyte',
      'Wild Boar',
      'Bark Scorpion',
      'Coelacanth',
      'Bagworm',
      'Dung Beetle',
      'Cassowary',
      'Hawk',
      'Kingfisher',
      'Monitor Lizard',
      'Weasel',
      'Wooly Rhino',
      'Bull',
      'Raven',
      'Leftover',
      'Unknowable Creature',
      'Rat',
      'Giant Rat',
      'Clay Golem',
      'Zombie Dragon',
      'Drake',
      'Unicorn',
      'Troll',
      'Imp',
      'Mycenoid',
      'Quasit',
      'Ectoplasm',
      'Griffon',
      'Wyvern',
      'Pixie',
      'Faefly',
      'Cave Freak',
      'Vile Freak',
      'Chimera',
      'Gaping Maw',
      'Demon Taskmaster',
      'Avatar of the Forest',
      'Dusk Stalker',
      'Night Reaver',
      'Kappa',
      'Oni',
      'Selkie',
      'Living Armor',
      'Bramble Elemental',
      'Magma Elemental',
      'Mummy',
      'Reanimated Corpse',
      'Hellhound',
      'Flesh Golem',
      'Mandragora',
      'Homunculus',
      'Ent',
      'Vine Blight',
      'Horror of the Depths',
      'Sea Serpent',
      'Giant Slug',
      'Tentacle Beast',
      'Night Hag',
      'Mad Mage',
      'Chatterer',
      'Milkwalker',
      'Giant Maggot Larva',
      'Giant Worm',
      'Gashadokuro',
      'Obake',
      'Tengu',
      'Haunted Mirror',
      'Toxic Toad',
      'Quill Beast',
      'Undead Sailor',
      'Roc',
      'Mantigore',
      'Flaming Bat',
      'Phoenix',
      'Harpy',
      'Gargoyle',
      'Beholder',
      'Gorgon',
      'Minotaur',
      'Belfry Spirit',
      'Fire Giant',
      'Evil Duke',
      'Cosmic Clown',
      'Werebear',
      'Wererat',
      'Witch\'s Familiar',
      'Chickenwitch',
      'Werewolf',
      'Air Elemental',
      'Tooth Fairy',
      'Bag Man',
      'Hat Man',
      'Vampire Queen',
      'Automaton',
      'Gnoll',
      'Warg',
      'Battle Hippo',
      'Frog Wizard',
      'Necromancer',
      'Lich',
      'Demigod',
      'Catoblepas',
      'Buer',
      'Malphas',
      'Dark Elf',
      'Acolyte',
      'Mondo Mantis',
      'Gamer',
      'Forgotten Beast',
      'Lazer Walker',
      'Fluffy Wambler',
      'Plump Helmet Man',
      'Glowcrow',
      'Honey Skunk',
      'Molluscmage',
      'Greydwarf',
      'Yendor',
      'Rakanishu',
      'Wumpus',
      'Nalzok',
      'Zuul',
      'Loud Bird',
      'Yung Venuz',
      'King Conga',
      'Magaera',
      'Thanatos',
      'Aquator',
      'Ur-vile',
      'Engi',
      'Kazaaakpleth',
      'Bracken',
      'Bancho',
      'Beefalo',
      'Clawler',
      'Stoat',
      'Geck',
      'Ironclad',
      'Lutefisk',
      'Tonberry',
      'Particle Man'
    ],
    bean: [
      'Black Beans',
      'Red Beans',
      'Pinto Beans',
      'Jumping Beans',
      'Refried Beans',
      'Coffee Beans',
      'Jelly Beans',
      'Toe Beans',
      'Cool Beans',
      'Magic Beans',
      'String Beans',
      'Mung Beans',
      'Bean Sprouts',
      'Living Beans',
      'Unbeans',
      'Lima Beans',
      'Sliced Beans',
      'Bludgeoned Beans',
      'Pierced Beans',
      'Beans of Giant Stalk',
      'Micro Beans',
      'Aw Beans',
      'Canned Beans',
      'Dried Bulk Beans',
      'Garbanzo Beans',
      'Werebeans',
      'Green Beans',
      'Bean Burger Bits',
      'Extra Beans',
      'Fire Beans',
      'Ice Beans',
      'Sea Beans',
      'Space Beans',
      'Cave Beans',
      'Queen\'s Beans',
      'Bard\'s Beans',
      'Tavern Beans',
      'Butter Beans',
      'Broad Beans',
      'Broadsword Beans',
      'Sword Beans',
      'Fava Beans',
      'Soy Beans',
      'Baked Beans',
      'Spilled Beans',
      'A Hill of Beans',
      'Lentils',
      'Okra',
      'Green Peas',
      'Beans',
      'Bioluminescent Cave Beans'
    ]
  })

  grammar.addModifiers(tracery.baseEngModifiers)
  return grammar.flatten('#origin#')
}
/* eslint-enable quotes */
