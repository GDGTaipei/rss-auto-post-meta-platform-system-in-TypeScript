import { instagramGraphAPIPath, instagramGraphAPIVersion, instagramGraphApiToken } from '../readConfig.js';
import { InstagramServiceImplement } from '../../service/index.js';
import { InstagramPostUseCase } from '../../usecase/index.js';
import { InstagramServiceRepository, FetchAPIRepository } from '../../repository/index.js';
import express, { Request, Response} from 'express';
import { FetchAPIFetchAPIRepositoryImplement } from '../../infrastructure/index.js';

const app = express()

app.post('/', async (req: Request, res: Response) => {
    const { postMessage, postImage, postVideo , replyMessage } = req.body
    const apiService: FetchAPIRepository = new FetchAPIFetchAPIRepositoryImplement(`${instagramGraphAPIPath}/${instagramGraphAPIVersion}`, instagramGraphApiToken)
    const instagramService: InstagramServiceRepository = new InstagramServiceImplement(apiService)
    const usecase = new InstagramPostUseCase(instagramService, postMessage, postImage, postVideo, replyMessage)
    const result = await usecase.exec()
    res.json(result)
});


export default app