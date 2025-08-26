import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/Models/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found this email.")
                    }

                    if (!user.isVerified) {
                        throw new Error("Verify your account before Signing In.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(user.password, credentials.password);

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
            }
            return session
        },
        async jwt({ token, user}) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAccepting = user.isAccepting;
                token.username = user.username;

            }
            return token
        }
    }
};
