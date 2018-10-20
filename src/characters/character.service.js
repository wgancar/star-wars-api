/**
 * Return star wars characters
 * @returns {Array<Object>}
 */
const getAllCharacters = () => {
  return [{
    name: 'Luke Skywalker',
    episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    'friends': ['Han Solo', 'Leia Organa', 'C-3PO', 'R2-D2']
  }, {
    name: 'Darth Vader',
    episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
    friends: ['Wilhuff Tarkin']
  }
  ];
};

module.exports = {
  getAllCharacters,
};
