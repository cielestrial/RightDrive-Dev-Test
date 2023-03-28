import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import serverlessHttp from "serverless-http";
import { clearCache, getCoins } from "./utils/coinApiSS";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/*
app.set("port", process.env.PORT || 8080);
const port = app.get("port");
*/

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Ping server
router.get("/ping", (req, res) => {
  res.send("pong");
});

// Retrieves a list of the top 40 coins with information on each coin.
router.post("/coins", getCoins);

// Deletes all keys and data in the Redis cache.
router.get("/clear", clearCache);

app.use("/.netlify/functions/api", router);

/*
app.listen(port, () => {
  console.log("listening on port ", port);
});
*/

export const handler = serverlessHttp(app);
