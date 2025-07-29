import { ContentGeneratorPort } from '../domain/models.js';
import { config } from '../config/index.js';

export class ContentGeneratorService implements ContentGeneratorPort {
    async generateContent(article: string): Promise<string> {
        const response = await fetch(`${config.socialMediaPostApiUrl}/generateSocialMediaContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article })
        });

        if (!response.ok) {
            throw new Error(`Failed to generate social media content${response.statusText ? ': ' + response.statusText : ''}`);
        }

        const data = await response.json();
        if (!data.content) {
            throw new Error('Invalid API response: missing content field');
        }

        return data.content;
    }
} 