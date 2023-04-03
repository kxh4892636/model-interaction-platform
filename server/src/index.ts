/*
 * @file: server index.ts
 * @Author: xiaohan kong
 * @Date: 2023-02-24
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import projectRoute from "./routes/project_route";
import caseRoute from "./routes/case_route";
import dataRoute from "./routes/data_route";
import model from "./routes/ewe_route";

const app = express();
const port = 3456;

// cors
app.use(cors());
// helmet
app.use(helmet());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// Routes
app.use("/project", projectRoute);
app.use("/case", caseRoute);
app.use("/data", dataRoute);
app.use("/model", model);

app.listen(port, () => {
  console.log("http://localhost:3456");
});
