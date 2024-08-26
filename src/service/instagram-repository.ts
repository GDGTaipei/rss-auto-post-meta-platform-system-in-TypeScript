import { InstagramServiceRepository, FetchAPIRepository } from '../repository';
import * as dotenv from 'dotenv';
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import { InstagramProperties } from '../entities';

dotenv.config();

export class InstagramServiceImplement implements InstagramServiceRepository {
  private graphAPIPath: string = 'https://graph.facebook.com';
  private graphAPIVersion: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';
  private pageId: string = process.env.INSTAGRAM_PAGE_IG || '';
  private apiService: FetchAPIRepository;

  constructor() {
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken);
  }
  async createContainer(body: InstagramProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/media`, body as any as { [key: string]: string });
    return response.id;
  }
  async sendContainer(containerId:string): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/media_publish`, {"creation_id": containerId});
    return response.id;
  }
  async sendReply(mediaId:string, message:string): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${mediaId}/comments`, {message});
    return response.id;
  }
}