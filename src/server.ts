import Fastify, {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyLoggerOptions,
} from "fastify";
import fastifyEnv from "./plugin/env";
import fastifyI18n from "./plugin/i18n";
import FastifySensible from "fastify-sensible-deprecated";
import fastifyAuthEngine from "./plugin/auth";
import fastifyTwitterAPI from './plugin/twitterApi'
import { TwitterRouter } from "./service/twitter/route";
import  FastifyCors from "fastify-cors-deprecated";
import { v4 as uuidGen } from "uuid";
export default class Server {
  private _fastify: FastifyInstance;

  public constructor() {
    this._fastify = this.getServer();
    this.fastify.register(FastifySensible);
    this.fastify.register(fastifyEnv);
    this.fastify.register(fastifyI18n);
    this.fastify.register(fastifyAuthEngine);
    this.fastify.register(fastifyTwitterAPI)
    this.fastify.register(TwitterRouter.routes)
    this.fastify.register(FastifyCors, { origin: "*" });
  }

  public get fastify(): FastifyInstance {
    return this._fastify;
  }

  public async init(): Promise<void> {
    try {
      await this.fastify.ready();
    } catch (e) {
      this.fastify.log.fatal(`Unable to initialize plugins due to ${e}`);
      process.exit(1);
    }

    this.fastify.log.info(`\n${this.fastify.printRoutes()}`);
    this.fastify.listen(this.fastify.config.Port, "0.0.0.0", (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }

  private getServer(): FastifyInstance {
    return Fastify({
      logger: this.getLogger(),
      genReqId: () => {
        return uuidGen();
      },
    });
  }

  private getLogger(): FastifyLoggerInstance | FastifyLoggerOptions {
    return {
      prettyPrint: {
        translateTime: "SYS:h:MM:ss TT Z o",
        colorize: true,
        ignore: "pid,hostname",
      },
      level: "trace",
    };
  }
}
