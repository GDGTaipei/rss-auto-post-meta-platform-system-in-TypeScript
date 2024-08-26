import { ThreadsServiceRepository, FetchAPIRepository } from '../repository';
import * as dotenv from 'dotenv';
import { FetchAPIFetchAPIRepositoryImplement } from '../infrastructure';
import { ThreadsProperties, ThreadsReplyProperties } from '../entities';

dotenv.config();

export class ThreadsServiceImplement implements ThreadsServiceRepository {
  private graphAPIPath: string = 'https://graph.threads.net';
  private graphAPIVersion: string = process.env.THREADS_GRAPH_API_VERSION || '';
  private apiToken: string = process.env.THREADS_GRAPH_API_VERSION || '';
  private pageId: string = process.env.THREADS_PAGE_IG || '';
  private apiService: FetchAPIRepository;

  constructor() {
    this.apiService = new FetchAPIFetchAPIRepositoryImplement(`${this.graphAPIPath}/${this.graphAPIVersion}`, this.apiToken);
  }

  async createContainer(body: ThreadsProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/threads`, body as any as { [key: string]: string });
    return response.id;
  }

  async sendContainer(containerId:string): Promise<string> {
    const body = { "creation_id": containerId}
    const response: {[key: string]: string} = await this.apiService.postContent(`${this.pageId}/media_publish`, body);
    return response.id;
  }
  
  async createReplyContainer(body: ThreadsReplyProperties): Promise<string> {
    const response: {[key: string]: string} = await this.apiService.postContent(`/me/threads`, body as any as { [key: string]: string });
    return response.id;
  }
}