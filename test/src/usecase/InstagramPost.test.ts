import { InstagramPostUseCase } from '../../../src/usecsae';
import { InstagramServiceRepository } from '../../../src/repository';
import { InstagramProperties, MediaType } from '../../../src/entities';
import { mockInstagramServiceRepository, mockInstagramPageId, mockInstagramReplyId, mockInstagramPostContainerId, mockInstagramPostId } from '../../mock';
import { clear } from 'console';

describe('InstagramPostUseCase', () => {

  let instagramService: InstagramServiceRepository
  const postMessage: string = 'test post message'
  const replyMessage: string =  'test reply message'

  beforeAll(() => {
    instagramService = new mockInstagramServiceRepository()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should throw error if both image and video is provided', async () => {
    const usecase = new InstagramPostUseCase(instagramService, postMessage, 'image', 'video')
    await expect(usecase.exec()).rejects.toThrowError('Cannot have both image and video in the same post')
  })

  it('should throw error if either image and video is not provided', async () => {
    const usecase = new InstagramPostUseCase(instagramService, postMessage)
    await expect(usecase.exec()).rejects.toThrowError('Must have either image or video in the post')
  })

  it('should create a new image post without reply', async () => {

    const mockImageUrl = 'image'

    const blogPost: InstagramProperties = {
      caption: postMessage,
      image_url: mockImageUrl,
      media_type: MediaType.IMAGE
    }

    instagramService.createContainer = jest.fn().mockResolvedValue(mockInstagramPostContainerId)
    instagramService.sendContainer = jest.fn().mockResolvedValue(mockInstagramPostId)

    const usecase = new InstagramPostUseCase(instagramService, postMessage, mockImageUrl)
    const result = await usecase.exec()

    expect(result).toEqual([mockInstagramPostId, ""])
    expect(instagramService.createContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(instagramService.sendContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.sendContainer).toHaveBeenCalledWith(mockInstagramPostContainerId)
    expect(instagramService.sendReply).toHaveBeenCalledTimes(0)
  })

  it('should create a new video post without reply', async () => {
    const mockVideoUrl = 'video'
    
    const blogPost: InstagramProperties = {
      caption: postMessage,
      video_url: mockVideoUrl,
      media_type: MediaType.VIDEO
    }

    instagramService.createContainer = jest.fn().mockResolvedValue(mockInstagramPostContainerId)
    instagramService.sendContainer = jest.fn().mockResolvedValue(mockInstagramPostId)

    const usecase = new InstagramPostUseCase(instagramService, postMessage, '', mockVideoUrl)
    const result = await usecase.exec()

    expect(result).toEqual([mockInstagramPostId, ''])
    expect(instagramService.createContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(instagramService.sendContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.sendContainer).toHaveBeenCalledWith(mockInstagramPostContainerId)
    expect(instagramService.sendReply).toHaveBeenCalledTimes(0)
  })

  it('should create a new image post with reply', async () => {
    const mockImageUrl = 'image'
    
    const blogPost: InstagramProperties = {
      caption: postMessage,
      image_url: mockImageUrl,
      media_type: MediaType.IMAGE
    }

    instagramService.createContainer = jest.fn().mockResolvedValue(mockInstagramPostContainerId)
    instagramService.sendContainer = jest.fn().mockResolvedValue(mockInstagramPostId)
    instagramService.sendReply = jest.fn().mockResolvedValue(mockInstagramReplyId)

    const usecase = new InstagramPostUseCase(instagramService, postMessage, mockImageUrl, '', replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockInstagramPostId, mockInstagramReplyId])
    expect(instagramService.createContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(instagramService.sendContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.sendContainer).toHaveBeenCalledWith(mockInstagramPostContainerId)
    expect(instagramService.sendReply).toHaveBeenCalledTimes(1)
    expect(instagramService.sendReply).toHaveBeenCalledWith(mockInstagramPostId, replyMessage)
  })

  it('should create a new video post with reply', async () => {
    const mockVideoUrl = 'video'
    
    const blogPost: InstagramProperties = {
      caption: postMessage,
      video_url: mockVideoUrl,
      media_type: MediaType.VIDEO
    }

    instagramService.createContainer = jest.fn().mockResolvedValue(mockInstagramPostContainerId)
    instagramService.sendContainer = jest.fn().mockResolvedValue(mockInstagramPostId)
    instagramService.sendReply = jest.fn().mockResolvedValue(mockInstagramReplyId)

    const usecase = new InstagramPostUseCase(instagramService, postMessage, '', mockVideoUrl, replyMessage)
    const result = await usecase.exec()

    expect(result).toEqual([mockInstagramPostId, mockInstagramReplyId])
    expect(instagramService.createContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.createContainer).toHaveBeenCalledWith(blogPost)
    expect(instagramService.sendContainer).toHaveBeenCalledTimes(1)
    expect(instagramService.sendContainer).toHaveBeenCalledWith(mockInstagramPostContainerId)
    expect(instagramService.sendReply).toHaveBeenCalledTimes(1)
    expect(instagramService.sendReply).toHaveBeenCalledWith(mockInstagramPostId, replyMessage)
  })
})