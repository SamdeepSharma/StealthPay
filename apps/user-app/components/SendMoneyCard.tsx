"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { Center } from "@repo/ui/center";
import { p2pTransfer } from "../lib/actions/p2pTransfer";

export const SendMoneyCard = () => {
     const [number, setNumber] = useState("")
     const [amount, setAmount] = useState(0)
     return (
          <Center>
               <Card title="Send Money">
                    <div className="w-full min-w-80 min-h-56">
                         <TextInput label={"Number"} placeholder={"Number"} onChange={(value) => {
                              setNumber(value)
                         }} />
                         <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => {
                              setAmount(Number(value))
                         }} />
                         <div className="flex justify-center pt-4">
                              <Button onClick={async () => {
                                   try {
                                        await p2pTransfer(number, amount * 100)
                                   } catch (error) {
                                        console.log(error)
                                   }
                              }}>
                                   Send Money
                              </Button>
                         </div>
                    </div>
               </Card>
          </Center>
     )
}