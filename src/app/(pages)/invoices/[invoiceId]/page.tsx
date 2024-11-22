import { notFound } from "next/navigation";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";

export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  // Ensure params are awaited correctly
  const { userId } = await auth();
  if (!userId) return null;

  // Await params before using them
  const invoiceId = parseInt((await params).invoiceId, 10);

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

  return <Invoice invoice={response} />
}
