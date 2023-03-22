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
  //     description: "水动力模型示例数据集",
  //     id: id,
  //     image: "",
  //     time: new Date("2023-3-8"),
  //     title: "水动力模型示例数据集",
  //     data: keys,
  //     tags: ["水动力模型", "数据集"],
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
  //   data: {
  //     transform:

  //   },
  // });
  // NOTE queryraw
  // NOTE postgresql string should use ''
  // NOTE postgresql how to input [] and null
  // await prisma.$queryRaw`UPDATE data SET transform[0] = '/case/hydrodynamics_input/model/hydrodynamics/transform/mesh/mesh31.png' WHERE id = '4656f3e6-726c-41ec-8331-be11319b054b'`;
  // await prisma.data.deleteMany({
  //   where: {},
  // });
  // await prisma.case.deleteMany({
  //   where: {},
  // });
  const info = await prisma.case.findMany();
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
