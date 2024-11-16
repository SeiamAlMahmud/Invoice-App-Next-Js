
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col justify-center h-screen gap-6 text-center max-w-5xl mx-auto">
      <h1 className="text-5xl font-bold">Invoicepedia</h1>
      <div>

      </div>
      <div className='my-5'>
          <Button asChild>
        <Link href="/dashboard">
          Dashboard</Link>
      </Button>
      </div>
    </main>
  );
}
