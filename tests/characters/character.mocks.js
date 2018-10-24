const validCharacter1 = {
  name: 'Han Solo',
  episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
  friends: ['Luke Skywalker', 'Leia Organa'],
};

const validCharacter2 = {
  name: 'Obi-wan Kenobi',
  episodes: ['NEWHOPE', 'JEDI'],
  friends: ['Luke Skywalker', 'Leia Organa', 'Han Solo'],
};

const characterWithoutName =  {
  episodes: ['NEWHOPE'],
};

const characterWithoutEpisodes = {
  name: 'Boba Fett',
  friends: ['Jabba The Hutt'],
};

const validUpdateObject1 = {
  episodes: ['JEDI'],
};

const validUpdateObject2 = {
  name: 'Obi-wan Kenobi',
  friends: ['Yoda'],
};

const validUpdateObject3 = {
  planet: 'Coruscant',
  friends: [],
};

const validUpdateObject4 = {
  episodes: ['JEDI', 'EMPIRE'],
  friends: ['Darth Sidious']
};

const validUpdateObject5 = {
  name: 'Ben Kenobi',
  episodes: ['JEDI'],
};

const validUpdateObject6 = {
  name: 'Ben Kenobi',
  planet: 'Dagobah',
};

const validUpdateObject7 = {
  name: 'Obi-wan Kenobi',
  friends: ['Leia Organa', 'Han Solo'],
  episodes: ['JEDI'],
  planet: 'Yavin'
};

const invalidUpdateObject1 = {
  name: 123,
};

const invalidUpdateObject2 = {
  episodes: [],
};

const invalidUpdateObject3 = {
  episodes: ['NONAME'],
};

const invalidUpdateObject4 = {
  name: 456,
  episodes: ['NONAME'],
};

const invalidUpdateObject5 = {
  name: 456,
  friends: 'abc',
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
  validUpdateObject1,
  validUpdateObject2,
  validUpdateObject3,
  validUpdateObject4,
  validUpdateObject5,
  validUpdateObject6,
  validUpdateObject7,
  invalidUpdateObject1,
  invalidUpdateObject2,
  invalidUpdateObject3,
  invalidUpdateObject4,
  invalidUpdateObject5,
  characterWithoutName,
  characterWithoutEpisodes,
  batchCharactersTestData,
};
