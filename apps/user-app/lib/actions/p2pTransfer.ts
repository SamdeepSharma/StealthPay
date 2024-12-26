"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface returntype {
     message: string
}

export async function p2pTransfer(number: string, amount: number) : Promise<returntype> {
     const session = await getServerSession(authOptions);
     const fromUser = Number(session.user.id)

     if(!fromUser){
          return {
               message: "Not authenticated"
          }
     }

     try {
          const toUser = await prisma.user.findFirst({
               where: {
                    number
               }
          })
     
          if(!toUser || toUser.id === fromUser) {
               return {
                    message: "User not found!"
               }
          }
     
          await prisma.$transaction(async(tx) => {
               await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUser} FOR UPDATE`;
               const fromBalance = await tx.balance.findUnique({
                    where: {
                         userId: fromUser
                    }
               })
     
               if (!fromBalance || fromBalance.amount < amount) {
                    return {
                         message: "Insufficient funds, transaction cancelled!"
                    }
               }
     
               await tx.balance.update({
                    where: {
                         userId: fromUser
                    },
                    data: {
                         amount: {
                              decrement: amount
                         }
                    }
               })
     
               await tx.balance.update({
                    where: {
                         userId: toUser.id
                    },
                    data: {
                         amount: {
                              increment: amount
                         }
                    }
               })
     
               await tx.p2pTransfer.create({
                    data: {
                         amount,
                         fromUserId: fromUser,
                         toUserId: toUser.id,
                         timestamp: new Date()
                    }
               })
          })
          return {
               message: "Success"
          }
     } catch (error) {
          console.log(error)
     }
     return {
          message: "Transfer failed"
     }
}