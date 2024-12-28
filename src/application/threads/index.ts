import { threadsGraphAPIPath, threadsGraphAPIVersion, threadsGraphApiToken } from '../readConfig.js';
import { ThreadsServiceImplement } from '../../service/index.js';
import { ThreadsPostUseCase } from '../../usecase/index.js';
import { ThreadsServiceRepository, FetchAPIRepository } from '../../repository/index.js';
import express, { Request, Response} from 'express';
import { FetchAPIFetchAPIRepositoryImplement } from '../../infrastructure/index.js';

const app = express()

app.post('/', async (req: Request, res: Response) => {
    const { postMessage, postImage, postVideo , replyMessage } = req.body
    const apiService: FetchAPIRepository = new FetchAPIFetchAPIRepositoryImplement(`${threadsGraphAPIPath}/${threadsGraphAPIVersion}`, threadsGraphApiToken)
    const threadsService: ThreadsServiceRepository = new ThreadsServiceImplement(apiService)
    const usecase = new ThreadsPostUseCase(threadsService, postMessage, postImage, postVideo, replyMessage)
    const result = await usecase.exec()
    res.json(result)
});


export default app