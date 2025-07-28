import { RssFeedPort, ContentGeneratorPort, SocialMediaPort, PostResult, SocialMediaPlatform } from '../domain/models.js';

export class SocialMediaPostFlow {
    constructor(
        private readonly rssFeedService: RssFeedPort,
        private readonly contentGenerator: ContentGeneratorPort,
        private readonly socialMediaService: SocialMediaPort
    ) {}

    async exec(rssUrl: string): Promise<PostResult[]> {
        // 1. Fetch RSS content
        const items = await this.rssFeedService.fetchItems(rssUrl);
        const results: PostResult[] = [];

        for (const item of items) {
            try {
                // 2. Generate social media content
                const message = await this.contentGenerator.generateContent(item.contentSnippet);

                // 3. Post to all platforms
                const postPromises = [
                    this.socialMediaService.post({
                        message,
                        platform: SocialMediaPlatform.FACEBOOK
                    }),
                    this.socialMediaService.post({
                        message,
                        imageUrl: item.imageUrl,
                        platform: SocialMediaPlatform.INSTAGRAM
                    }),
                    this.socialMediaService.post({
                        message,
                        imageUrl: item.imageUrl,
                        platform: SocialMediaPlatform.THREADS
                    })
                ];

                const platformResults = await Promise.all(postPromises);
                results.push(...platformResults);
            } catch (error) {
                console.error('Error processing RSS item:', error);
            }
        }

        return results;
    }
} 