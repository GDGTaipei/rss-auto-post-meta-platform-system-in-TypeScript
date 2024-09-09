import { FacebookServiceRepository, FetchAPIRepository } from '../repository';
import * as dotenv from 'dotenv';
import { FacebookImageProperties, FacebookProperties } from '../entities';

dotenv.config();

export class FacebookServiceImplement implements FacebookServiceRepository {
  private pageId: string = process.env.FACEBOOK_PAGE_ID || '';
  private apiService: FetchAPIRepository;
  
  constructor(apiService: FetchAPIRepository) {
    this.apiService = apiService;
  }

  async createContainer(body: FacebookImageProperties): Promise<string> {

    if(!body.published && !body.scheduled_publish_time) {
      throw new Error('You must provide either scheduled_publish_time if not published immediately');
    }

    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/photos`, body as any as { [key: string]: string });
    return response.id;
  }

  async sendPost(body: FacebookProperties, photoIds?: string[]): Promise<string> {
    let payload = body;
    if(photoIds && photoIds.length !== 0) {
      payload.attached_media = photoIds.map((id) => ({ media_fbid: id }));
    }
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/feed`, body as any as { [key: string]: string });
    return response.id;
  }

  async sendReply(postId: string, body: FacebookProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${postId}/comments`, body as any as { [key: string]: string });
    return response.id;
  }
}