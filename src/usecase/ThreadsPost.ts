import { ThreadsProperties, MediaType } from '../entities'
import { FetchAPIRepository, ThreadsServiceRepository } from '../repository'
import { ThreadsServiceImplement } from '../service'
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import * as dotenv from 'dotenv';

dotenv.config();

export class ThreadsPostUseCase {
  private apiService: FetchAPIRepository
  private metaService: ThreadsServiceRepository
  private graphAPIPath: string = 'https://graph.threads.net';
  private graphAPIVersion: string = process.env.THREADS_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.THREADS_GRAPH_API_VERSION || '';
  private postMessage: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(postMessage: string, replyMessage?: string) { 
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken)
    this.metaService = new ThreadsServiceImplement(this.apiService)
    this.postMessage = postMessage
    this.replyMessage = replyMessage
  }

  private payloadCreator(inputMessage:string, image_url?: string, video_url?: string, replyId?: string): ThreadsProperties {
    let payload: ThreadsProperties = {
      text: inputMessage,
      media_type: MediaType.TEXT
    }

    if(image_url) {
      payload.image_url = image_url,
      payload.media_type = MediaType.IMAGE
    }else if(video_url) {
      payload.video_url = video_url
      payload.media_type = MediaType.VIDEO
    }

    if(replyId){
      payload.reply_to_id = replyId
    }

    return payload
  }

  async exec(): Promise<string[]> {

    const blogPost = this.payloadCreator(this.postMessage)
    const postContainer = await this.metaService.createContainer(blogPost)
    this.postId = await this.metaService.sendContainer(postContainer)

    if(this.replyMessage) {
      const replyPost = this.payloadCreator(this.replyMessage)
      this.replyId = await this.metaService.createReplyContainer(replyPost)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}