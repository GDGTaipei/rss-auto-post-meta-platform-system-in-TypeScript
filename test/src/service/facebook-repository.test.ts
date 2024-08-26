import { FacebookServiceImplement } from '../../../src/service';
import { FacebookServiceRepository, FetchAPIRepository } from '../../../src/repository';
import { FacebookProperties } from '../../../src/entities';
import { mockFetchAPIRepository,mockFacebookPageId, mockFacebookPostId, mockFacebookReplyId } from '../../mock';

describe('FacebookServiceImplement', () => {
  let mockFetchAPI: FetchAPIRepository
  let facebookService: FacebookServiceRepository

  jest.useFakeTimers();

  beforeAll(() => {
    mockFetchAPI = mockFetchAPIRepository();
    facebookService = new FacebookServiceImplement(mockFetchAPI);
  })

  beforeEach(() => { 
    jest.clearAllMocks();
  })

  it('should send post successfully as publishing right now', async () => {
    const mockBody: FacebookProperties = {
      message: 'Your reply message goes here',
      published: true
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockFacebookPostId });

    const response = await facebookService.sendPost(mockBody);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockFacebookPostId);
  });

  it('should send post successfully as creating draft', async () => {
    const mockBody: FacebookProperties = {
      message: 'Your reply message goes here',
      published: false,
      scheduled_publish_time: Date.now()
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockFacebookPostId });

    const response = await facebookService.sendPost(mockBody);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockFacebookPostId);
  });

  it('should send reply successfully', async () => {

    const mockBody: FacebookProperties = {
      message: 'Your reply message goes here',
      published: true
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockFacebookReplyId });

    const response = await facebookService.sendReply(mockFacebookPostId, mockBody);
    expect(response).toBe(mockFacebookReplyId);
  });

  it('should send reply successfully as creating draft', async () => {

    const mockBody: FacebookProperties = {
      message: 'Your reply message goes here',
      published: false,
      scheduled_publish_time: Date.now()
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockFacebookReplyId });

    const response = await facebookService.sendReply(mockFacebookPostId, mockBody);
    expect(response).toBe(mockFacebookReplyId);
  });
})