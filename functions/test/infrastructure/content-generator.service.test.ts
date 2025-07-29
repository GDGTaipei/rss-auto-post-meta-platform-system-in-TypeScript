import { ContentGeneratorService } from '../../src/infrastructure/content-generator.service.js';
import { config } from '../../src/config/index.js';

describe('ContentGeneratorService', () => {
    let service: ContentGeneratorService;
    const mockArticle = 'Test article content';

    beforeEach(() => {
        service = new ContentGeneratorService();
        jest.clearAllMocks();
    });

    describe('generateContent', () => {
        it('should generate content successfully', async () => {
            const mockGeneratedContent = 'Generated social media content';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ content: mockGeneratedContent })
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            const content = await service.generateContent(mockArticle);

            expect(content).toBe(mockGeneratedContent);
            expect(global.fetch).toHaveBeenCalledWith(
                `${config.socialMediaPostApiUrl}/generateSocialMediaContent`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ article: mockArticle })
                }
            );
        });

        it('should handle API errors with status text', async () => {
            const mockResponse = {
                ok: false,
                statusText: 'Internal Server Error'
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.generateContent(mockArticle))
                .rejects
                .toThrow('Failed to generate social media content: Internal Server Error');
        });

        it('should handle API errors without status text', async () => {
            const mockResponse = {
                ok: false,
                statusText: ''
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.generateContent(mockArticle))
                .rejects
                .toThrow('Failed to generate social media content');
        });

        it('should handle network errors', async () => {
            const networkError = new Error('Network error');
            global.fetch = jest.fn().mockRejectedValue(networkError);

            await expect(service.generateContent(mockArticle))
                .rejects
                .toThrow(networkError);
        });

        it('should handle invalid API response', async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({}) // Missing content field
            };

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await expect(service.generateContent(mockArticle))
                .rejects
                .toThrow('Invalid API response: missing content field');
        });
    });
}); 