import { FetchAPIRepository } from '../repository'
import fetch, { Request, Response }  from 'node-fetch';

export class FetchAPIFetchAPIRepositoryImplement implements FetchAPIRepository {

  private url: string = '';
  private apiToken: string = '';

  constructor(url:string, apiToken:string){ 
    this.url = url;
    this.apiToken = apiToken;
  }

  async getContent(path:string, body: {[key:string]:string}): Promise<{ [key: string]: string }> {
    const response : Response = await fetch(`${this.url}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiToken
      },
      body: JSON.stringify(body)
    });
    const data: Record<string, string> = await response.json() as Record<string, string>;
    return data;
  }

  async postContent(path:string, body: {[key:string]:string}): Promise<{ [key: string]: string }> {
    const response : Response = await fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiToken
      },
      body: JSON.stringify(body)
    });
    const data: Record<string, string> = await response.json() as Record<string, string>;
    return data;
  }
}  