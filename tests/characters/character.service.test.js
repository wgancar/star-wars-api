require('chai/register-should');
const characterService = require('../../src/characters/character.service');

describe('CharacterService', () => {
  describe('getCharacters', () => {
    it('should return all star wars characters', async () => {
      const starwarsCharacters = await characterService.getAllCharacters();
      starwarsCharacters.should.eql([{
          name: 'Luke Skywalker',
          episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
          'friends': ['Han Solo', 'Leia Organa', 'C-3PO', 'R2-D2']
        }, {
          name: 'Darth Vader',
          episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
          friends: ['Wilhuff Tarkin']
        }
      ]);
    })
  })
});
