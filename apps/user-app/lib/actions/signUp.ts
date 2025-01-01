import prisma from "@repo/db/client"
import bcrypt from "bcryptjs"

type userType = {
     name: string;
     email: string;
     password: string;
     number: string
}

export async function signUp(user: userType) {

     try {
          const { name, email, password, number } = user

          const existingUserByEmail = await prisma.user.findUnique({
               where: {
                    email
               }
          })
          const existingUserByPhone = await prisma.user.findUnique({
               where: {
                    number
               }
          })

          if (existingUserByEmail || existingUserByPhone) {
               return Response.json(
                    {
                         success: false,
                         message: "A user with these credentials already exists."
                    },
                    {
                         status: 400
                    }
               )
          }

          else {
               const hashedPassword = await bcrypt.hash(password, 10)
               const newUser = await prisma.user.create({
                    data: {
                         name,
                         email,
                         password: hashedPassword,
                         number
                    }
               })

               if (newUser) {
                    return Response.json(
                         {
                              success: true,
                              message: "User registered successfully."
                         },
                         {
                              status: 200
                         }
                    )
               } else {
                    return Response.json(
                         {
                              success: false,
                              message: "User registration failed."
                         },
                         {
                              status: 500
                         }
                    )
               }
          }
     } catch (error) {
          console.log("Error regestering user", error)
          return Response.json(
               {
                    success: false,
                    message: "Error registering user"
               },
               {
                    status: 500
               }
          )
     }
}