require('chai/register-should');
const request = require('supertest');

const app = require('../../src/app');
const config = require('../../config/config');

const CHARACTERS_URL = `${config.apiPrefix}/characters`;

describe('CharacterController', () => {
  describe('GET /characters', () => {
    it('Should return all characters array in json format', async () => {
      const starwarsCharacters = await request(app)
        .get(CHARACTERS_URL)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => response.body);

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
    });
  })
});
