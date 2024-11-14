import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center h-screen gap-6 text-center max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoicepedia</h1>
      <div>
      <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
      </div>
      <div>
          <Button asChild>
        <Link href="/dashboard">
          Sign In</Link>
      </Button>
      </div>
    </main>
  );
}
