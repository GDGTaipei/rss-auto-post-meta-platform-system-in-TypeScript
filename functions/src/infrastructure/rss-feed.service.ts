import { RssFeedItem, RssFeedPort } from '../domain/models.js';
import { XMLParser } from 'fast-xml-parser';

export class RssFeedService implements RssFeedPort {
    private getImageUrl(html: string | undefined): string | undefined {
        if (!html) {
            return undefined;
        }
        const regex = /<img[^>]+src=["']([^"']+)["']/;
        const match = html.match(regex);
        return match ? match[1] : undefined;
    }

    private dateFilter(inputDate: string): boolean {
        const eventDate = new Date(inputDate).getTime();
        const dateNow = new Date().getTime();
        const dateInterval = (eventDate - dateNow) / 86400000;
        return dateInterval >= -1 && dateInterval <= 0;
    }

    async fetchItems(url: string): Promise<RssFeedItem[]> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network error: ${response.status}`);
            }

            const xmlText = await response.text();
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseTagValue: true,
                parseAttributeValue: true,
                trimValues: true
            });

            let feed;
            try {
                feed = parser.parse(xmlText);
            } catch (error) {
                throw new Error('Invalid RSS format');
            }

            if (!feed.rss?.channel?.item) {
                throw new Error('Invalid RSS format: missing required elements');
            }

            const items = feed.rss.channel.item;
            const itemArray = Array.isArray(items) ? items : [items];

            return itemArray
                .filter(item => this.dateFilter(item.pubDate))
                .map(item => ({
                    title: item.title || '',
                    link: item.link || '',
                    pubDate: item.pubDate || '',
                    content: item['content:encoded'] || item.description || '',
                    contentSnippet: item.description || '',
                    imageUrl: this.getImageUrl(item['content:encoded'] || item.description)
                }));
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch RSS feed');
        }
    }
} 