
export interface MetaCommonRepository {
  createContainer(): Promise<void>;
  sendContainer(): Promise<void>;
}

export interface FacebookRepository {
  sendPost(): Promise<void>;
  sendReply(): Promise<void>;
}

export interface InstagramRepository extends MetaCommonRepository {
  sendReply(): Promise<void>;
}

export interface ThreadsRepository extends MetaCommonRepository {
}