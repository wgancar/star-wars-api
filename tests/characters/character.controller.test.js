require('chai/register-expect');
const request = require('supertest');
const forEach = require('mocha-each');

const characterUtils = require('./character.utils');
const app = require('../../src/app');
const config = require('../../config/config');
const {
   batchCharactersTestData, validCharacter1, validCharacter2, characterWithoutName,
   characterWithoutEpisodes, validUpdateObject4, invalidUpdateObject3
} = require('./character.mocks');
const Episodes = require('../../src/episodes/episodes.enum');

const CHARACTERS_URL = `${config.apiPrefix}/characters`;

describe('CharacterController', () => {

  beforeEach('populate', () => characterUtils.insertTestData());
  afterEach('remove', () => characterUtils.dropTestData());

  describe('GET /characters', () => {
    forEach([
      [1, 10],
      [1, 5],
      [1, 2],
      [2, 2],
      [1, 1],
    ]).it('Should return paginated characters object in json format [page: %s, pageSize: %s]', async (page, pageSize) => {
      const charactersPaginatedObject = await request(app)
        .get(CHARACTERS_URL)
        .query({
          page,
          pageSize
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => response.body);

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

    it('should return 400 - BAD_REQUEST response due to validation error [ no name provided ]', async () => {
      const responseBody = await request(app)
        .post(CHARACTERS_URL)
        .send(characterWithoutName)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response due to validation error [ no episodes provided ]', async () => {
      const responseBody = await request(app)
        .post(CHARACTERS_URL)
        .send(characterWithoutEpisodes)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('GET /characters/{characterId}', () => {
    beforeEach(async () => this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter1)).toObject());
    afterEach(async () => await characterUtils.dropSingleCharacterById(this.newCharacter._id));
    it('should return character object for given id in request path', async () => {
      const fetchedCharacter = await request(app)
        .get(`${CHARACTERS_URL}/${this.newCharacter._id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => response.body);

      expect(fetchedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(fetchedCharacter.name).to.eql(this.newCharacter.name);
      expect(fetchedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(fetchedCharacter.episodes).to.eql(this.newCharacter.episodes);
      expect(fetchedCharacter.friends).to.eql(this.newCharacter.friends);
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
        const responseBody = await request(app)
          .get(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f`)
          .expect('Content-Type', /json/)
          .expect(404)
          .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .get(`${CHARACTERS_URL}/123`)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('DELETE /characters/{characterId}', () => {
    beforeEach(async () => this.newCharacter = await characterUtils.insertSingleCharacter(validCharacter1));
    it('should return 204 - NoContent response, for successful character deletion', async () => {
      await request(app)
        .delete(`${CHARACTERS_URL}/${this.newCharacter._id}`)
        .expect(204);
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/123`)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('Patch /characters/{characterId}', () => {
    beforeEach(async () => this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter1)).toObject());
    it('should return updated character object for given id in request path', async () => {
      const updatedCharacter = await request(app)
        .patch(`${CHARACTERS_URL}/${this.newCharacter._id}`)
        .send(validUpdateObject4)
        .expect(200)
        .then(response => response.body);

      expect(updatedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(updatedCharacter.name).to.eql(this.newCharacter.name);
      expect(updatedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(updatedCharacter.episodes).to.eql(validUpdateObject4.episodes);
      expect(updatedCharacter.friends).to.eql(validUpdateObject4.friends);
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f`)
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/123`)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for invalid request body values', async () => {
      const responseBody = await request(app)
        .patch(`${CHARACTERS_URL}/${this.newCharacter._id}`)
        .send(invalidUpdateObject3)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('POST /characters/{characterId}/friends', () => {
    beforeEach(async () => this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter1)).toObject());
    it('should append character\'s friends with data send in request, returns updated character object', async () => {
      const updatedCharacter = await request(app)
        .post(`${CHARACTERS_URL}/${this.newCharacter._id}/friends`)
        .send(['Lando Calrissian'])
        .expect(200)
        .then(response => response.body);

      expect(updatedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(updatedCharacter.name).to.eql(this.newCharacter.name);
      expect(updatedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(updatedCharacter.episodes).to.eql(this.newCharacter.episodes);
      expect(updatedCharacter.friends).to.eql(this.newCharacter.friends.concat(['Lando Calrissian']));
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f/friends`)
        .send(['Chewbacca'])
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/123/friends`)
        .send(['Chewbacca'])
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for invalid request body values', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/${this.newCharacter._id}/friends`)
        .send([123])
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('DELETE /characters/{characterId}/friends', () => {
    beforeEach(async () => {
      this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter1)).toObject();
      this.friendsToRemove = [this.newCharacter.friends[0]];
    });
    it('should remove character friends listed in request, returns updated character object', async () => {
      const updatedCharacter = await request(app)
        .delete(`${CHARACTERS_URL}/${this.newCharacter._id}/friends`)
        .send(this.friendsToRemove)
        .expect(200)
        .then(response => response.body);

      expect(updatedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(updatedCharacter.name).to.eql(this.newCharacter.name);
      expect(updatedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(updatedCharacter.episodes).to.eql(this.newCharacter.episodes);
      expect(updatedCharacter.friends).to.eql(this.newCharacter.friends.filter(friend => !this.friendsToRemove.includes(friend)));
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f/friends`)
        .send(this.friendsToRemove)
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/123/friends`)
        .send(this.friendsToRemove)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for invalid request body values', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/${this.newCharacter._id}/friends`)
        .send([123])
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('POST /characters/{characterId}/episodes', () => {
    beforeEach(async () => this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter2)).toObject());
    it('should return updated character with updated episodes list', async () => {
      const updatedCharacter = await request(app)
        .post(`${CHARACTERS_URL}/${this.newCharacter._id}/episodes`)
        .send([Episodes.Empire])
        .expect(200)
        .then(response => response.body);

      expect(updatedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(updatedCharacter.name).to.eql(this.newCharacter.name);
      expect(updatedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(updatedCharacter.friends).to.eql(this.newCharacter.friends);
      expect(updatedCharacter.episodes).to.eql(this.newCharacter.episodes.concat([Episodes.Empire]));
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f/episodes`)
        .send([Episodes.NewHope])
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/123/episodes`)
        .send([Episodes.NewHope])
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for invalid request body values', async () => {
      const responseBody = await request(app)
        .post(`${CHARACTERS_URL}/${this.newCharacter._id}/episodes`)
        .send(['LOSTARK'])
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });

  describe('DELETE /characters/{characterId}/episodes', () => {
    beforeEach(async () => {
      this.newCharacter = (await characterUtils.insertSingleCharacter(validCharacter2)).toObject();
      this.episodesToRemove = [this.newCharacter.episodes[0]];
    });
    it('should remove character friends listed in request, returns updated character object', async () => {
      const updatedCharacter = await request(app)
        .delete(`${CHARACTERS_URL}/${this.newCharacter._id}/episodes`)
        .send(this.episodesToRemove)
        .expect(200)
        .then(response => response.body);

      expect(updatedCharacter._id).to.eql(this.newCharacter._id.toString());
      expect(updatedCharacter.name).to.eql(this.newCharacter.name);
      expect(updatedCharacter.planet).to.eql(this.newCharacter.planet);
      expect(updatedCharacter.friends).to.eql(this.newCharacter.friends);
      expect(updatedCharacter.episodes).to.eql(this.newCharacter.episodes.filter(episode => !this.episodesToRemove.includes(episode)));
    });

    it('should return 404 - NOT_FOUND response, for characterId that doesn\'t exist', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/5bcdd7a340e57de35543f04f/episodes`)
        .send(this.episodesToRemove)
        .expect('Content-Type', /json/)
        .expect(404)
        .then(response => response.body);

      expect(responseBody.status).to.eql(404);
      expect(responseBody.type).to.eql('RESOURCE_NOT_FOUND_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for characterId that is not convertible to ObjectId ', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/123/episodes`)
        .send(this.episodesToRemove)
        .expect('Content-Type', /json/)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });

    it('should return 400 - BAD_REQUEST response, for invalid request body values', async () => {
      const responseBody = await request(app)
        .delete(`${CHARACTERS_URL}/${this.newCharacter._id}/episodes`)
        .send(this.newCharacter.episodes)
        .expect(400)
        .then(response => response.body);

      expect(responseBody.status).to.eql(400);
      expect(responseBody.type).to.eql('VALIDATION_ERROR');
    });
  });
});
