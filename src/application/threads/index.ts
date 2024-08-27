import { threadsGraphAPIPath, threadsGraphAPIVersion, threadsGraphApiToken } from '../readConfig';
import { ThreadsServiceImplement } from '../../service';
import { ThreadsPostUseCase } from '../../usecase';
import { ThreadsServiceRepository, FetchAPIRepository } from '../../repository';
import express, { Request, Response} from 'express';
import { FetchAPIFetchAPIRepositoryImplement } from '../../infrastructure';

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