import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ todoId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await context.params;
        const todoId = parseInt(resolvedParams.todoId);
        const body = await request.json();
        const { title, description, priority, complete } = body;

        const updatedTodo = await prisma.todo.update({
            where: {
                id: todoId,
                userId: parseInt(session.user.id),
            },
            data: {
                title,
                description,
                priority,
                complete
            },
        });

        return NextResponse.json(updatedTodo);
    } catch (error) {
        console.error("UPDATE_TODO_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ todoId: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const resolvedParams = await context.params;
        const todoId = parseInt(resolvedParams.todoId);

        await prisma.todo.delete({
            where: {
                id: todoId,
                userId: parseInt(session.user.id),
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE_TODO_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}