import { InstagramService  } from '../repository/service';
import * as dotenv from 'dotenv';
dotenv.config();

export class InstagramServiceImplement implements InstagramService {
  private graphAPIPath: string = process.env.INSTAGRAM_GRAPH_API_PATH || '';
  private graphAPIVersion: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';

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