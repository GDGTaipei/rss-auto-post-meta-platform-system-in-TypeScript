export interface MetaCommonService {
  createContainer(): Promise<void>;
  sendContainer(): Promise<void>;
}

export interface FacebookService {
  sendPost(): Promise<void>;
  sendReply(): Promise<void>;
}

export interface InstagramService extends MetaCommonService {
  sendReply(): Promise<void>;
}

export interface ThreadsService extends MetaCommonService {
  createReplyContainer(): Promise<void>;
}