import { InstagramProperties, MediaType } from '../entities'
import { FetchAPIRepository, InstagramServiceRepository } from '../repository'
import { InstagramServiceImplement } from '../service'
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import * as dotenv from 'dotenv';

dotenv.config();

export class InstagramPostUseCase {
  private apiService: FetchAPIRepository
  private metaService: InstagramServiceRepository
  private graphAPIPath: string = 'https://graph.facebook.com';
  private graphAPIVersion: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';

  private postMessage: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(postMessage: string, replyMessage?: string) { 
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken)
    this.metaService = new InstagramServiceImplement(this.apiService)
    this.postMessage = postMessage
    this.replyMessage = replyMessage
  }

  private payloadCreator(inputMessage:string, image_url?: string, video_url?: string): InstagramProperties {
    let payload: InstagramProperties = {
      caption: inputMessage,
      media_type: MediaType.TEXT
    }

    if(image_url) {
      payload.image_url = image_url,
      payload.media_type = MediaType.IMAGE
    }else if(video_url) {
      payload.video_url = video_url
      payload.media_type = MediaType.VIDEO
    }

    return payload
  }

  async exec(): Promise<string[]> {

    const blogPost = this.payloadCreator(this.postMessage)
    const postContainer = await this.metaService.createContainer(blogPost)
    this.postId = await this.metaService.sendContainer(postContainer)

    if(this.replyMessage) {
      this.replyId = await this.metaService.sendReply(this.postId, this.replyMessage)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}