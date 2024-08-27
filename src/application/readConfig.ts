import * as dotenv from 'dotenv';

dotenv.config();

export const facebookGraphAPIPath: string = 'https://graph.facebook.com';
export const facebookGraphAPIVersion: string = process.env.FACEBOOK_GRAPH_API_VERSION || '';
export const facebookApiToken: string = process.env.FACEBOOK_API_TOKEN || '';

export const instagramGraphAPIPath: string = 'https://graph.facebook.com';
export const instagramGraphAPIVersion: string = process.env.INSTAGRAM_GRAPH_API_VERSION || '';
export const instagramGraphApiToken: string = process.env.INSTAGRAM_GRAPH_API_TOKEN || '';

export const threadsGraphAPIPath: string = 'https://graph.threads.net';
export const threadsGraphAPIVersion: string = process.env.THREADS_GRAPH_API_VERSION || '';
export const threadsGraphApiToken: string = process.env.THREADS_GRAPH_API_TOKEN || '';
