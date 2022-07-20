import { FastifyReply, FastifyRequest } from 'fastify'

export class StatusController {
    public static search = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { text } = request.params as { text: string }
            const tweets = await request.twitterAPIService.search(text)
            reply.status(200).send(tweets)
        } catch(e) {
            console.log(e)
            reply.status(500).send('[SEARCH TWEET] Error in twitter API')
        }
    }

    public static tweet = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
            const { tweet } = request.body as { tweet: string }
            const tweets = await request.twitterAPIService.post(tweet)
            reply.status(200).send(tweets)
        } catch(e) {
            console.log(e)
            reply.status(500).send('[POST TWEET] Error in twitter API')
        }
    }
}
