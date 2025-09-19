
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, displayName, password, confirmPassword } = body;

        if (password !== confirmPassword) return new NextResponse('Confirm Password does not match', { status : 400 });

        const curUser = await prisma.user.findUnique({ where: { email } });
        if (curUser) return new NextResponse('User with this email already exists', { status : 400 });

        const hashedPassword = await bcrypt.hash(password, 10); 

        const newUser = await prisma.user.create({
            data: {
                email,
                displayName,
                password: hashedPassword
            }
        })

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('REGISTRATION_ERROR', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}