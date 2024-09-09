import { InstagramProperties, MediaType } from '../entities'
import { FetchAPIRepository, InstagramServiceRepository, socialPlatformCommonUseCase } from '../repository'
import { InstagramServiceImplement } from '../service'
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import * as dotenv from 'dotenv';

dotenv.config();

export class InstagramPostUseCase implements socialPlatformCommonUseCase {
  private metaService: InstagramServiceRepository

  private postMessage: string
  private postImage?: string
  private postVideo?: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(apiService: InstagramServiceRepository, postMessage: string, postImage?: string, postVideo?:string, replyMessage?: string) { 
    this.metaService = apiService
    this.postMessage = postMessage
    this.postImage = postImage
    this.postVideo = postVideo
    this.replyMessage = replyMessage
  }

  isContentValid(){
    if(this.postImage && this.postVideo) {
      throw new Error('Cannot have both image and video in the same post')
    }

    if(!this.postImage && !this.postVideo) {
      throw new Error('Must have either image or video in the post')
    }
  }

  payloadCreator(inputMessage:string, image_url?: string, video_url?: string): InstagramProperties {
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
    this.isContentValid()
    const blogPost = this.payloadCreator(this.postMessage, this.postImage, this.postVideo)
    const postContainer = await this.metaService.createContainer(blogPost)
    this.postId = await this.metaService.sendContainer(postContainer)

    if(this.replyMessage) {
      this.replyId = await this.metaService.sendReply(this.postId, this.replyMessage)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}