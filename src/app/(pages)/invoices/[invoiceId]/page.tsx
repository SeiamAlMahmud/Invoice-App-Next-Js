import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Container from "@/components/Container";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";


interface Status {
  id: 'open' | 'paid' | 'void' | 'uncollectible';
  label: string;
}
const AVAILABLE_STATUSES: Status[] = [
  {
    id: 'open',
    label: 'Open',
  },
  {
    id: 'paid',
    label: 'Paid',
  },
  {
    id: 'void',
    label: 'Void',
  },
  {
    id: 'uncollectible',
    label: 'Uncollectible',
  },
]

export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  // Ensure params are awaited correctly
  const { userId } = await auth();
  if (!userId) return null;

  // Await params before using them
  const invoiceId = parseInt(params.invoiceId, 10);

  if (isNaN(invoiceId)) {
    // If invoiceId is not a valid number, trigger notFound
    notFound();
    throw new Error("Invalid Invoice ID");
  }

  // Fetch the invoice from the database
  const [response] = await db.select()
    .from(Invoices)
    .where(
      and(
        eq(Invoices.id, invoiceId),
        eq(Invoices.userId, userId)
      )
    )
    .limit(1);

  if (!response) {
    notFound();
  }

  return (
    <main className="w-full h-screen gap-6 mt-10 px-5">
      <Container>
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-4">
            Invoices #{invoiceId}
            <Badge className={cn(
              "rounded-full",
              response.status === 'open' && "bg-blue-500",
              response.status === 'paid' && "bg-green-600",
              response.status === 'void' && "bg-zinc-700",
              response.status === 'uncollectible' && "bg-red-600",
              "cursor-pointer capitalize"
            )}>{response.status}</Badge>
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"> Change status </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                AVAILABLE_STATUSES.map(item => {
                  return (
                    <>
                      <DropdownMenuItem key={item.id}>
                        <form>
                          <input type="hidden" name="id" value={invoiceId} />
                          <input type="hidden" name="status" value={item.id} />
                          <button> {item.label} </button>
                        </form>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="last:hidden" />
                    </>
                  )
                })
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-3xl mb-3">
          ${(response.value / 100).toFixed(2)}
        </p>
        <p className="text-lg mb-8">
          {response.description}
        </p>
        <h2 className="text-lg mb-4 font-bold">
          Billing Details
        </h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
            <span>{invoiceId}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
            <span>{new Date(response.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
            <span></span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Email</strong>
            <span></span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
