import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { TwitterApi } from 'twitter-api-v2';

export class TwitterAPIService {
    private userClient: TwitterApi

    public constructor (twitterApiKey: string, twitterApiSecret: string, twitterAccessToken: string, twitterAccessTokenSecret: string) {
        this.userClient = new TwitterApi({
            appKey: twitterApiKey,
            appSecret: twitterApiSecret,
            accessToken: twitterAccessToken,
            accessSecret: twitterAccessTokenSecret,
        });
    }

    public async search(searchOptions: string) {
        const tweets = await this.userClient.v2.search(searchOptions);
        return tweets
    }

    public async post(tweet: string) {
        const client = await this.userClient.appLogin();
        const postedTweet = await client.v1.tweet(tweet);
        return postedTweet
    }
}

async function init(fastify: FastifyInstance): Promise<void> {
    fastify.decorateRequest('twitterAPIService', null)
    fastify.addHook('onRequest', async (req) => {
        const { TwitterApiKey, TwitterApiKeySecret, TwitterAccessToken, TwitterAccessTokenSecret } = req.config
        req.twitterAPIService = new TwitterAPIService(TwitterApiKey, TwitterApiKeySecret, TwitterAccessToken, TwitterAccessTokenSecret)
    })
}

declare module 'fastify' {
    interface FastifyRequest {
        twitterAPIService: TwitterAPIService
    }
}

export default fp(init, { name: 'fastify-twitter-api' })
