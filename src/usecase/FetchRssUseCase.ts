import Parser from 'rss-parser';

export class FetchRssUseCase {
    private rssUrl: string;

    constructor(rssUrl: string) {
        this.rssUrl = rssUrl;
    }

    private dateFilter(inputDate: string): boolean {
        const eventDate = new Date(inputDate).getTime();
        const dateNow = new Date().getTime();
        const dateInterval = (eventDate - dateNow) / 86400000;
        return dateInterval >= -1 && dateInterval <= 0;
    }

    private getImageUrl(html: string | undefined): string | undefined {
        if (!html) {
            return undefined;
        }
        const regex = /<img[^>]+src=["']([^"']+)["']/;
        const match = html.match(regex);
        return match ? match[1] : undefined;
    }

    async exec() {
        const parser = new Parser();
        const feed = await parser.parseURL(this.rssUrl);

        const items = feed.items
            .filter(item => this.dateFilter(item.pubDate!))
            .map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.content,
                contentSnippet: item.contentSnippet,
                imageUrl: this.getImageUrl(item.content)
            }));

        return items;
    }
} 