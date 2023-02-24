// TODO comments
import express from "express";
import useRoutes from "./use_routes";
import cors from "cors";

const app = express();
const port = 3456;

// cors
app.use(cors());
// Routes
app.use("/", useRoutes);
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());
// handle undefined Routes
// app.use("*", (req, res, next) => {
//   const err = new AppError(404, "fail", "undefined route");
//   next(err, req, res, next);
// });

app.listen(port, () => {
  console.log("http://localhost:3456");
});
