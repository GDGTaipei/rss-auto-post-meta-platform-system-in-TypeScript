import { FetchAPIRepository, FacebookServiceRepository, InstagramServiceRepository, ThreadsServiceRepository } from '../../src/repository';

export const mockFetchAPIRepository: jest.Mock<FetchAPIRepository> = jest.fn(() => ({
  getContent: jest.fn(),
  postContent: jest.fn()
}));

export const mockFacebookPageId = 'mock_facebook_page_id';
export const mockFacebookPostId = 'mock_facebook_post_id';
export const mockFacebookReplyId = 'mock_facebook_reply_id';

export const mockInstagramPageId = 'mock_instagram_page_id';
export const mockInstagramPostContainerId = 'mock_instagram_post_container_id';
export const mockInstagramPostId = 'mock_instagram_post_id';
export const mockInstagramReplyId = 'mock_instagram_reply_id';

export const mockThreadsPageId = 'mock_threads_page_id';
export const mockThreadsPostContainerId = 'mock_threads_post_container_id';
export const mockThreadsPostId = 'mock_threads_post_id';
export const mockThreadsReplyContainerId = 'mock_threads_reply_container_id';
export const mockThreadsReplyId = 'mock_threads_reply_id';

export const mockFacebookServiceRepository: jest.Mock<FacebookServiceRepository> = jest.fn(() => ({
  sendPost: jest.fn(),
  sendReply: jest.fn(),
  createContainer: jest.fn()
}));

export const mockInstagramServiceRepository: jest.Mock<InstagramServiceRepository> = jest.fn(() => ({
  sendPost: jest.fn(),
  sendReply: jest.fn(),
  createContainer: jest.fn(),
  sendContainer: jest.fn()
}));

export const mockThreadsServiceRepository: jest.Mock<ThreadsServiceRepository> = jest.fn(() => ({
  createContainer: jest.fn(),
  sendContainer: jest.fn(),
  createReplyContainer: jest.fn()
}));