"use server";

import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const signUp = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nearId = formData.get("nearId") as string;

  let passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: passwordHash as string,
        nearId: nearId,
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
      data: { authToken: crypto.randomUUID() },
    });

    if (user) {
      cookies().set("session", authenticatedUser.authToken ?? "", {
        httpOnly: true, // Prevent JavaScript access for security
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        maxAge: 60 * 60 * 24 * 7, // Example: 1 week expiry
        path: "/", // Accessible on entire site
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
    cookies().set("session", "", {
      httpOnly: true, // Prevent JavaScript access for security
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 60, // Example: 1 min expiry
      path: "/", // Accessible on entire site
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unknown error" };
  }
};

export const authenticate = async () => {
  const cookie = cookies().get("session");

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


export const createProject = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const manaTokenAllocated = parseFloat(formData.get("manaTokenAllocated") as string) || 0; // Provide a default value or handle potential parsing errors
  const manaHoursBudgeted = parseInt(formData.get("manaHoursBudgeted") as string, 10) || 0; // Provide a default value or handle potential parsing errors
  const submittedBy = formData.get("submittedBy") as string; // Assuming you want to store who submitted the project
  const targetApprovalDate = formData.get("targetApprovalDate") ? new Date(formData.get("targetApprovalDate") as string) : null; // Optional field
  const budgetWindowLow = parseFloat(formData.get("budgetWindowLow") as string) || 0; // Optional field
  const budgetWindowHigh = parseFloat(formData.get("budgetWindowHigh") as string) || 0; // Optional field

  try {
    await prisma.proposal.create({
      data: {
        title: title,
        description: description,
        manaTokenAllocated: manaTokenAllocated,
        manaHoursBudgeted: manaHoursBudgeted,
        submittedBy: submittedBy, // Adding submittedBy
        targetApprovalDate: targetApprovalDate, // Adding targetApprovalDate
        budgetWindowLow: budgetWindowLow, // Adding budgetWindowLow
        budgetWindowHigh: budgetWindowHigh, // Adding budgetWindowHigh
      },
    });
    console.info("Project created successfully");
    return { success: true, message: "Project created successfully!" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Project already exists");
        return { success: false, message: "Project already exists" };
      }
    }
    console.error(error); // Log the error for debugging
    return { success: false, message: "Unknown error" };
  }
};

// Actually fetches the user's projects
export const fetchUserProposals = async (username: string) => {
  const requesterName = username as string;

  try {
    const userProposals = await prisma.proposal.findMany({
      where: {
        submittedBy: requesterName,
      },
    });

    if (userProposals.length === 0) {
      return { success: true, message: "No proposals found for this user", proposals: [] };
    }

    return { success: true, proposals: userProposals };
  } catch (error) {
    console.error("Error fetching user proposals:", error);
    return { success: false, message: "Unknown error" };
  }
};

export const createSubProject = async (formData: {
  proposalId: string;
  subProjectName: string;
  epics: {
    epicName: string;
    tasks: {
      taskName: string;
      manaTokenAllocated: number;
      rolesManaHours: { roleName: string; manaHours: number }[];
    }[];
  }[];
}) => {
  try {
    const result = await prisma.subProject.create({
      data: {
        proposal: { connect: { id: parseInt(formData.proposalId) } },
        subProjectName: formData.subProjectName,
        epics: {
          create: formData.epics.map(epic => ({
            epicName: epic.epicName,
            tasks: {
              create: epic.tasks.map(task => ({
                taskName: task.taskName,
                manaTokenAllocated: task.manaTokenAllocated,
                rolesManaHours: {
                  create: task.rolesManaHours.map(role => ({
                    roleName: role.roleName,
                    manaHours: role.manaHours,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        epics: {
          include: {
            tasks: {
              include: {
                rolesManaHours: true,
              },
            },
          },
        },
      },
    });

    console.info("Sub-Project created successfully");
    return { success: true, message: "Sub-Project created successfully!", data: result };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Sub-Project already exists");
        return { success: false, message: "Sub-Project already exists" };
      }
    }
    console.error(error); // Log the error for debugging
    return { success: false, message: "Unknown error" };
  }
};



import { Proposal, SubProject, Epic, Task, RolesManaHour } from "@prisma/client"; // Import your Prisma types

// Define nested types to mirror the included data structure
export type DetailedTask = Task & {
  rolesManaHours: RolesManaHour[];
};

export type DetailedEpic = Epic & {
  tasks: DetailedTask[];
};

export type DetailedSubProject = SubProject & {
  epics: DetailedEpic[];
};

export type DetailedProposal = Proposal & {
  subProjects: DetailedSubProject[];
};


export type FetchUserProposalsWithDetailsResponse = {
  success: boolean;
  message?: string;
  proposals?: DetailedProposal[];
};

// Actually fetches the user's proposals with details, that is the sub-projects and tasks
export const fetchUserProposalsWithDetails = async (username: string): Promise<FetchUserProposalsWithDetailsResponse> => {
  try {
    const userProposals = await prisma.proposal.findMany({
      where: {
        submittedBy: username,
      },
      include: {
        subProjects: {
          include: {
            epics: {
              include: {
                tasks: {
                  include: {
                    rolesManaHours: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (userProposals.length === 0) {
      return {
        success: true,
        message: 'No proposals found for this user',
        proposals: [],
      };
    }

    return { success: true, proposals: userProposals };
  } catch (error) {
    console.error('Error fetching user proposals with details:', error);
    return { success: false, message: 'Unknown error', proposals: [] };
  }
};

