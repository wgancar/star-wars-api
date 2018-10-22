const validCharacter1 = {
  name: 'Han Solo',
  episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
  friends: ['Luke Skywalker', 'Leia Organa'],
};

const validCharacter2 = {
  name: 'Obi-wan Kenobi',
  episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
  friends: ['Luke Skywalker', 'Leia Organa', 'Han Solo'],
};

const characterWithoutName =  {
  episodes: ['NEWHOPE'],
};

const characterWithoutEpisodes = {
  name: 'Boba Fett',
  friends: ['Jabba The Hutt'],
};

const batchCharactersTestData = [{
    name: 'Darth Vader',
    episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    friends: ['Wilhuff Tarkin']
  },
  {
    name: 'Leia Organa',
    episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    planet: 'Alderaan',
    friends: ['Luke Skywalker', 'Han Solo', 'C-3PO', 'R2-D2']
  },
  {
    name: 'Wilhuff Tarkin',
    episodes: ['NEWHOPE'],
    friends: ['Darth Vader']
  },
  {
    name: 'C-3PO',
    episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    friends: ['Luke Skywalker', 'Han Solo', 'Leia Organa', 'R2-D2']
  },
];

module.exports = {
  validCharacter1,
  validCharacter2,
  characterWithoutName,
  characterWithoutEpisodes,
  batchCharactersTestData,
};
