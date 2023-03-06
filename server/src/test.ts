import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  // const id = crypto.randomUUID();
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
  //     time: new Date("2023-3-3"),
  //     title: "UVET水深可视化示例",
  //     data: keys,
  //     tags: ["示例数据"],
  //   },
  // });
  // await prisma.data.create({
  //   data: {
  //     data: "/case/test/output/uvet.dat",
  //     id: id,
  //     temp: false,
  //     title: "uvet",
  //     type: "uvet",
  //     extent: [119.5498985092223, 120.21745091964257, 26.34525050928077, 26.972279065373204],
  //     style: "raster",
  //     transform: ["/case/test/transform/uvet_petak_transform.png", "1440"],
  //   },
  // });
  // await prisma.data.deleteMany({
  //   where: {
  //     temp: true,
  //   },
  // });
  // await prisma.data.updateMany({
  //   where: {},
  //   data: {
  //   },
  // });
  const info = await prisma.data.findMany();
  console.log(info);
  // npx ts-node test.ts
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
