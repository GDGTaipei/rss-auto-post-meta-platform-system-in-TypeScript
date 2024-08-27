import { ThreadsProperties, MediaType } from '../entities'
import { ThreadsServiceRepository } from '../repository'

export class ThreadsPostUseCase {
  private metaService: ThreadsServiceRepository
  private postMessage: string
  private postImage?: string
  private postVideo?: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(service: ThreadsServiceRepository, postMessage: string, postImage?: string,postVideo?: string, replyMessage?: string) {
    this.metaService = service
    this.postMessage = postMessage
    this.postImage = postImage
    this.postVideo = postVideo
    this.replyMessage = replyMessage
  }

  /**
     * Text in single post cannot be more than 500 characters
     * #reference https://developers.facebook.com/docs/threads/overview/#limitations
     */
  private textValidator(inputMessage: string): void {
    if(!inputMessage) {
      throw new Error('Text cannot be empty')
    }
    
    if(inputMessage.length > 500) {
      throw new Error('Text cannot be more than 500 characters')
    }
  }

  private payloadCreator(inputMessage:string, image_url?: string, video_url?: string): ThreadsProperties {
    let payload: ThreadsProperties = {
      text: inputMessage,
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

    return payload
  }

  async exec(): Promise<string[]> {

    this.textValidator(this.postMessage)

    const blogPost = this.payloadCreator(this.postMessage, this.postImage, this.postVideo)
    const postContainer = await this.metaService.createContainer(blogPost)
    this.postId = await this.metaService.sendContainer(postContainer)

    if(this.replyMessage) {
      const replyPost = this.payloadCreator(this.replyMessage)
      replyPost.reply_to_id = this.postId
      const replyContainer = await this.metaService.createReplyContainer(replyPost)
      this.replyId = await this.metaService.sendContainer(replyContainer)
    }

    return [this.postId, this.replyId ? this.replyId : '']
  }
}