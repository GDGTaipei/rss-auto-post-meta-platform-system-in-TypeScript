import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { app, socialMediaPostFlow } from '../../src/application/app.js';
import { SocialMediaPlatform, PostResult } from '../../src/domain/models.js';

describe('Application', () => {
    const mockRssUrl = 'https://test.com/feed.xml';
    let mockReq: Partial<Request>;
    let mockRes: {
        status: jest.Mock;
        send: jest.Mock;
    };

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        mockReq = {
            body: {}
        };

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
            const expectedResults: PostResult[] = [
                {
                    platform: SocialMediaPlatform.FACEBOOK,
                    success: true,
                    postId: 'mock-post-id'
                }
            ];

            jest.spyOn(socialMediaPostFlow, 'exec').mockResolvedValue(expectedResults);

            mockReq.body = { rssUrl: mockRssUrl };

            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                await handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({ platforms: expectedResults });
            expect(socialMediaPostFlow.exec).toHaveBeenCalledWith(mockRssUrl);
        });

        it('should handle errors during processing', async () => {
            const expectedResults: PostResult[] = [
                {
                    platform: SocialMediaPlatform.FACEBOOK,
                    success: false,
                    error: 'Mock error'
                }
            ];

            jest.spyOn(socialMediaPostFlow, 'exec').mockResolvedValue(expectedResults);

            mockReq.body = { rssUrl: mockRssUrl };

            const handler = app._router.stack
                .find((layer: any) => layer.route?.path === '/post' && layer.route?.methods.post)
                ?.route.stack[0].handle;

            if (handler) {
                await handler(mockReq as Request, mockRes as unknown as Response);
            }

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.send).toHaveBeenCalledWith({ platforms: expectedResults });
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