import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import serverlessHttp from "serverless-http";
import { getCoins, getLogo, getPriceDetails } from "./utils/coinApi";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

//app.set("port", process.env.PORT || 8080);
//const port = app.get("port");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.get("/wakeup", (req, res) => {
  res.send("I'm awake");
});

router.get("/coins", getCoins);

router.post("/logo", getLogo);

router.post("/price", getPriceDetails);

app.use("/.netlify/functions/api", router);

/*
app.listen(port, () => {
  console.log("listening on port ", port);
});
*/

export const handler = serverlessHttp(app);
