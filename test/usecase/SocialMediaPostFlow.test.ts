import { SocialMediaPostFlow } from '../../src/usecase/SocialMediaPostFlow';
import { SocialMediaPlatform } from '../../src/domain/models';
import { 
    MockRssFeedService, 
    MockContentGeneratorService, 
    MockSocialMediaService,
    MockFailingSocialMediaService
} from '../mock';

describe('SocialMediaPostFlow', () => {
    let flow: SocialMediaPostFlow;
    let mockRssFeed: MockRssFeedService;
    let mockContentGenerator: MockContentGeneratorService;
    let mockSocialMedia: MockSocialMediaService;

    const mockRssUrl = 'https://test.com/feed.xml';

    beforeEach(() => {
        mockRssFeed = new MockRssFeedService();
        mockContentGenerator = new MockContentGeneratorService();
        mockSocialMedia = new MockSocialMediaService();
        flow = new SocialMediaPostFlow(mockRssFeed, mockContentGenerator, mockSocialMedia);
    });

    it('should process RSS feed and post to all platforms', async () => {
        const results = await flow.exec(mockRssUrl);

        // Should have 3 results (Facebook, Instagram, Threads)
        expect(results).toHaveLength(3);

        // Verify each platform result
        const [facebook, instagram, threads] = results;

        expect(facebook).toEqual({
            platform: SocialMediaPlatform.FACEBOOK,
            success: true,
            postId: 'mock-post-id'
        });

        expect(instagram).toEqual({
            platform: SocialMediaPlatform.INSTAGRAM,
            success: true,
            postId: 'mock-post-id'
        });

        expect(threads).toEqual({
            platform: SocialMediaPlatform.THREADS,
            success: true,
            postId: 'mock-post-id'
        });
    });

    it('should handle RSS feed fetch errors', async () => {
        jest.spyOn(mockRssFeed, 'fetchItems').mockRejectedValue(new Error('RSS fetch failed'));
        const results = await flow.exec(mockRssUrl);
        expect(results).toHaveLength(0);
    });

    it('should handle content generation errors', async () => {
        jest.spyOn(mockContentGenerator, 'generateContent').mockRejectedValue(new Error('Content generation failed'));
        const results = await flow.exec(mockRssUrl);
        expect(results).toHaveLength(0);
    });

    it('should handle social media post errors', async () => {
        const mockFailingSocialMedia = new MockFailingSocialMediaService();
        flow = new SocialMediaPostFlow(mockRssFeed, mockContentGenerator, mockFailingSocialMedia);

        const results = await flow.exec(mockRssUrl);

        expect(results).toHaveLength(3);
        results.forEach(result => {
            expect(result.success).toBe(false);
            expect(result.error).toBe('Mock error');
        });
    });

    it('should continue processing remaining items when one fails', async () => {
        // Mock two RSS items
        jest.spyOn(mockRssFeed, 'fetchItems').mockResolvedValue([
            {
                title: 'Test 1',
                link: 'https://test.com/1',
                pubDate: new Date().toISOString(),
                content: 'Test content 1',
                contentSnippet: 'Test content 1',
                imageUrl: 'https://test.com/image1.jpg'
            },
            {
                title: 'Test 2',
                link: 'https://test.com/2',
                pubDate: new Date().toISOString(),
                content: 'Test content 2',
                contentSnippet: 'Test content 2',
                imageUrl: 'https://test.com/image2.jpg'
            }
        ]);

        // Make content generation fail for the first item
        jest.spyOn(mockContentGenerator, 'generateContent')
            .mockRejectedValueOnce(new Error('Failed for first item'))
            .mockResolvedValueOnce('Generated content for second item');

        const results = await flow.exec(mockRssUrl);

        // Should still have results from the second item
        expect(results).toHaveLength(3);
        results.forEach(result => {
            expect(result.success).toBe(true);
        });
    });

    it('should handle empty RSS feed', async () => {
        jest.spyOn(mockRssFeed, 'fetchItems').mockResolvedValue([]);
        const results = await flow.exec(mockRssUrl);
        expect(results).toHaveLength(0);
    });
}); 