import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cn } from "@/lib/utils";
import { Result } from "postcss";



export default async function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const invoiceId = parseInt(params.invoiceId, 10);
  if (isNaN(invoiceId)) {
    // If invoiceId is not a valid number, trigger notFound
    notFound();
    throw new Error("Invalid Invoice ID")
  }
  // console.log(first)
  const [response] = await db.select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1)

    if (!response) {
      notFound()
    }
  // console.log(response)

  return (
    <main className=" h-full gap-6  max-w-5xl mx-auto my-12 px-5">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-4">Invoices  #{invoiceId}
          <Badge className={cn(
            "rounded-full",
            response.status === 'open' && " bg-blue-500 ",
            response.status === 'paid' && " bg-green-600 ",
            response.status === 'void' && " bg-zinc-700 ",
            response.status === 'uncollectible' && " bg-red-600 ",
            "cursor-pointer capitalize"
          )}>{response.status}</Badge>
        </h1>
        <p>

        </p>
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

    </main>
  );
  
}

