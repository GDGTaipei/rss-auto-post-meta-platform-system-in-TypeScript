import { RssFeedService } from '../../src/infrastructure/rss-feed.service.js';
import { mockRssUrl, mockImageUrl } from '../mock/index.js';

describe('RssFeedService', () => {
    let service: RssFeedService;

    beforeEach(() => {
        service = new RssFeedService();
        jest.clearAllMocks();
    });

    describe('fetchItems', () => {
        it('should fetch and parse RSS feed with images', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue(`
                    <?xml version="1.0" encoding="UTF-8"?>
                    <rss version="2.0">
                        <channel>
                            <item>
                                <title>Test Article</title>
                                <link>https://test.com/article</link>
                                <pubDate>${new Date().toISOString()}</pubDate>
                                <content:encoded><![CDATA[<p>Test content with <img src="${mockImageUrl}" /></p>]]></content:encoded>
                                <description>Test content</description>
                            </item>
                        </channel>
                    </rss>
                `)
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const items = await service.fetchItems(mockRssUrl);

            expect(items).toHaveLength(1);
            expect(items[0]).toEqual(expect.objectContaining({
                title: 'Test Article',
                link: 'https://test.com/article',
                content: expect.stringContaining('Test content'),
                contentSnippet: 'Test content',
                imageUrl: mockImageUrl
            }));

            expect(global.fetch).toHaveBeenCalledWith(mockRssUrl);
        });

        it('should filter out old articles', async () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 3);

            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue(`
                    <?xml version="1.0" encoding="UTF-8"?>
                    <rss version="2.0">
                        <channel>
                            <item>
                                <title>Old Article</title>
                                <link>https://test.com/old-article</link>
                                <pubDate>${oldDate.toISOString()}</pubDate>
                                <content:encoded><![CDATA[<p>Old content</p>]]></content:encoded>
                                <description>Old content</description>
                            </item>
                        </channel>
                    </rss>
                `)
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const items = await service.fetchItems(mockRssUrl);

            expect(items).toHaveLength(0);
        });

        it('should handle RSS feed without images', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue(`
                    <?xml version="1.0" encoding="UTF-8"?>
                    <rss version="2.0">
                        <channel>
                            <item>
                                <title>Test Article</title>
                                <link>https://test.com/article</link>
                                <pubDate>${new Date().toISOString()}</pubDate>
                                <content:encoded><![CDATA[<p>Test content without image</p>]]></content:encoded>
                                <description>Test content</description>
                            </item>
                        </channel>
                    </rss>
                `)
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const items = await service.fetchItems(mockRssUrl);

            expect(items[0].imageUrl).toBeUndefined();
        });

        it('should handle fetch errors', async () => {
            const mockResponse = {
                ok: false,
                status: 404
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.fetchItems(mockRssUrl)).rejects.toThrow('Network error: 404');
        });

        it('should handle invalid RSS format', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue('Invalid XML')
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.fetchItems(mockRssUrl)).rejects.toThrow();
        });
    });
}); 