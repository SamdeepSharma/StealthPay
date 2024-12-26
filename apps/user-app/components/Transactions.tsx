"use client"
import { Card } from "@repo/ui/card"
import { useEffect, useState } from "react"
import { fetchUserTransactions } from "../lib/actions/fetchUserTransactions"
import { getUserId } from "../lib/actions/getUserId"

interface Transaction {
     id: number
     amount: number
     timestamp: Date
     fromUserId: number
     toUserId: number
}

interface AuthError {
     message: string
}

type TransactionResponse = Transaction[] | AuthError

const isAuthError = (data: TransactionResponse): data is AuthError => {
     return 'message' in data
}

export const Transactions = () => {
     const [userId, setUserId] = useState<number | null>(null)
     const [data, setData] = useState<TransactionResponse | null>(null)

     useEffect(() => {
          try {
               const fetchData = async () => {
                    const response = await fetchUserTransactions()
                    setData(response)
                    const res = await getUserId()
                    setUserId(res)
               }
               fetchData()
          } catch (error) {
               console.log(error)
          }
     }, [])

     if (!data || !userId) {
          return (
               <Card title="Transaction History">
                    <div className="text-center py-8">
                         Loading recent transactions...
                    </div>
               </Card>
          )
     }

     if (isAuthError(data)) {
          return (
               <Card title="Unable to fetch transactions">
                    <div className="text-center py-8">
                         {data.message || 'Not authenticated'}
                    </div>
               </Card>
          )
     }

     return (
               <Card title="Transaction History">
                    <div className="pt-2">
                         {data.length === 0 ? (
                              <div className="text-center py-8">
                                   No recent transactions
                              </div>
                         ) : (
                              data.map((transaction) => (
                                   <div key={Number(transaction.id)} className="flex justify-between my-1">
                                        <div>
                                             <div className="text-sm">
                                                  {transaction.fromUserId === userId ? 'Sent' : 'Received'} INR
                                             </div>
                                             <div className="text-slate-600 text-xs">
                                                  {transaction.timestamp.toDateString()}
                                             </div>
                                        </div>
                                        <div
                                             className={`flex flex-col justify-center font-medium ${transaction.fromUserId === userId ? "text-red-700" : "text-green-700"
                                                  }`}
                                        >
                                             {transaction.fromUserId === userId ? "-" : "+"} Rs {transaction.amount / 100}
                                        </div>
                                   </div>
                              ))
                         )}
                    </div>
               </Card>
     )
}