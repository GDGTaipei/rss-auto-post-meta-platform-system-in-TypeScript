import facebook from './application/facebook/index.js';
import instagram from './application/instagram/index.js';
import threads from './application/threads/index.js';

import express from 'express';
const app = express()

app.get('/facebook', facebook);
app.get('/instagram', instagram);
app.get('/threads', threads);

app.listen(8080, () => {    
    console.log('Server is running on port 8080');
});