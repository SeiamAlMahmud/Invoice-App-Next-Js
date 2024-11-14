
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import Link from "next/link";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";



export default async function InvoicePage({ params }: { params: {invoiceId: string }}) {
  const invoiceId = params.invoiceId;
  // console.log(first)
  const [response] = await db.select()
  .from(Invoices)
  .where(eq(Invoices.id, invoiceId))
  .limit(1)
  console.log(response)
  return (
    <main className="flex flex-col justify-center h-hfull gap-6 text-center max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Invoices  #{invoiceId}</h1>
        <p>

        </p>
      </div>



    </main>
  );
}

