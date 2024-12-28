import { ThreadsProperties, InstagramProperties } from "../entities/index.js";


export interface socialPlatformCommonUseCase {
  isContentValid(): void;
  payloadCreator(inputMessage:string, image_url?: string, video_url?: string, replyId?: string): ThreadsProperties | InstagramProperties
}