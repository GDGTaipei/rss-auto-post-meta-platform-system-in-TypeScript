import { FacebookService } from '../repository';
import * as dotenv from 'dotenv';
dotenv.config();

export class FacebookServiceImplement implements FacebookService {
  private graphAPIPath: string = process.env.FACEBOOK_GRAPH_API_PATH || '';
  private graphAPIVersion: string = process.env.FACEBOOK_GRAPH_API_VERSION || '';

  constructor() {

  }
  async sendPost(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async  sendReply(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}