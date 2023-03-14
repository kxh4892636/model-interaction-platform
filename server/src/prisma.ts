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
  //     title: "UVET流场可视化示例",
  //     data: ["71f67d10-555b-469a-acc0-8cacec14bb67"],
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
  //     style: "flow",
  //     transform: ["/case/test/transform/uvet/uv", "120"],
  //   },
  // });
  await prisma.data.deleteMany({
    where: {
      temp: true,
    },
  });
  // await prisma.case.updateMany({
  //   where: { id: "3c2af655-bb70-472a-9f83-97bbe163e4fa" },
  //   data: {
  //     data: [
  //       "d1e7f07e-93ea-47dc-af53-33dcfdf1e167",
  //       "0659274e-9dbb-4e14-891a-bec7e47bfd13",
  //       "a07ad02e-a96c-4e6b-9de2-ca2ec85a4157",
  //       "e73599fb-fa3f-4816-ae28-a45f0570eabe",
  //       "35b0d729-2322-4fd4-b959-2ba10250d6f6",
  //       "e4e3849b-2cee-4ef9-81ae-293a3ab7f48b",
  //     ],
  //   },
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
