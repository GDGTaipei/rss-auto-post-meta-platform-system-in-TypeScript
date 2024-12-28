import { facebookGraphAPIPath, facebookGraphAPIVersion, facebookApiToken,  } from '../readConfig.js';
import { FacebookServiceImplement } from '../../service/index.js';
import { FacebookPostUseCase } from '../../usecase/index.js';
import { FacebookServiceRepository, FetchAPIRepository } from '../../repository/index.js';
import express from 'express';
import { FetchAPIFetchAPIRepositoryImplement } from '../../infrastructure/index.js';

const app = express()

app.post('/', async (req, res) => {
    const { message, scheduled_publish_time, reply_message } = req.body
    const apiService: FetchAPIRepository = new FetchAPIFetchAPIRepositoryImplement(`${facebookGraphAPIPath}/${facebookGraphAPIVersion}`, facebookApiToken)
    const facebookService: FacebookServiceRepository = new FacebookServiceImplement(apiService)
    const usecase = new FacebookPostUseCase(facebookService, message, scheduled_publish_time, reply_message)
    const result = await usecase.exec()
    res.json(result)
});


export default app