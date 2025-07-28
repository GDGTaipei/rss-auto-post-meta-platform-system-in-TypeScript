import { RssFeedPort, ContentGeneratorPort, SocialMediaPort, SocialMediaPost, PostResult, RssFeedItem, SocialMediaPlatform } from '../../src/domain/models.js';

export class MockRssFeedService implements RssFeedPort {
    private mockItems: RssFeedItem[] = [
        {
            title: 'Test Article',
            link: 'https://test.com/article',
            pubDate: new Date().toISOString(),
            content: '<p>Test content with <img src="https://test.com/image.jpg" /></p>',
            contentSnippet: 'Test content',
            imageUrl: 'https://test.com/image.jpg'
        }
    ];

    async fetchItems(url: string): Promise<RssFeedItem[]> {
        return this.mockItems;
    }
}

export class MockContentGeneratorService implements ContentGeneratorPort {
    async generateContent(article: string): Promise<string> {
        return `Generated content for: ${article}`;
    }
}

export class MockSocialMediaService implements SocialMediaPort {
    async post(content: SocialMediaPost): Promise<PostResult> {
        return {
            platform: content.platform,
            success: true,
            postId: 'mock-post-id'
        };
    }
}

export class MockFailingSocialMediaService implements SocialMediaPort {
    async post(content: SocialMediaPost): Promise<PostResult> {
        return {
            platform: content.platform,
            success: false,
            error: 'Mock error'
        };
    }
}

export class MockFetchAPIRepository {
    async getContent(path: string): Promise<Record<string, any>> {
        return { id: 'mock-id', success: true };
    }

    async postContent(path: string, body: Record<string, any>): Promise<Record<string, any>> {
        return { id: 'mock-id', success: true };
    }
}

export const mockRssUrl = 'https://test.com/feed.xml';
export const mockImageUrl = 'https://test.com/image.jpg';
export const mockMessage = 'Test message';

export const mockPostResult: PostResult = {
    platform: SocialMediaPlatform.FACEBOOK,
    success: true,
    postId: 'mock-post-id'
};