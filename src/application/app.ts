import express from 'express';
import { SocialMediaPostFlow } from '../usecase/SocialMediaPostFlow.js';
import { RssFeedService } from '../infrastructure/rss-feed.service.js';
import { ContentGeneratorService } from '../infrastructure/content-generator.service.js';
import { SocialMediaService } from '../infrastructure/social-media.service.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('RSS Auto Post Meta Platform System');
});

// Initialize services
const rssFeedService = new RssFeedService();
const contentGenerator = new ContentGeneratorService();
const socialMediaService = new SocialMediaService();

// Initialize use case
const socialMediaPostFlow = new SocialMediaPostFlow(
    rssFeedService,
    contentGenerator,
    socialMediaService
);

app.post('/post', async (req, res) => {
    const { rssUrl } = req.body;

    if (!rssUrl) {
        res.status(400).send({ error: 'rssUrl is required' });
        return;
    }

    try {
        const results = await socialMediaPostFlow.exec(rssUrl);
        const groupedResults = {
            platforms: results
        };
        res.status(200).send(groupedResults);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send({ error: error.message });
        } else {
            res.status(500).send({ error: 'An unknown error occurred' });
        }
    }
});

export { app }; 