require('chai/register-expect');
const request = require('supertest');

const characterUtils = require('./character.utils');
const app = require('../../src/app');
const config = require('../../config/config');
const { batchCharactersTestData, validCharacter1, characterWithoutName, characterWithoutEpisodes } = require('./character.mocks');

const CHARACTERS_URL = `${config.apiPrefix}/characters`;

describe('CharacterController', () => {

  beforeEach('populate', () => characterUtils.insertTestData());
  afterEach('remove', () => characterUtils.dropTestData());

  describe('GET /characters', () => {
    it('Should return all characters array in json format', async () => {
      const starwarsCharacters = await request(app)
        .get(CHARACTERS_URL)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => response.body);

      expect(starwarsCharacters.length).to.eql(4);
      starwarsCharacters.forEach((starwarsCharacter, index) => {
        expect(starwarsCharacter).to.have.property('_id');
        expect(starwarsCharacter.name).eql(batchCharactersTestData[index].name);
        expect(starwarsCharacter.episodes).eql(batchCharactersTestData[index].episodes);
        expect(starwarsCharacter.friends).eql(batchCharactersTestData[index].friends);
        expect(starwarsCharacter.planet).eql(batchCharactersTestData[index].planet);
      });
    });
  });

  describe('POST /characters', () => {
    it('should create new character with fields provided in request', async () => {
      const newCharacter = await request(app)
        .post(CHARACTERS_URL)
        .send(validCharacter1)
        .expect('Content-Type', /json/)
        .expect(201)
        .then(response => response.body);

      expect(newCharacter).to.have.property('_id');
      expect(newCharacter.name).eql(validCharacter1.name);
      expect(newCharacter.episodes).eql(validCharacter1.episodes);
      expect(newCharacter.friends).eql(validCharacter1.friends);
      expect(newCharacter.planet).eql(validCharacter1.planet);
    });

    it('should return BAD_REQUEST response due to validation error [ no name provided ]', async () => {
      const responseBody = await request(app)
        .post(CHARACTERS_URL)
        .send(characterWithoutName)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return BAD_REQUEST response due to validation error [ no episodes provided ]', async () => {
      const responseBody = await request(app)
        .post(CHARACTERS_URL)
        .send(characterWithoutEpisodes)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  })
});
