import { instagramGraphAPIPath, instagramGraphAPIVersion, instagramGraphApiToken } from '../readConfig';
import { InstagramServiceImplement } from '../../service';
import { InstagramPostUseCase } from '../../usecase';
import { InstagramServiceRepository, FetchAPIRepository } from '../../repository';
import express, { Request, Response} from 'express';
import { FetchAPIFetchAPIRepositoryImplement } from '../../infrastructure';

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