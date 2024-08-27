import { FacebookProperties } from '../entities'
import { FacebookServiceRepository } from '../repository'

export class FacebookPostUseCase {
  private metaService: FacebookServiceRepository
  private postMessage: string
  private scheduled_publish_time?: number
  private replyMessage?: string
  private postId!: string
  private replyId?: string

  constructor(service: FacebookServiceRepository, postMessage: string, scheduled_publish_time?: number, replyMessage?: string) {
    this.metaService = service
    this.postMessage = postMessage
    this.scheduled_publish_time = scheduled_publish_time 
    this.replyMessage = replyMessage
  }

  private payloadCreator(inputMessage:string): FacebookProperties {
    let payload: FacebookProperties = {
      message: inputMessage,
      published: this.scheduled_publish_time? false : true
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