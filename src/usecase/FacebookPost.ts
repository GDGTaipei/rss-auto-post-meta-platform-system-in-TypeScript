import { FacebookProperties } from '../entities'
import { FacebookServiceRepository, FetchAPIRepository } from '../repository'
import { FacebookServiceImplement } from '../service'
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import * as dotenv from 'dotenv';

dotenv.config();

export class FacebookPostUseCase {
  private apiService: FetchAPIRepository
  private graphAPIPath: string = 'https://graph.facebook.com';
  private graphAPIVersion: string = process.env.FACEBOOK_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.FACEBOOK_API_TOKEN || '';
  private metaService: FacebookServiceRepository
  private postMessage: string
  private scheduled_publish_time?: number
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(postMessage: string, scheduled_publish_time?: number, replyMessage?: string) {
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken)
    this.metaService = new FacebookServiceImplement(this.apiService)
    this.postMessage = postMessage
    this.scheduled_publish_time = scheduled_publish_time 
    this.replyMessage = replyMessage
  }

  private payloadCreator(inputMessage:string): FacebookProperties {
    let payload: FacebookProperties = {
      message: inputMessage,
      published: this.scheduled_publish_time ? true : false
    }

    if(this.scheduled_publish_time) {
      payload.scheduled_publish_time = this.scheduled_publish_time
    }

    return payload
  }

  async exec(): Promise<string[]> {

    const blogPost = this.payloadCreator(this.postMessage)
    this.postId = await this.metaService.sendPost(blogPost)

    if(this.replyMessage) {
      const blogReply = this.payloadCreator(this.replyMessage)
      this.replyId = await this.metaService.sendReply(this.postId, blogReply)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}