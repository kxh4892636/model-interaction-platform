// TODO comments
import express from "express";
import cors from "cors";
import caseRoute from "./routes/case_route";
import dataRoute from "./routes/data_route";

const app = express();
const port = 3456;

// cors
app.use(cors());
// Routes
app.use("/case", caseRoute);
app.use("/data", dataRoute);
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

app.listen(port, () => {
  console.log("http://localhost:3456");
});
