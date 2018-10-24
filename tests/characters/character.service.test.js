require('chai/register-expect');
const forEach = require('mocha-each');

const characterService = require('../../src/characters/character.service');
const characterUtils = require('./character.utils');
const {
  batchCharactersTestData, validCharacter1, validCharacter2, characterWithoutName, characterWithoutEpisodes,
  validUpdateObject1, validUpdateObject2, validUpdateObject3, validUpdateObject4, validUpdateObject5, validUpdateObject6, validUpdateObject7,
  invalidUpdateObject1, invalidUpdateObject2, invalidUpdateObject3, invalidUpdateObject4, invalidUpdateObject5
} = require('./character.mocks');
const ValidationError = require('../../src/common/errors/ValidationError');
const ResourceNotFoundError = require('../../src/common/errors/ResourceNotFoundError');
const Episodes = require('../../src/episodes/episodes.enum');

describe('CharacterService', () => {

  beforeEach('populate', () => characterUtils.insertTestData());
  afterEach('remove', () => characterUtils.dropTestData());

  describe('getCharacters', () => {
    forEach([
      [1, 10],
      [1, 5],
      [1, 2],
      [2, 2],
      [1, 1],
    ]).it('should return paginated star wars characters for page %s with page size %s', async (page, pageSize) => {
        const charactersPaginatedObject = await characterService.getAllCharacters(page, pageSize);
        expect(charactersPaginatedObject.page).to.eql(page);
        expect(charactersPaginatedObject.pageSize).to.eql(pageSize);
        expect(charactersPaginatedObject.totalItems).to.eql(batchCharactersTestData.length);
        expect(charactersPaginatedObject.totalPages).to.eql(Math.ceil(batchCharactersTestData.length/pageSize));
        expect(charactersPaginatedObject.characters.length)
          .to.eql(batchCharactersTestData.length < pageSize ? batchCharactersTestData.length : pageSize);

        charactersPaginatedObject.characters.forEach((starwarsCharacter, index) => {
          const batchIndex = ((page - 1) * pageSize) + index;
          expect(starwarsCharacter).to.have.property('_id');
          expect(starwarsCharacter.name).eql(batchCharactersTestData[batchIndex].name);
          expect(starwarsCharacter.episodes).eql(batchCharactersTestData[batchIndex].episodes);
          expect(starwarsCharacter.friends).eql(batchCharactersTestData[batchIndex].friends);
          expect(starwarsCharacter.planet).eql(batchCharactersTestData[batchIndex].planet);
        });
      });
  });

  describe('createCharacter', () => {
    forEach([validCharacter1, validCharacter2])
      .it('should create new character with provided data: %j', async character => {
        const createdCharacter = await characterService.createCharacter(character);
        expect(createdCharacter).to.have.property('_id');
        expect(createdCharacter.name).eql(character.name);
        expect(createdCharacter.episodes).eql(character.episodes);
        expect(createdCharacter.friends).eql(character.friends);
      });

    it('should throw ValidationError, no name provided', async () => {
      try {
        await characterService.createCharacter(characterWithoutName);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    it('should throw ValidationError, no episodes provided', async () => {
      try {
        await characterService.createCharacter(characterWithoutEpisodes);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('getCharacterById', () => {
    before(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    after(async () => await characterUtils.dropSingleCharacterById(this.newCharacter._id));
    it('should return character for given id', async () => {
      const fetchedUser = await characterService.getCharacterById(this.newCharacter._id);

      expect(fetchedUser).to.eql(this.newCharacter.toObject());
    });

    it('should throw ResourceNotFoundError for character that doesn\'t exist', async () => {
      try {
        await characterService.getCharacterById('5bcdd7a340e57de35543f04f');
      } catch (error) {
        expect(error).instanceOf(ResourceNotFoundError);
      }
    });
    forEach([
      'test',
      123,
      undefined,
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId) => {
      try {
        await characterService.getCharacterById(characterId);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('deleteCharacterById', () => {
    before(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    it('should remove character by given id', async () => {
      const deletedCharacter = await characterService.deleteCharacterById(this.newCharacter._id);

      expect(deletedCharacter._id).to.eql(this.newCharacter._id);
    });

    it('should throw ResourceNotFoundError for character that doesn\'t exist', async () => {
      try {
        await characterService.deleteCharacterById('5bcdd7a340e57de35543f04f');
      } catch (error) {
        expect(error).instanceOf(ResourceNotFoundError);
      }
    });

    forEach([
      'test',
      123,
      undefined,
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId) => {
      try {
        await characterService.deleteCharacterById(characterId);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('updateCharacterById', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    forEach([
      validUpdateObject1, validUpdateObject2, validUpdateObject3, validUpdateObject4,
      validUpdateObject5, validUpdateObject6, validUpdateObject7
    ])
      .it('should update existing character by id, with provided values: %j', async updateObject => {
        const updatedCharacter = await characterService.updateCharacterById(this.newCharacter._id, updateObject);
        const updatedFields = Object.keys(updateObject);
        const notUpdatedFields = Object.keys(updatedCharacter)
          .filter(key => !updatedFields.includes(key));

        //Check if fields that had to be updated were updated successfully
        updatedFields.forEach(updatedField => expect(updatedCharacter[updatedField]).to.eql(updateObject[updatedField]));

        // Check if fields that didn't have to be updated have the same value
        notUpdatedFields.forEach(notUpdatedField => expect(updatedCharacter[notUpdatedField]).to.eql(this.newCharacter[notUpdatedField]));
      });

    it('should throw ResourceNotFoundError for character that doesn\'t exist', async () => {
      try {
        await characterService.deleteCharacterById('5bcdd7a340e57de35543f04f');
      } catch (error) {
        expect(error).instanceOf(ResourceNotFoundError);
      }
    });

    forEach([
      ['test', validUpdateObject1],
      [123, validUpdateObject1],
      [undefined, validUpdateObject1],
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId, fieldsToUpdate) => {
      try {
        await characterService.updateCharacterById(characterId, fieldsToUpdate);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    forEach([ invalidUpdateObject1, invalidUpdateObject2, invalidUpdateObject3, invalidUpdateObject4, invalidUpdateObject5])
      .it('should throw ValidationError when provided not valid object values: %j', async fieldsToUpdate => {
      try {
        await characterService.updateCharacterById(this.newCharacter._id, fieldsToUpdate);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('appendFriendsByCharacterId', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    forEach([
      [['Lando Calrissian']],
      [['Lando Calrissian', 'Chewbacca']],
      [['Chewbacca']]
    ]).it('should update current character friends, with provided values: %j', async friendsToAppend => {
        const updatedCharacter = await characterService.appendFriendsByCharacterId(this.newCharacter._id, friendsToAppend);
        expect(updatedCharacter.friends).eql(validCharacter1.friends.concat(friendsToAppend));
    });

    forEach([
      ['test', ['Lando Calrissian']],
      [123, ['Lando Calrissian']],
      [undefined, ['Lando Calrissian']],
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId, friendsToAppend) => {
      try {
        await characterService.appendFriendsByCharacterId(characterId, friendsToAppend);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    forEach([
      1,
      [[1,2]],
      undefined,
      [[]]
    ]).it('should throw ValidationError when provided not valid object values: %j', async friendsToAppend => {
        try {
          await characterService.appendFriendsByCharacterId(this.newCharacter._id, friendsToAppend);
        } catch (error) {
          expect(error).instanceOf(ValidationError);
        }
      });
  });

  describe('removeFriendsByCharacterId', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    forEach([
      [[validCharacter1.friends[0]]],
      [[validCharacter1.friends[1]]],
      [validCharacter1.friends]
    ]).it('should remove provided character from current character friends [%j]', async friendsToRemove => {
      const updatedCharacter = await characterService.removeFriendsByCharacterId(this.newCharacter._id, friendsToRemove);
      expect(updatedCharacter.friends).eql(validCharacter1.friends.filter(friend => !friendsToRemove.includes(friend)));
    });

    forEach([
      ['test', validCharacter1.friends[0]],
      [123, validCharacter1.friends[0]],
      [undefined, validCharacter1.friends[0]],
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId, friendsToAppend) => {
      try {
        await characterService.appendFriendsByCharacterId(characterId, friendsToAppend);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    forEach([
      1,
      [[1,2]],
      undefined,
      [[]]
    ]).it('should throw ValidationError when provided not valid object values: %j', async friendsToRemove => {
      try {
        await characterService.removeFriendsByCharacterId(this.newCharacter._id, friendsToRemove);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('appendEpisodesByCharacterId', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    forEach([
      [[Episodes.NewHope]],
      [[Episodes.Empire]],
      [[Episodes.NewHope, Episodes.Jedi]],
      [[Episodes.NewHope, Episodes.Empire, Episodes.Jedi]],
    ]).it('should update current character episodes, with provided values: %j', async episodesToAppend => {
      const updatedCharacter = await characterService.appendEpisodesByCharacterId(this.newCharacter._id, episodesToAppend);
      expect(updatedCharacter.episodes)
        .eql(validCharacter1.episodes.concat(episodesToAppend.filter(episode => validCharacter1.episodes.indexOf(episode) < 0)));
    });

    forEach([
      ['test', [Episodes.NewHope]],
      [123, [Episodes.Jedi]],
      [undefined, [Episodes.Empire]],
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId, episodesToAppend) => {
      try {
        await characterService.appendEpisodesByCharacterId(characterId, episodesToAppend);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    forEach([
      1,
      [['LOSTARK','TEMPLEOFDOOM']],
      [['HOLYGRAIL']]
      [[1,2]],
      undefined,
      [[]]
    ]).it('should throw ValidationError when provided not valid object values: %j', async episodesToAppend => {
      try {
        await characterService.appendEpisodesByCharacterId(this.newCharacter._id, episodesToAppend);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });

  describe('removeEpisodesByCharacterId', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    forEach([
      [[Episodes.NewHope]],
      [[Episodes.NewHope, Episodes.Empire]],
      [[Episodes.Jedi, Episodes.Empire]],
      [[Episodes.Jedi]],
    ]).it('should remove provided episode from current character\'s episodes [%j]', async episodesToRemove => {
      const updatedCharacter = await characterService.removeEpisodesByCharacterId(this.newCharacter._id, episodesToRemove);
      expect(updatedCharacter.episodes).eql(validCharacter1.episodes.filter(episode => !episodesToRemove.includes(episode)));
    });

    forEach([
      ['test', Episodes.NewHope],
      [123, Episodes.NewHope],
      [undefined, Episodes.NewHope],
    ]).it('should throw ValidationError when provided id is not convertible to ObjectId: [%s]', async (characterId, episodesToRemove) => {
      try {
        await characterService.removeEpisodesByCharacterId(characterId, episodesToRemove);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });

    forEach([
      1,
      [['LOSTARK','TEMPLEOFDOOM']],
      [['HOLYGRAIL']]
        [[1,2]],
      undefined,
      [[]]
    ]).it('should throw ValidationError when provided not valid object values: %j', async episodesToRemove => {
      try {
        await characterService.removeEpisodesByCharacterId(this.newCharacter._id, episodesToRemove);
      } catch (error) {
        expect(error).instanceOf(ValidationError);
      }
    });
  });
});
