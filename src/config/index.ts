import * as dotenv from 'dotenv';

dotenv.config();

interface SocialMediaConfig {
    pageId: string;
    accessToken: string;
}

export interface Config {
    socialMediaPostApiUrl: string;
    facebook: SocialMediaConfig;
    instagram: {
        pageId: string;
        accessToken: string;
    };
    threads: {
        userId: string;
        clientSecret: string;
        shortLivedToken: string;
        accessToken: string;
    };
    meta: {
        apiVersion: string;
        baseUrl: string;
    };
}

export const config: Config = {
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
}; 