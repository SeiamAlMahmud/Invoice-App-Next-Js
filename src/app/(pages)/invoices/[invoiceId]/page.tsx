import { notFound } from "next/navigation";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Invoice from "./Invoice";



export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {
  // Ensure params are awaited correctly
  const { userId, orgId } = await auth();
  if (!userId) return null;

  // Await params before using them
  const invoiceId = parseInt((await params).invoiceId, 10);

  if (isNaN(invoiceId)) {
    // If invoiceId is not a valid number, trigger notFound
    notFound();
    throw new Error("Invalid Invoice ID");
  }

  // Fetch the invoice from the database
  let response;

  if (orgId) {
    [response] = await db.select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.organizationId, orgId)
        )
      )
      .limit(1);
  } else {
    [response] = await db.select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }



  if (!response) {
    notFound();
  }

  const invoices = {
    ...response.invoices,
    customer: response.customers,
  }
  return <Invoice invoice={invoices} />
}
