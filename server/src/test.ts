import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import path from "path";

const prisma = new PrismaClient();

const main = async () => {
  // await prisma.data.update({
  //   where: {
  //     id: "ef05f77a-f125-4da8-a771-f6e3a6d3099a",
  //   },
  //   data: {
  //     data: "/case/test/line_string.json",
  //   },
  // });

  // await prisma.data.update({
  //   where: {
  //     id: "8ff73376-e877-47e6-94c3-09e6a2598f28",
  //   },
  //   data: {
  //     data: "/case/test/polygon.json",
  //   },
  // });

  const info = await prisma.data.findMany();
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
