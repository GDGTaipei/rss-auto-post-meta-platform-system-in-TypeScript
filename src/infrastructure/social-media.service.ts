import { SocialMediaPost, PostResult, SocialMediaPort, SocialMediaPlatform } from '../domain/models.js';
import { FetchAPIFetchAPIRepositoryImplement } from './fetch-api.js';
import { config } from '../config/index.js';

interface MetaApiResponse {
    id: string;
    [key: string]: any;
}

export class SocialMediaService implements SocialMediaPort {
    async post(content: SocialMediaPost): Promise<PostResult> {
        const fetchAPIRepository = new FetchAPIFetchAPIRepositoryImplement(
            `${config.meta.baseUrl}/${config.meta.apiVersion}`,
            this.getAccessToken(content.platform)
        );

        try {
            switch (content.platform) {
                case SocialMediaPlatform.FACEBOOK: {
                    const response = await fetchAPIRepository.postContent(
                        `${config.facebook.pageId}/feed`,
                        {
                            message: content.message,
                            published: "true"  // Meta API expects a string
                        }
                    ) as MetaApiResponse;

                    return {
                        platform: content.platform,
                        success: true,
                        postId: response.id
                    };
                }
                case SocialMediaPlatform.INSTAGRAM: {
                    if (!content.imageUrl) {
                        return {
                            platform: content.platform,
                            success: false,
                            error: 'Image URL is required for Instagram posts'
                        };
                    }

                    // 1. Create container
                    const containerResponse = await fetchAPIRepository.postContent(
                        `${config.instagram.pageId}/media`,
                        {
                            caption: content.message,
                            image_url: content.imageUrl
                        }
                    ) as MetaApiResponse;

                    // 2. Publish container
                    const publishResponse = await fetchAPIRepository.postContent(
                        `${config.instagram.pageId}/media_publish`,
                        {
                            creation_id: containerResponse.id
                        }
                    ) as MetaApiResponse;

                    return {
                        platform: content.platform,
                        success: true,
                        postId: publishResponse.id
                    };
                }
                case SocialMediaPlatform.THREADS: {
                    // 1. Create container
                    const containerResponse = await fetchAPIRepository.postContent(
                        `${config.threads.userId}/threads`,
                        {
                            text: content.message,
                            ...(content.imageUrl && { image_url: content.imageUrl })
                        }
                    ) as MetaApiResponse;

                    // 2. Publish container
                    const publishResponse = await fetchAPIRepository.postContent(
                        `${config.threads.userId}/media_publish`,
                        {
                            creation_id: containerResponse.id
                        }
                    ) as MetaApiResponse;

                    return {
                        platform: content.platform,
                        success: true,
                        postId: publishResponse.id
                    };
                }
            }
        } catch (error) {
            return {
                platform: content.platform,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    private getAccessToken(platform: SocialMediaPlatform): string {
        switch (platform) {
            case SocialMediaPlatform.FACEBOOK:
                return config.facebook.accessToken;
            case SocialMediaPlatform.INSTAGRAM:
                return config.instagram.accessToken;
            case SocialMediaPlatform.THREADS:
                return config.threads.accessToken;
        }
    }
} 