"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export let signUp = async (formData: FormData) => {
  try {
    await prisma.user.create({
      data: {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log("Username or email already exists");
        return { success: false, message: "Username or email already exists" };
      }
    }
    return { success: false, message: "Unknown error" };
  }
};

export let login = async (formData: FormData) => {
  try {
    await prisma.user.findUnique({
      where: {
        email: formData.get("email") as string,
      },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    return "error";
  }
};

export let logout = async (formData: FormData) => {
  try {
    await prisma.user.delete({
      where: {
        email: formData.get("email") as string,
      },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
    return "error";
  }
};
