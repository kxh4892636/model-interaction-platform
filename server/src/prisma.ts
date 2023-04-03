import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { dataFoldURL } from "./config/global_data";

const prisma = new PrismaClient();

const main = async () => {
  // const id = crypto.randomUUID();
  // const data = await prisma.data.findMany({
  //   where: {
  //     temp: true,
  //   },
  // });
  // const keys = data.map((value) => value.id);
  // await prisma.case.create({
  //   data: {
  //     author: "kxh",
  //     count: 0,
  //     description: "水动力模型案例",
  //     id: id,
  //     image: "",
  //     time: new Date("2023-3-22"),
  //     title: "水动力模型案例",
  //     data: keys,
  //     tags: ["水动力模型", "案例"],
  //   },
  // });
  // await prisma.data.create({
  //   data: {
  //     data: "/case/hydrodynamics_result/model/hydrodynamics/model/uvet.dat",
  //     id: id,
  //     temp: true,
  //     title: "uvet水深数据",
  //     type: "uvet",
  //     extent: [119.5498985092223, 120.2174509196426, 26.34525050928077, 26.9722790653732],
  //     style: "raster",
  //     transform: ["/case/hydrodynamics_result/model/hydrodynamics/transform/uvet/petak", "120"],
  //     progress: [120, 120],
  //   },
  // });
  // console.log(keys.length);
  // await prisma.case.updateMany({
  //   where: {
  //     id: "0d74ad15-910b-49d6-bdd2-dfd50fe2cb22",
  //   },
  //   data: {
  //     data: keys,
  //   },
  // });
  // await prisma.data.updateMany({
  //   where: {
  //     // id: "0825e77e-a3db-4048-a594-b79f91765c4f",
  //   },
  //   data: {
  //     temp: false,
  //   },
  // });
  // await prisma.$queryRaw`UPDATE data SET data = replace(data,'/temp/','/case/hydrodynamics_result/') WHERE temp = true`;
  // await prisma.data.deleteMany({});
  // await prisma.case.deleteMany({});
  // await prisma.project.deleteMany({});
  // prisma.$queryRaw``;
  const data = await prisma.data.findMany({
    // where: { id: "a3e062a1-d8ac-4ad1-ad46-ea9394f09400" },
  });
  const ccase = await prisma.case.findMany();
  const project = await prisma.project.findMany();
  console.log(ccase);
  console.log(data);
  console.log(ccase.length);
  console.log(data.length);
  console.log(project);
  // npx ts-node prisma.ts
};

main()
  .then(async () => {
    console.log("then");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
    process.exit(1);
  });
