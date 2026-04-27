import express from "express";

const app = express();
const port = 3000;

app.use(express.static("server/public"));

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "server/public" });
});

app.listen(port, () => {
  console.log(`Demo running at http://localhost:${port}`);
});