export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  REELS = 'REELS',
  STORIES = 'STORIES' 
}

export interface FacebookProperties {
  message: string;
  published: boolean;
  scheduled_publish_time?: number;
}

export interface FacebookReplyProperties {
  message: string;
}

export interface InstagramProperties {
  image_url?: string;
  video_url?: string;
  caption: string;
  media_type: MediaType;
}

export interface ThreadsProperties {
  image_url?: string;
  video_url?: string;
  text: string;
  media_type: MediaType;
  reply_to_id?: string
}

