require('chai/register-should');

describe('CharacterService', () => {
  describe('getCharacters', () => {
    it('should return all star wars characters', async () => {
      const starwarsCharacters = await characterService.getCharacters();
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
