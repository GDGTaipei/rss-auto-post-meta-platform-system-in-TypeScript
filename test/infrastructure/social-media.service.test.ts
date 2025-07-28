import { SocialMediaService } from '../../src/infrastructure/social-media.service.js';
import { SocialMediaPlatform } from '../../src/domain/models.js';
import { config } from '../../src/config/index.js';
import { FetchAPIRepositoryImplement } from '../../src/infrastructure/fetch-api.js';

jest.mock('../../src/infrastructure/fetch-api.js');

describe('SocialMediaService', () => {
    let service: SocialMediaService;
    let mockFetchAPI: jest.Mocked<FetchAPIRepositoryImplement>;

    const mockMessage = 'Test message';
    const mockImageUrl = 'https://test.com/image.jpg';
    const mockPostId = 'mock-post-id';
    const mockContainerId = 'mock-container-id';

    beforeEach(() => {
        mockFetchAPI = {
            url: 'mock-url',
            apiToken: 'mock-token',
            postContent: jest.fn(),
            getContent: jest.fn()
        } as unknown as jest.Mocked<FetchAPIRepositoryImplement>;

        (FetchAPIRepositoryImplement as jest.Mock).mockImplementation(() => mockFetchAPI);
        
        service = new SocialMediaService();
        jest.clearAllMocks();
    });

    describe('Facebook Posts', () => {
        it('should post to Facebook successfully', async () => {
            mockFetchAPI.postContent.mockResolvedValueOnce({ id: mockPostId });

            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.FACEBOOK
            });

            expect(result.success).toBe(true);
            expect(result.platform).toBe(SocialMediaPlatform.FACEBOOK);
            expect(result.postId).toBe(mockPostId);
            expect(mockFetchAPI.postContent).toHaveBeenCalledWith(
                `${config.facebook.pageId}/feed`,
                expect.objectContaining({
                    message: mockMessage,
                    published: "true"
                })
            );
        });

        it('should handle Facebook API errors', async () => {
            mockFetchAPI.postContent.mockRejectedValueOnce(new Error('HTTP error! status: 403'));

            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.FACEBOOK
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('HTTP error! status: 403');
        });
    });

    describe('Instagram Posts', () => {
        it('should reject posts without images', async () => {
            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.INSTAGRAM
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('Image URL is required for Instagram posts');
            expect(mockFetchAPI.postContent).not.toHaveBeenCalled();
        });

        it('should post to Instagram successfully', async () => {
            mockFetchAPI.postContent
                .mockResolvedValueOnce({ id: mockContainerId })
                .mockResolvedValueOnce({ id: mockPostId });

            const result = await service.post({
                message: mockMessage,
                imageUrl: mockImageUrl,
                platform: SocialMediaPlatform.INSTAGRAM
            });

            expect(result.success).toBe(true);
            expect(result.platform).toBe(SocialMediaPlatform.INSTAGRAM);
            expect(result.postId).toBe(mockPostId);

            expect(mockFetchAPI.postContent).toHaveBeenCalledWith(
                `${config.instagram.pageId}/media`,
                expect.objectContaining({
                    caption: mockMessage,
                    image_url: mockImageUrl
                })
            );

            expect(mockFetchAPI.postContent).toHaveBeenCalledWith(
                `${config.instagram.pageId}/media_publish`,
                expect.objectContaining({
                    creation_id: mockContainerId
                })
            );
        });

        it('should handle Instagram container creation errors', async () => {
            mockFetchAPI.postContent.mockRejectedValueOnce(new Error('HTTP error! status: 400'));

            const result = await service.post({
                message: mockMessage,
                imageUrl: mockImageUrl,
                platform: SocialMediaPlatform.INSTAGRAM
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('HTTP error! status: 400');
        });

        it('should handle Instagram publishing errors', async () => {
            mockFetchAPI.postContent
                .mockResolvedValueOnce({ id: mockContainerId })
                .mockRejectedValueOnce(new Error('HTTP error! status: 400'));

            const result = await service.post({
                message: mockMessage,
                imageUrl: mockImageUrl,
                platform: SocialMediaPlatform.INSTAGRAM
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('HTTP error! status: 400');
        });
    });

    describe('Threads Posts', () => {
        it('should post to Threads successfully', async () => {
            mockFetchAPI.postContent
                .mockResolvedValueOnce({ id: mockContainerId })
                .mockResolvedValueOnce({ id: mockPostId });

            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.THREADS
            });

            expect(result.success).toBe(true);
            expect(result.platform).toBe(SocialMediaPlatform.THREADS);
            expect(result.postId).toBe(mockPostId);

            expect(mockFetchAPI.postContent).toHaveBeenCalledWith(
                `${config.threads.userId}/threads`,
                expect.objectContaining({
                    text: mockMessage
                })
            );
        });

        it('should post to Threads with image', async () => {
            mockFetchAPI.postContent
                .mockResolvedValueOnce({ id: mockContainerId })
                .mockResolvedValueOnce({ id: mockPostId });

            const result = await service.post({
                message: mockMessage,
                imageUrl: mockImageUrl,
                platform: SocialMediaPlatform.THREADS
            });

            expect(result.success).toBe(true);
            expect(result.postId).toBe(mockPostId);

            expect(mockFetchAPI.postContent).toHaveBeenCalledWith(
                `${config.threads.userId}/threads`,
                expect.objectContaining({
                    text: mockMessage,
                    image_url: mockImageUrl
                })
            );
        });

        it('should handle Threads container creation errors', async () => {
            mockFetchAPI.postContent.mockRejectedValueOnce(new Error('HTTP error! status: 400'));

            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.THREADS
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('HTTP error! status: 400');
        });

        it('should handle Threads publishing errors', async () => {
            mockFetchAPI.postContent
                .mockResolvedValueOnce({ id: mockContainerId })
                .mockRejectedValueOnce(new Error('HTTP error! status: 400'));

            const result = await service.post({
                message: mockMessage,
                platform: SocialMediaPlatform.THREADS
            });

            expect(result.success).toBe(false);
            expect(result.error).toBe('HTTP error! status: 400');
        });
    });
}); 