import { ThreadsService  } from '../repository/service';
import * as dotenv from 'dotenv';
dotenv.config();

export class ThreadsServiceImplement implements ThreadsService {
  private graphAPIPath: string = process.env.THREADS_GRAPH_API_PATH || '';
  private graphAPIVersion: string = process.env.THREADS_GRAPH_API_VERSION || '';
  constructor() {

  }
  async createContainer(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async sendContainer(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async sendReply(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}