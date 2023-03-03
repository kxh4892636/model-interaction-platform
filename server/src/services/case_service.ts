import { Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getList = async () => {
  const data = await prisma.case.findMany();
  return data;
};

const getCase = async (id: string) => {
  const info = await prisma.case.findUnique({
    where: {
      id: id as string,
    },
  });

  if (!info) return "id is wrong";
  else;

  await prisma.case.update({
    where: {
      id: id as string,
    },
    data: {
      count: info?.count! + 1,
    },
  });

  return info;
};

export default { getList, getCase };
