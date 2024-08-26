import { FacebookServiceRepository, FetchAPIRepository } from '../repository';
import * as dotenv from 'dotenv';
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import { FacebookProperties } from '../entites';

dotenv.config();

export class FacebookServiceImplement implements FacebookServiceRepository {
  private graphAPIPath: string = 'https://graph.facebook.com';
  private graphAPIVersion: string = process.env.FACEBOOK_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.FACEBOOK_API_TOKEN || '';
  private pageId: string = process.env.FACEBOOK_PAGE_ID || '';
  private apiService: FetchAPIRepository;
  
  constructor() {
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken);
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