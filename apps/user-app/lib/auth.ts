import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { env } from "node:process";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password", placeholder: "••••••••" }
          },
          // TODO: User credentials type from next-auth
          async authorize(credentials: any): Promise<any> {
            // Do zod validation, OTP validation her
            try {
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.number
                        }
                    }
                    return null;
                }

            } catch (error) {
                return {
                    message: "error"
                }
            }
            return null
        },
        })
    ],
    secret: env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    },
        pages: {
        signIn: '/sign-in'
    },
    session: {
        maxAge: 30 * 24 * 60 * 60
   },
  }
 