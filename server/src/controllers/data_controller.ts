import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getData = async (req: Request, res: Response) => {
  try {
    const data = await prisma.data.findMany();
  } catch (error) {
    console.error(error);
  }
};
