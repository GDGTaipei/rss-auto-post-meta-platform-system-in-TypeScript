import { FetchAPIRepository } from '../repository/index.js'
import fetch, { Response }  from 'node-fetch';

export class FetchAPIRepositoryImplement implements FetchAPIRepository {
    private url: string = '';
    private apiToken: string = '';

    constructor(url: string, apiToken: string) { 
        this.url = url;
        this.apiToken = apiToken;
    }

    async getContent(path: string): Promise<Record<string, any>> {
        const response: Response = await fetch(`${this.url}/${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.apiToken
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as Record<string, any>;
    }

    async postContent(path: string, body: Record<string, any>): Promise<Record<string, any>> {
        const response: Response = await fetch(`${this.url}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.apiToken
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data as Record<string, any>;
    }
}  