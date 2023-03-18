import "dotenv/config";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import { createServer } from "http";
import session from "./middleware/session.js";
import { Server } from "socket.io";
import { init as initSocket } from "./socket/index.js";
import { db } from "./db/index.js";
import routes from "./routes/index.js";
import Gun, { IGunInstance } from "gun";

const corsConfig = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
};

const app = express();
const server = createServer(app);
// const gun = Gun({
//     file: "data.json"
// });
// database
db.connect();

// middleware
interface RequestWithGun extends Request {
    gun?: IGunInstance<any>;
}
function gunMiddleware(req: RequestWithGun, res: Response, next: () => void) {
    const gun = Gun({
        file: "data.json"
    });
    req.gun = gun;
    next();
}

app.use(gunMiddleware);
app.use(cors(corsConfig));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session);
app.use("/v1", routes);

// socket.io
export const io = new Server(server, { cors: corsConfig, pingInterval: 30000, pingTimeout: 50000 });
io.use((socket, next) => {
    session(socket.request as Request, {} as Response, next as NextFunction);
});
io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
        next();
    } else {
        console.log("io.use: no session");
        socket.disconnect();
    }
});
initSocket();

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`kchess api server listening on :${port}`);
});