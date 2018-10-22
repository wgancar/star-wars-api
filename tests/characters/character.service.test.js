require('chai/register-expect');

const characterService = require('../../src/characters/character.service');
const characterUtils = require('./character.utils');
const { batchCharactersTestData, validCharacter1, characterWithoutName, characterWithoutEpisodes } = require('./character.mocks');
const ValidationError = require('../../src/common/errors/ValidationError');

describe('CharacterService', () => {

  beforeEach('populate', () => characterUtils.insertTestData());
  afterEach('remove', () => characterUtils.dropTestData());

  describe('getCharacters', () => {
    it('should return all star wars characters', async () => {
      const starwarsCharacters = await characterService.getAllCharacters();
      expect(starwarsCharacters.length).to.eql(4);
      starwarsCharacters.forEach((starwarsCharacter, index) => {
        expect(starwarsCharacter).to.have.property('_id');
        expect(starwarsCharacter.name).eql(batchCharactersTestData[index].name);
        expect(starwarsCharacter.episodes).eql(batchCharactersTestData[index].episodes);
        expect(starwarsCharacter.friends).eql(batchCharactersTestData[index].friends);
        expect(starwarsCharacter.planet).eql(batchCharactersTestData[index].planet);
      });
    })
  });

  describe('createCharacter', () => {
    it('should create new character', async () => {
      const newCharacter = await characterService.createCharacter(validCharacter1);
      expect(newCharacter).to.have.property('_id');
      expect(newCharacter.name).eql(validCharacter1.name);
      expect(newCharacter.episodes).eql(validCharacter1.episodes);
      expect(newCharacter.friends).eql(validCharacter1.friends);
    });

    it('should throw validation error, no name provided', async () => {
      try {
        await characterService.createCharacter(characterWithoutName);
      } catch (error) {
        expect(error).instanceOf(ValidationError)
      }
    });

    it('should throw validation error, no episodes provided', async () => {
      try {
        await characterService.createCharacter(characterWithoutEpisodes);
      } catch (error) {
        expect(error).instanceOf(ValidationError)
      }
    })
  });
});
