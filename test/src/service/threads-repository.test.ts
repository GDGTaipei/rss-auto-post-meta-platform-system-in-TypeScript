import { ThreadsServiceImplement } from '../../../src/service';
import { ThreadsServiceRepository, FetchAPIRepository } from '../../../src/repository';
import { ThreadsProperties, MediaType } from '../../../src/entities';
import { mockFetchAPIRepository,mockThreadsPageId, mockThreadsPostContainerId, mockThreadsPostId, mockThreadsReplyContainerId, mockThreadsReplyId } from '../../mock';
import { mock } from 'node:test';

describe('ThreadsServiceImplement', () => {
  let mockFetchAPI: FetchAPIRepository
  let facebookService: ThreadsServiceRepository

  jest.useFakeTimers();

  beforeAll(() => {
    mockFetchAPI = mockFetchAPIRepository();
    facebookService = new ThreadsServiceImplement(mockFetchAPI);
  })

  beforeEach(() => { 
    jest.clearAllMocks();
  })

  it('should createContainer success', async () => {
    const mockBody: ThreadsProperties = {
      text: 'post message goes here',
      media_type: MediaType.TEXT
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockThreadsPostContainerId });

    const response = await facebookService.createContainer(mockBody);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockThreadsPostContainerId);
  });

  it('should sendPostContainer success', async () => {
    
    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockThreadsPostId });

    const response = await facebookService.sendContainer(mockThreadsPostContainerId);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockThreadsPostId);
  });

  it('should createReplyContainer success', async () => {
    
    const mockBody: ThreadsProperties = {
      text: 'post message goes here',
      media_type: MediaType.TEXT
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockThreadsReplyContainerId });

    const response = await facebookService.createReplyContainer(mockBody);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockThreadsReplyContainerId);
  });


})