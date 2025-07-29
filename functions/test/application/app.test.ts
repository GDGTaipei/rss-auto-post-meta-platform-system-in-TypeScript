import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { app, socialMediaPostFlow } from '../../src/application/app.js';
import { SocialMediaPlatform, PostResult } from '../../src/domain/models.js';
import {
    mockRssUrl,
    MockRssFeedService,
    MockContentGeneratorService,
    MockSocialMediaService,
    MockFailingSocialMediaService,
    mockPostResult
} from '../mock/index.js';

describe('Application', () => {
    let mockReq: Partial<Request>;
    let mockRes: {
        status: jest.Mock;
        send: jest.Mock;
    };
    let mockRssFeedService: MockRssFeedService;
    let mockContentGeneratorService: MockContentGeneratorService;
    let mockSocialMediaService: MockSocialMediaService;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        mockReq = {
            body: {}
        };

        // 初始化 mock 服務
        mockRssFeedService = new MockRssFeedService();
        mockContentGeneratorService = new MockContentGeneratorService();
        mockSocialMediaService = new MockSocialMediaService();

        // 重置所有 mock
        jest.clearAllMocks();
    });

    describe('GET /', () => {
        it('should return welcome message', () => {
            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/' && layer.route?.methods.get)
                ?.route.stack[0].handle;

            if (handler) {
                handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith('RSS Auto Post Meta Platform System');
        });
    });

    describe('POST /post', () => {
        it('should reject requests without RSS URL', () => {
            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.send).toHaveBeenCalledWith({ error: 'rssUrl is required' });
        });

        it('should process RSS feed and post to social media successfully', async () => {
            // 設置 mock 服務
            jest.spyOn(socialMediaPostFlow, 'exec').mockImplementation(async () => {
                const items = await mockRssFeedService.fetchItems(mockRssUrl);
                const content = await mockContentGeneratorService.generateContent(items[0].content);
                const result = await mockSocialMediaService.post({
                    platform: SocialMediaPlatform.FACEBOOK,
                    message: content,
                    imageUrl: items[0].imageUrl
                });
                return [result];
            });

            mockReq.body = { rssUrl: mockRssUrl };

            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                await handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({ platforms: [mockPostResult] });
            expect(socialMediaPostFlow.exec).toHaveBeenCalledWith(mockRssUrl);
        });

        it('should handle errors during processing', async () => {
            const mockFailingSocialMedia = new MockFailingSocialMediaService();
            
            jest.spyOn(socialMediaPostFlow, 'exec').mockImplementation(async () => {
                const items = await mockRssFeedService.fetchItems(mockRssUrl);
                const content = await mockContentGeneratorService.generateContent(items[0].content);
                const result = await mockFailingSocialMedia.post({
                    platform: SocialMediaPlatform.FACEBOOK,
                    message: content,
                    imageUrl: items[0].imageUrl
                });
                return [result];
            });

            mockReq.body = { rssUrl: mockRssUrl };

            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                await handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({
                platforms: [{
                    platform: SocialMediaPlatform.FACEBOOK,
                    success: false,
                    error: 'Mock error'
                }]
            });
            expect(socialMediaPostFlow.exec).toHaveBeenCalledWith(mockRssUrl);
        });

        it('should handle unexpected errors', async () => {
            const error = new Error('Unexpected error');
            jest.spyOn(socialMediaPostFlow, 'exec').mockRejectedValue(error);

            mockReq.body = { rssUrl: mockRssUrl };

            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                await handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith({ error: error.message });
            expect(socialMediaPostFlow.exec).toHaveBeenCalledWith(mockRssUrl);
        });
    });
}); 