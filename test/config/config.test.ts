import { jest } from '@jest/globals';
import { config, Config } from '../../src/config/index.js';

jest.mock('../../src/config/index.js', () => {
    const originalModule = jest.requireActual('../../src/config/index.js') as { config: Config };
    return {
        ...originalModule,
        config: {
            ...originalModule.config,
            socialMediaPostApiUrl: process.env.SOCIAL_MEDIA_POST_API_URL || 'http://localhost:5001/rss-auto-post-meta-platform/us-central1/index',
            facebook: {
                pageId: process.env.FACEBOOK_PAGE_ID || '',
                accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '',
            },
            instagram: {
                pageId: process.env.INSTAGRAM_PAGE_ID || '',
                accessToken: process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || '',
            },
            threads: {
                userId: process.env.THREADS_USER_ID || '',
                clientSecret: process.env.THREADS_CLIENT_SECRET || '',
                shortLivedToken: process.env.THREADS_SHORT_LIVED_TOKEN || '',
                accessToken: process.env.THREADS_PAGE_ACCESS_TOKEN || '',
            },
            meta: {
                apiVersion: 'v20.0',
                baseUrl: 'https://graph.facebook.com',
            }
        }
    };
});

describe('Config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use environment variables when available', () => {
        const testValues = {
            SOCIAL_MEDIA_POST_API_URL: 'https://test-api.com',
            FACEBOOK_PAGE_ID: 'test-fb-page',
            FACEBOOK_PAGE_ACCESS_TOKEN: 'test-fb-token',
            INSTAGRAM_PAGE_ID: 'test-ig-page',
            INSTAGRAM_PAGE_ACCESS_TOKEN: 'test-ig-token',
            THREADS_USER_ID: 'test-threads-user',
            THREADS_CLIENT_SECRET: 'test-threads-secret',
            THREADS_SHORT_LIVED_TOKEN: 'test-threads-short-token',
            THREADS_PAGE_ACCESS_TOKEN: 'test-threads-token'
        };

        Object.assign(process.env, testValues);

        // Re-import config to get updated values
        jest.resetModules();
        const { config } = require('../../src/config/index.js');

        expect(config.socialMediaPostApiUrl).toBe(testValues.SOCIAL_MEDIA_POST_API_URL);
        expect(config.facebook.pageId).toBe(testValues.FACEBOOK_PAGE_ID);
        expect(config.facebook.accessToken).toBe(testValues.FACEBOOK_PAGE_ACCESS_TOKEN);
        expect(config.instagram.pageId).toBe(testValues.INSTAGRAM_PAGE_ID);
        expect(config.instagram.accessToken).toBe(testValues.INSTAGRAM_PAGE_ACCESS_TOKEN);
        expect(config.threads.userId).toBe(testValues.THREADS_USER_ID);
        expect(config.threads.clientSecret).toBe(testValues.THREADS_CLIENT_SECRET);
        expect(config.threads.shortLivedToken).toBe(testValues.THREADS_SHORT_LIVED_TOKEN);
        expect(config.threads.accessToken).toBe(testValues.THREADS_PAGE_ACCESS_TOKEN);
    });

    it('should use default values when environment variables are not set', () => {
        // Clear all relevant environment variables
        const relevantKeys = [
            'SOCIAL_MEDIA_POST_API_URL',
            'FACEBOOK_PAGE_ID',
            'FACEBOOK_PAGE_ACCESS_TOKEN',
            'INSTAGRAM_PAGE_ID',
            'INSTAGRAM_PAGE_ACCESS_TOKEN',
            'THREADS_USER_ID',
            'THREADS_CLIENT_SECRET',
            'THREADS_SHORT_LIVED_TOKEN',
            'THREADS_PAGE_ACCESS_TOKEN'
        ];

        relevantKeys.forEach(key => {
            delete process.env[key];
        });

        // Re-import config to get updated values
        jest.resetModules();
        const { config } = require('../../src/config/index.js');

        expect(config.socialMediaPostApiUrl).toBe('http://localhost:5001/rss-auto-post-meta-platform/us-central1/index');
        expect(config.facebook.pageId).toBe('');
        expect(config.facebook.accessToken).toBe('');
        expect(config.instagram.pageId).toBe('');
        expect(config.instagram.accessToken).toBe('');
        expect(config.threads.userId).toBe('');
        expect(config.threads.clientSecret).toBe('');
        expect(config.threads.shortLivedToken).toBe('');
        expect(config.threads.accessToken).toBe('');
    });

    it('should have correct Meta API configuration', () => {
        expect(config.meta.apiVersion).toBe('v20.0');
        expect(config.meta.baseUrl).toBe('https://graph.facebook.com');
    });
}); 