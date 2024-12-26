"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

interface returntype {
     message: string
}

export async function createOnRampTransaction(amount: number, provider: string):Promise<returntype>{
     const session = await getServerSession(authOptions)
     const token = Math.round(Math.random()*Math.pow(10,16)).toString();   /// comes from bank
     const userId = session.user.id
     if(!userId){
          return {
               message: "User not logged in!"
          }
     }

     try {
          await prisma.onRampTransaction.create({
               data: {
                    userId: Number(userId),
                    amount,
                    status: "Processing",
                    startTime: new Date(),
                    provider,
                    token
               }
          })
          return {
               message: "On ramp transaction added"
          }
     } catch (error) {
          console.log(error)
     }

     return {
          message: "Failed to add on-ramp transaction"
     }
}