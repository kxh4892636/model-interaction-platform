import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  // NOTE path.resolve
  const filePath = path.resolve("../../data/geojson/polygon.json");
  // await prisma.data.create({
  //   data: {
  //     author: "孔潇涵",
  //     data: filePath,
  //     description: "示例数据",
  //     id: crypto.randomUUID(),
  //     image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  //     time: new Date("2023-02-18"),
  //     title: "面要素示例数据",
  //     tags: ["示例数据"],
  //   },
  // });

  await prisma.data.updateMany({
    where: {
      author: "孔潇涵",
    },
    data: {
      time: new Date("2023-02-18"),
    },
  });

  const info = await prisma.data.findMany({
    where: {
      author: "孔潇涵",
    },
  });
  console.log(info);
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
