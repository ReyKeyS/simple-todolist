import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({ where: { email: credentials.email } })
                if (!user) return null

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                if (!isPasswordValid) return null;

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.displayName,
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id;
                token.name = user.name
            }
            return token;
        },
        session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }