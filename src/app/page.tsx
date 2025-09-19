import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import CalendarClient from "@/components/CalendarClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getTodos(userId: string) {
  const todos = await prisma.todo.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: 'desc' }
  });

  return todos.map(todo => ({
    ...todo,
    title: todo.title,
    start: todo.dueDate,
    end: new Date(todo.dueDate.getTime() + 60 * 60 * 1000),
  }));
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const events = await getTodos(session.user.id);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {session.user?.name || session.user?.email}!
          </h1>
          <p className="text-gray-500">Here is your schedule for this month.</p>
        </div>
        <LogoutButton />
      </div>

      <CalendarClient events={events} />
    </div>
  );
}