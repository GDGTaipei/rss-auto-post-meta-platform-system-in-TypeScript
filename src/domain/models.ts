export interface RssFeedItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
    imageUrl?: string;
}

export interface SocialMediaPost {
    message: string;
    imageUrl?: string;
    platform: SocialMediaPlatform;
}

export enum SocialMediaPlatform {
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
    THREADS = 'THREADS'
}

export interface PostResult {
    platform: SocialMediaPlatform;
    success: boolean;
    postId?: string;
    error?: string;
}

export interface RssFeedPort {
    fetchItems(url: string): Promise<RssFeedItem[]>;
}

export interface ContentGeneratorPort {
    generateContent(article: string): Promise<string>;
}

export interface SocialMediaPort {
    post(content: SocialMediaPost): Promise<PostResult>;
}

export interface FetchAPIRepository {
    getContent(path: string): Promise<Record<string, any>>;
    postContent(path: string, body: Record<string, any>): Promise<Record<string, any>>;
} 