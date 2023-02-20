import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  const info = await prisma.data.findMany();
  const keys = info.map((value) => value.id);

  // await prisma.case.create({
  //   data: {
  //     author: "孔潇涵",
  //     description: "示例案例",
  //     id: crypto.randomUUID(),
  //     image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
  //     time: new Date("2023-2-20"),
  //     title: "示例案例",
  //     tags: "示例案例",
  //     data: keys,
  //   },
  // });

  // await prisma.data.updateMany({
  //   where: {
  //     author: "孔潇涵",
  //   },
  //   data: {
  //     time: new Date("2023-02-18"),
  //   },
  // });
  console.log(await prisma.case.findMany());
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
