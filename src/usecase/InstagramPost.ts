import { InstagramProperties, MediaType } from '../entities'
import { InstagramServiceRepository } from '../repository'

export class InstagramPostUseCase {
  private metaService: InstagramServiceRepository

  private postMessage?: string
  private postImage?: string
  private postVideo?: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  /**
   *  InstagramPostUseCase constructor
   * @description InstagramPostUseCase constructor, either `postImage` or `postVideo` must be provided
   * @param service : InstagramServiceRepository
   * @param postMessage 
   * @param postImage
   * @param postVideo
   * @param replyMessage 
   */
  constructor(service: InstagramServiceRepository, postMessage?: string, postImage?: string,postVideo?: string, replyMessage?: string) {
    this.metaService = service
    this.postMessage = postMessage
    this.postImage = postImage
    this.postVideo = postVideo
    this.replyMessage = replyMessage
  }

  private payloadCreator(inputMessage?:string, image_url?: string, video_url?: string): InstagramProperties {
    let payload: InstagramProperties = {
      media_type: MediaType.TEXT
    }

    if(image_url && video_url) {
      throw new Error('Cannot have both image and video in the same post')
    }

    if(image_url) {
      payload.image_url = image_url,
      payload.media_type = MediaType.IMAGE
    }else if(video_url) {
      payload.video_url = video_url
      payload.media_type = MediaType.VIDEO
    }

    if(inputMessage) {
      payload.caption = inputMessage
    } 

    return payload
  }

  async exec(): Promise<string[]> {

    if(!this.postImage && !this.postVideo) {
      throw new Error('Must have either image or video in the post')
    }else if(this.postImage && this.postVideo) {
      throw new Error('Cannot have both image and video in the same post')
    }

    const blogPost = this.payloadCreator(this.postMessage, this.postImage, this.postVideo)
    const postContainer = await this.metaService.createContainer(blogPost)
    this.postId = await this.metaService.sendContainer(postContainer)

    if(this.replyMessage) {
      this.replyId = await this.metaService.sendReply(this.postId, this.replyMessage)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}