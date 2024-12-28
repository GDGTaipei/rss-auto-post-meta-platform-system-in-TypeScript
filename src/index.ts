import facebook from './application/facebook';
import instagram from './application/instagram';
import threads from './application/threads';

import express from 'express';
const app = express()


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/facebook', facebook);
app.get('/instagram', instagram);
app.get('/threads', threads);

app.listen(8080, () => {    
    console.log('Server is running on port 8080');
});