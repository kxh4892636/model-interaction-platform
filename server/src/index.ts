import express from "express";
import useRoutes from "./routes/use_routes";
import cors from "cors";

const app = express();
const port = 3456;

// Routes
app.use(cors());
app.use("/", useRoutes);
app.use(express.static("../../data"));

// handle undefined Routes
// app.use("*", (req, res, next) => {
//   const err = new AppError(404, "fail", "undefined route");
//   next(err, req, res, next);
// });

app.listen(port, () => {
  console.log("http://localhost:3456");
});
