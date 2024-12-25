"use server"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

type transaction = {
     id: number;
     amount: number;
     timestamp: Date;
     fromUserId: number;
     toUserId: number;
}

type message = {
     message: string
}

export async function fetchUserTransactions(): Promise<transaction[] | message>{
     const session = await getServerSession(authOptions)
     const userId = Number(session.user.id)

     if (!userId) {
          return {
               message: "Not authenticated"
          }
     }

     const sent = await prisma.p2pTransfer.findMany({
          where: {
               fromUserId: userId
          },
     })

     const received = await prisma.p2pTransfer.findMany({
          where: {
               toUserId: userId
          }
     })

     const alltxns = [...sent, ...received].sort((a, b) => {
          const dateA = new Date(a.timestamp)
          const dateB = new Date(b.timestamp)
          return Number(dateB) - Number(dateA)
     })

     return alltxns
}