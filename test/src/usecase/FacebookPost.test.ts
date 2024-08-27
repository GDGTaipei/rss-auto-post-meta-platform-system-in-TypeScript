import { FacebookPostUseCase } from '../../../src/usecsae';
import { FacebookServiceRepository } from '../../../src/repository';
import { FacebookProperties } from '../../../src/entities';
import { mockFacebookServiceRepository, mockFacebookPageId, mockFacebookReplyId } from '../../mock';

describe('FacebookPostUseCase', () => {
  let facebookService: FacebookServiceRepository
  const postMessage: string = 'test post message'
  const replyMessage: string =  'test reply message'

  beforeAll(() => {
    facebookService = new mockFacebookServiceRepository()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new post with reply', async () => {
    const blogPost: FacebookProperties = {
      message: postMessage,
      published: true
    }
    facebookService.sendPost = jest.fn().mockResolvedValue(mockFacebookPageId)
    facebookService.sendReply = jest.fn().mockResolvedValue(mockFacebookReplyId)

    const usecase = new FacebookPostUseCase(facebookService, postMessage, undefined, replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockFacebookPageId, mockFacebookReplyId])
    expect(facebookService.sendPost).toHaveBeenCalledTimes(1)
    expect(facebookService.sendPost).toHaveBeenCalledWith(blogPost)
    expect(facebookService.sendReply).toHaveBeenCalledTimes(1)
    expect(facebookService.sendReply).toHaveBeenCalledWith(mockFacebookPageId, {...blogPost, message: replyMessage})
  })

  it('should create a new post without reply', async () => {
    const blogPost: FacebookProperties = {
      message: postMessage,
      published: true,
    }
    facebookService.sendPost = jest.fn().mockResolvedValue(mockFacebookPageId)

    const usecase = new FacebookPostUseCase(facebookService, postMessage, undefined)
    const result = await usecase.exec()
    expect(result).toEqual([mockFacebookPageId, ''])
    expect(facebookService.sendPost).toHaveBeenCalledTimes(1)
    expect(facebookService.sendPost).toHaveBeenCalledWith(blogPost)
    expect(facebookService.sendReply).not.toHaveBeenCalled()
  })

  it('should create a new post with reply as scheduled', async () => {
    const scheduled_publish_time = 1234567890
    const blogPost: FacebookProperties = {
      message: postMessage,
      published: false,
      scheduled_publish_time: scheduled_publish_time
    }
    facebookService.sendPost = jest.fn().mockResolvedValue(mockFacebookPageId)
    facebookService.sendReply = jest.fn().mockResolvedValue(mockFacebookReplyId)

    const usecase = new FacebookPostUseCase(facebookService, postMessage, scheduled_publish_time, replyMessage)
    const result = await usecase.exec()
    expect(result).toEqual([mockFacebookPageId, mockFacebookReplyId])
    expect(facebookService.sendPost).toHaveBeenCalledTimes(1)
    expect(facebookService.sendPost).toHaveBeenCalledWith(blogPost)
    expect(facebookService.sendReply).toHaveBeenCalledTimes(1)
    expect(facebookService.sendReply).toHaveBeenCalledWith(mockFacebookPageId, {...blogPost, message: replyMessage})
  })

  it('should create a new post without reply as scheduled', async () => {
    const scheduled_publish_time = 1234567890
    const blogPost: FacebookProperties = {
      message: postMessage,
      published: false,
      scheduled_publish_time: scheduled_publish_time
    }
    facebookService.sendPost = jest.fn().mockResolvedValue(mockFacebookPageId)
    facebookService.sendReply = jest.fn().mockResolvedValue(mockFacebookReplyId)

    const usecase = new FacebookPostUseCase(facebookService, postMessage, scheduled_publish_time)
    const result = await usecase.exec()
    expect(result).toEqual([mockFacebookPageId, ''])
    expect(facebookService.sendPost).toHaveBeenCalledTimes(1)
    expect(facebookService.sendPost).toHaveBeenCalledWith(blogPost)
    expect(facebookService.sendReply).toHaveBeenCalledTimes(0)
  })
})