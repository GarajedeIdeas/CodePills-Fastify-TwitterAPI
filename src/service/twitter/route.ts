import { FastifyInstance } from 'fastify'
import { StatusController } from './controller/twitterController'

export class TwitterRouter {
    public static routes = async (fastify: FastifyInstance): Promise<void> => {
        fastify.get(
            '/tweet/search/:text',
            { preValidation: fastify.auth([fastify.authEngine.allowAnonymous]) },
            StatusController.search,
        )
        fastify.post(
            '/tweet',
            { preValidation: fastify.auth([fastify.authEngine.allowAnonymous]) },
            StatusController.tweet,
        )
    }
}