import { onRequest } from "firebase-functions/v2/https";
import { app } from "./application/app.js";

export const rssAutoPost = onRequest({
    cors: true,
}, app);