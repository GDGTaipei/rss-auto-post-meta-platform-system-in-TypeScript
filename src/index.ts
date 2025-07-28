import { onRequest } from "firebase-functions/v2/https";
import { app } from "./application/app.js";

exports.api = onRequest({
    cors: true,
}, app);