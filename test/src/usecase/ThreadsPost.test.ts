import { ThreadsPostUseCase } from '../../../src/usecsae';
import { ThreadsServiceRepository } from '../../../src/repository';
import { ThreadsProperties, MediaType } from '../../../src/entities';
import { mockThreadsServiceRepository, mockThreadsPageId, mockThreadsReplyId, mockThreadsPostContainerId, mockThreadsPostId, mockThreadsReplyContainerId } from '../../mock';

describe('ThreadsPostUseCase', () => {
  let threadsService: ThreadsServiceRepository
  const postMessage: string = 'test post message'
  const replyMessage: string =  'test reply message'

  beforeAll(() => {
    threadsService = new mockThreadsServiceRepository()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error if text contains is not provided', async () => {
    const usecase = new ThreadsPostUseCase(threadsService, '')
    await expect(usecase.exec()).rejects.toThrowError('Text cannot be empty')
  })

  it('should throw error if text contains more than 500 characters', async () => {
    const usecase = new ThreadsPostUseCase(threadsService, 'a'.repeat(501))
    await expect(usecase.exec()).rejects.toThrowError('Text cannot be more than 500 characters')
  })

  it('should create a new text post without reply', async () => {
    const blogPost: ThreadsProperties = {
      text: postMessage,
      media_type: MediaType.TEXT
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValue(mockThreadsPostId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, ""])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.sendContainer).toHaveBeenCalledWith(mockThreadsPostContainerId)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(0)
  })

  it('should create a new text and image post without reply', async () => {
    const mockImageUrl = 'image'

    const blogPost: ThreadsProperties = {
      text: postMessage,
      image_url: mockImageUrl,
      media_type: MediaType.IMAGE
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValue(mockThreadsPostId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage, mockImageUrl)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, ""])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.sendContainer).toHaveBeenCalledWith(mockThreadsPostContainerId)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(0)
  })

  it('should create a new text and video post without reply', async () => {
    const mockVideoUrl = 'video'

    const blogPost: ThreadsProperties = {
      text: postMessage,
      video_url: mockVideoUrl,
      media_type: MediaType.VIDEO
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValue(mockThreadsPostId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage, undefined, mockVideoUrl)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, ""])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.sendContainer).toHaveBeenCalledWith(mockThreadsPostContainerId)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(0)
  })

  it ('should create a new text post with reply', async () => {
    const blogPost: ThreadsProperties = {
      text: postMessage,
      media_type: MediaType.TEXT
    }

    const replyPost: ThreadsProperties = {
      text: replyMessage,
      media_type: MediaType.TEXT,
      reply_to_id: mockThreadsPostId
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.createReplyContainer = jest.fn().mockResolvedValue(mockThreadsReplyContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValueOnce(mockThreadsPostId).mockResolvedValueOnce(mockThreadsReplyId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage, undefined, undefined, replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, mockThreadsReplyId])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createReplyContainer).toHaveBeenCalledWith(replyPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(2)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(1 , mockThreadsPostContainerId)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(2 , mockThreadsReplyContainerId)
  })

  it ('should create a new text and image post with reply', async () => {
    const mockImageUrl = 'image'

    const blogPost: ThreadsProperties = {
      text: postMessage,
      image_url: mockImageUrl,
      media_type: MediaType.IMAGE
    }

    const replyPost: ThreadsProperties = {
      text: replyMessage,
      media_type: MediaType.TEXT,
      reply_to_id: mockThreadsPostId
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.createReplyContainer = jest.fn().mockResolvedValue(mockThreadsReplyContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValueOnce(mockThreadsPostId).mockResolvedValueOnce(mockThreadsReplyId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage, mockImageUrl, undefined, replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, mockThreadsReplyId])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createReplyContainer).toHaveBeenCalledWith(replyPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(2)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(1 , mockThreadsPostContainerId)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(2 , mockThreadsReplyContainerId)
  })

  it ('should create a new text and video post with reply', async () => {
    const mockVideoUrl = 'video'

    const blogPost: ThreadsProperties = {
      text: postMessage,
      video_url: mockVideoUrl,
      media_type: MediaType.VIDEO
    }

    const replyPost: ThreadsProperties = {
      text: replyMessage,
      media_type: MediaType.TEXT,
      reply_to_id: mockThreadsPostId
    }

    threadsService.createContainer = jest.fn().mockResolvedValue(mockThreadsPostContainerId)
    threadsService.createReplyContainer = jest.fn().mockResolvedValue(mockThreadsReplyContainerId)
    threadsService.sendContainer = jest.fn().mockResolvedValueOnce(mockThreadsPostId).mockResolvedValueOnce(mockThreadsReplyId)

    const usecase = new ThreadsPostUseCase(threadsService, postMessage, undefined, mockVideoUrl, replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockThreadsPostId, mockThreadsReplyId])
    expect(threadsService.createContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(threadsService.createReplyContainer).toHaveBeenCalledTimes(1)
    expect(threadsService.createReplyContainer).toHaveBeenCalledWith(replyPost)
    expect(threadsService.sendContainer).toHaveBeenCalledTimes(2)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(1 , mockThreadsPostContainerId)
    expect(threadsService.sendContainer).toHaveBeenNthCalledWith(2 , mockThreadsReplyContainerId)
  })

})