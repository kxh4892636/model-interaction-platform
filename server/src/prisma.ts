import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  const id = crypto.randomUUID();
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
  //     title: "水动力模型结果案例",
  //     data: keys,
  //     tags: ["水动力模型", "案例"],
  //   },
  // });
  // await prisma.data.create({
  //   data: {
  //     data: "/case/hydrodynamics_result/model/hydrodynamics/model/uvet.dat",
  //     id: id,
  //     temp: false,
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
  //     id: "0825e77e-a3db-4048-a594-b79f91765c4f",
  //   },
  //   data: {
  //     temp: true,
  //   },
  // });
  // NOTE queryraw
  // NOTE postgresql string should use ''
  // NOTE postgresql how to input [] and null
  // await prisma.$queryRaw`UPDATE data SET transform[0] = '/case/hydrodynamics_input/model/hydrodynamics/transform/mesh/mesh31.png' WHERE id = '4656f3e6-726c-41ec-8331-be11319b054b'`;
  // await prisma.data.deleteMany({
  //   where: {
  //     temp: true,
  //   },
  // });
  // await prisma.case.deleteMany({
  //   where: {},
  // });
  const info = await prisma.data.findMany({});
  console.log(info);
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
