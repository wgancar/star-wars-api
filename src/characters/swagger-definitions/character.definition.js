/**
 * @swagger
 * definitions:
 *  Character:
 *    properties:
 *      id:
 *        type: string
 *        description: Character's unique identifier
 *      name:
 *        type: string
 *        description: Character's full name
 *        example: Luke Skywalker
 *      planet:
 *        type: string
 *        description: Character's homeworld
 *        example: Tatooine
 *      friends:
 *        type: array
 *        description: List of given character's friends
 *        items:
 *          type: string
 *        example: [Han Solo, Obi Wan]
 *      episodes:
 *        type: array
 *        description: List of episodes that given character appeared in
 *        items:
 *          type: String
 *          enum: [NEWHOPE, EMPIRE, JEDI]
 */
