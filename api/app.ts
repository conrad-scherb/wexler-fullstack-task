import { setupRouter } from "./src/router";

const port = parseInt(process.env.PORT) || 8888;
void setupRouter(port);
