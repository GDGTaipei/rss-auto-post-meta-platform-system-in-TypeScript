import { FacebookServiceRepository, FetchAPIRepository } from '../repository';
import * as dotenv from 'dotenv';
import { FacebookProperties } from '../entities';

dotenv.config();

export class FacebookServiceImplement implements FacebookServiceRepository {
  private pageId: string = process.env.FACEBOOK_PAGE_ID || '';
  private apiService: FetchAPIRepository;
  
  constructor(apiService: FetchAPIRepository) {
    this.apiService = apiService;
  }

  async sendPost(body: FacebookProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/feed`, body as any as { [key: string]: string });
    return response.id;
  }

  async sendReply(postId: string, body: FacebookProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${postId}/comments`, body as any as { [key: string]: string });
    return response.id;
  }
}