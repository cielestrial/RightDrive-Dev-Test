import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { getCoins, getLogo, getPriceDetails } from "./coinApi";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "build")));

app.set("port", process.env.PORT || 8080);
const port = app.get("port");
app.listen(port, () => {
  console.log("listening on port ", port);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/wakeup", (req, res) => {
  res.send("I'm awake");
});

app.get("/coins", getCoins);

app.post("/logo", getLogo);

app.post("/price", getPriceDetails);
