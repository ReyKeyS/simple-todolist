import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, dueDate, priority } = body;
    
    if (!title || !dueDate) {
        return new NextResponse("Title and due date are required", { status: 400 });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error("CREATE_TODO_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}