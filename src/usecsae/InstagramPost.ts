import { InstagramProperties, MediaType } from '../entites'
import { InstagramServiceRepository } from '../repository'
import { InstagramServiceImplement } from '../service'

export class InstagramPostUseCase {
  private metaService: InstagramServiceRepository
  private postMessage: string
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(postMessage: string, replyMessage?: string) { 
    this.metaService = new InstagramServiceImplement()
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