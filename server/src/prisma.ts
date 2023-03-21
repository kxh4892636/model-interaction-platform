import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  const id = crypto.randomUUID();
  // const data = await prisma.data.findMany({
  //   where: {
  //     temp: false,
  //   },
  // });
  // const keys = data.map((value) => value.id);
  // await prisma.case.create({
  //   data: {
  //     author: "kxh",
  //     count: 0,
  //     description: "示例数据描述",
  //     id: id,
  //     image: "",
  //     time: new Date("2023-3-8"),
  //     title: "水动力流场长江示例",
  //     data: ["10a0253c-e329-4700-b2f9-bf040b5518e7"],
  //     tags: ["示例数据"],
  //   },
  // });
  // await prisma.data.create({
  //   data: {
  //     data: "/case/flow_test/model/hydrodynamics/model/uvet.dat",
  //     id: id,
  //     temp: false,
  //     title: "uvet",
  //     type: "uvet",
  //     extent: [120.0437360613468201, 32.0840108580467813, 121.966232401169222, 31.1739019522094871],
  //     style: "flow",
  //     transform: ["/case/flow_test/model/hydrodynamics/transform/uvet/uv", "27"],
  //   },
  // });
  // await prisma.data.updateMany({
  //   where: { id: "10a0253c-e329-4700-b2f9-bf040b5518e7" },
  //   data: {
  //     extent: [120.0437360613468201, 31.1739019522094871, 121.966232401169222, 32.0840108580467813],
  //   },
  // });
  // await prisma.data.deleteMany({
  //   where: { temp: true },
  // });
  // await prisma.case.deleteMany({
  //   where: {},
  // });
  const info = await prisma.data.findMany();
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
