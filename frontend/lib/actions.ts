"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { stringify } from "querystring";


export const signUp = async (formData: FormData) => {
const username = formData.get("username") as string
const email = formData.get("email") as string
const password = formData.get("password") as string

let passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: passwordHash as string,
      },
    });
    console.info("User created successfully");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Username or email already exists");
        return { success: false, message: "Username or email already exists" };
      }
    }
    return { success: false, message: "Unknown error" };
  }
};

export const logIn = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });

    // Check if the user has a password hash
	if (user?.password) {
		// Compare the provided password with the user's password hash
		const userPassword = bcrypt.compareSync(password, user.password);
		// Check if the password is incorrect
		if (!userPassword) {
			//ADD: Return a 400 error with the username and credentials message
      console.error("Invalid email or password");
			 return { success: false, message: "Invalid email or password" };
		}
	} else {
		//ADD: Return a 400 error with the username and credentials message
    console.error("Invalid email or password");
		 return { success: false, message: "Invalid email or password" };
	}

    const authenticatedUser = await prisma.user.update({
      where: { username: formData.get("username") as string },
      data: { authToken: crypto.randomUUID() }
    });

    if (user) {
      cookies().set('session', authenticatedUser.authToken ?? '',  {
        httpOnly: true, // Prevent JavaScript access for security
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        maxAge: 60 * 60 * 24 * 7, // Example: 1 week expiry
        path: '/', // Accessible on entire site
      });


      return { success: true, user };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unknown error" };
  }
};

export const logOut = async () => {
  try {
   //remove session cookie
   cookies().set('session', '',  {
      httpOnly: true, // Prevent JavaScript access for security
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      maxAge: 60, // Example: 1 min expiry
      path: '/', // Accessible on entire site
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unknown error" };
  }
};


export const authenticate = async () => {
  const cookie = cookies().get('session');

  try {
    const user = await prisma.user.findUnique({
      where: {
        authToken: cookie?.value,
      },
      select: {
        username: true,
        email: true,
        password: true,
      },
    });
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unknown error" };
  }
};