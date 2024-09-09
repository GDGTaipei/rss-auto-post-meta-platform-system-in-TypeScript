import {FacebookProperties, InstagramProperties, ThreadsProperties} from '../entities'


export interface MetaCommonServiceRepository {
  createContainer(body:any): Promise<string>;
  sendContainer(containerId:string): Promise<string>;
}

export interface FacebookServiceRepository extends Omit<MetaCommonServiceRepository,'sendContainer'> {
  sendPost(body:FacebookProperties, photos?: string[]): Promise<string>;
  sendReply(postId:string, body: FacebookProperties): Promise<string>;
}

export interface InstagramServiceRepository extends MetaCommonServiceRepository {
  createContainer(body: InstagramProperties ): Promise<string>;
  sendReply(mediaId:string, message:string): Promise<string>;
}

export interface ThreadsServiceRepository extends MetaCommonServiceRepository {
  createContainer(body: ThreadsProperties ): Promise<string>;
  createReplyContainer(body: ThreadsProperties): Promise<string>;
}