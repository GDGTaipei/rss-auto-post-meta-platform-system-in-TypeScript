import { SocialMediaPost, PostResult, SocialMediaPort, SocialMediaPlatform } from '../domain/models.js';
import { FacebookPostUseCase } from '../usecase/FacebookPost.js';
import { InstagramPostUseCase } from '../usecase/InstagramPost.js';
import { ThreadsPostUseCase } from '../usecase/ThreadsPost.js';
import { FetchAPIFetchAPIRepositoryImplement } from './fetch-api.js';
import { FacebookServiceImplement } from '../service/facebook-repository.js';
import { InstagramServiceImplement } from '../service/instagram-repository.js';
import { ThreadsServiceImplement } from '../service/threads-repository.js';
import { config } from '../config/index.js';

export class SocialMediaService implements SocialMediaPort {
    async post(content: SocialMediaPost): Promise<PostResult> {
        const fetchAPIRepository = new FetchAPIFetchAPIRepositoryImplement(
            `${config.meta.baseUrl}/${config.meta.apiVersion}`,
            this.getAccessToken(content.platform)
        );

        try {
            switch (content.platform) {
                case SocialMediaPlatform.FACEBOOK: {
                    const service = new FacebookServiceImplement(fetchAPIRepository);
                    const useCase = new FacebookPostUseCase(service, content.message);
                    const [postId] = await useCase.exec();
                    return {
                        platform: content.platform,
                        success: true,
                        postId
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
                    const service = new InstagramServiceImplement(fetchAPIRepository);
                    const useCase = new InstagramPostUseCase(service, content.message, content.imageUrl);
                    const [postId] = await useCase.exec();
                    return {
                        platform: content.platform,
                        success: true,
                        postId
                    };
                }
                case SocialMediaPlatform.THREADS: {
                    const service = new ThreadsServiceImplement(fetchAPIRepository);
                    const useCase = new ThreadsPostUseCase(service, content.message, content.imageUrl);
                    const [postId] = await useCase.exec();
                    return {
                        platform: content.platform,
                        success: true,
                        postId
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