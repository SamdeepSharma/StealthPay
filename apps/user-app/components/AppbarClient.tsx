"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Appbar } from "@repo/ui/appbar";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();

  return (
   <>
      <Appbar onSignin={async() => {
        try {
          await signIn()
        } catch (error) {
          console.log(error)
        }
      }} onSignout={async () => {
        try {
          await signOut()
        } catch (error) {
          console.log(error)
        }
        router.push("/api/auth/signin")
      }} user={session.data?.user} />
   </>
  );
}
