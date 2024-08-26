import {FacebookProperties, InstagramProperties, ThreadsProperties} from '../entites'


export interface MetaCommonServiceRepository {
  createContainer(body:any): Promise<string>;
  sendContainer(containerId:string): Promise<string>;
}

export interface FacebookServiceRepository {
  sendPost(body:FacebookProperties): Promise<string>;
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