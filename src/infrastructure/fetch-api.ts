import { fetchAPI } from '../repository'
import fetch, { Request, Response }  from 'node-fetch';

export class fetchAPIImplement implements fetchAPI {

  private url: string = '';
  private apiToken: string = '';

  constructor(url:string,headers:string,body:string){ 
    this.url = url;
    this.apiToken = headers;
  }

  async getContent(path:string, body: string): Promise<{ [key: string]: string }> {
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

  async postContent(path:string, body: string): Promise<{ [key: string]: string }> {
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