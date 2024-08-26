import { InstagramServiceImplement } from '../../../src/service';
import { InstagramServiceRepository, FetchAPIRepository } from '../../../src/repository';
import { InstagramProperties, MediaType } from '../../../src/entities';
import { mockFetchAPIRepository,mockInstagramPostContainerId, mockInstagramPageId, mockInstagramPostId, mockInstagramReplyId } from '../../mock';

describe('InstagramServiceImplement', () => {
  let mockFetchAPI: FetchAPIRepository
  let facebookService: InstagramServiceRepository

  jest.useFakeTimers();

  beforeAll(() => {
    mockFetchAPI = mockFetchAPIRepository();
    facebookService = new InstagramServiceImplement(mockFetchAPI);
  })

  beforeEach(() => { 
    jest.clearAllMocks();
  })

  it('should createContainer success', async () => {
    const mockBody: InstagramProperties = {
      caption: 'Your reply message goes here',
      media_type: MediaType.TEXT
    };

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockInstagramPostContainerId });

    const response = await facebookService.createContainer(mockBody);
    expect(mockFetchAPI.postContent).toHaveBeenCalledTimes(1);
    expect(response).toBe(mockInstagramPostContainerId);
  });

  it('should sendContainer success', async () => {

    mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockInstagramPostId });

    const response = await facebookService.sendContainer(mockInstagramPostContainerId);
    expect(response).toBe(mockInstagramPostId);
  });

  it('should sendReply success', async () => {
      
      const mockReplyMessage: string = 'Your reply message goes here';
  
      mockFetchAPI.postContent = jest.fn().mockResolvedValue({ id: mockInstagramReplyId });
  
      const response = await facebookService.sendReply(mockInstagramPostId, mockReplyMessage);
      expect(response).toBe(mockInstagramReplyId);
  })
})