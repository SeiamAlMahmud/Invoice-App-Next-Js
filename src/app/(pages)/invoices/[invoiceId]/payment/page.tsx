import { Badge } from "@/components/ui/badge";
import { Customers, Invoices, Status, statuses } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { Check, ChevronDown, CreditCard, Trash2 } from 'lucide-react';
import { Ellipsis } from 'lucide-react';


import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/app/data/invoices";
import { updateStatusAction, deleteInvoiceAction, createPayment } from "@/app/actions";
import { useOptimistic, useState } from "react";
import { notFound, useRouter } from 'next/navigation';
import SubmitButton from "@/components/SubmitButton";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";


export default async function InvoicePage({ params }: { params: Promise<{ invoiceId: string }> }) {

    // Await params before using them
    const invoiceId = parseInt((await params).invoiceId, 10);

    if (isNaN(invoiceId)) {
        // If invoiceId is not a valid number, trigger notFound
        notFound();
        throw new Error("Invalid Invoice ID");
    }

    // Fetch the invoice from the database
    const [response] = await db.select({
        id: Invoices.id,
        status: Invoices.status,
        createTs: Invoices.createTs,
        description: Invoices.description,
        value: Invoices.value,
        name: Customers.name
    })
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.id, invoiceId),
        )
        .limit(1);

    if (!response) {
        notFound();
    }

    const invoice = {
        ...response,
        customer: {
            name: response.name
        },
    }

    // return <Invoice invoice={invoices} />

    return (
        <main className="w-full h-screen gap-6 mt-10 px-5">
            <Container>
                <div className="grid grid-cols-2">
                    <div>
                        <div className="flex justify-between mb-8">
                            <h1 className="text-3xl font-bold flex items-center gap-4">
                                Invoices #{invoice.id}
                                <Badge className={cn(
                                    "rounded-full",
                                    invoice.status === 'open' && "bg-blue-500",
                                    invoice.status === 'paid' && "bg-green-600",
                                    invoice.status === 'void' && "bg-zinc-700",
                                    invoice.status === 'uncollectible' && "bg-red-600",
                                    "cursor-pointer capitalize"
                                )}>
                                    {invoice.status}
                                </Badge>
                            </h1>


                        </div>
                        <p className="text-3xl mb-3">
                            ${(invoice.value / 100).toFixed(2)}
                        </p>
                        <p className="text-lg mb-8">
                            {invoice.description}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
                        {
                            invoice.status === 'open' && (
                                <form action={createPayment}>
                                    <input type="hidden" name="id" value={invoice.id} />
                                    <Button className="flex gap-2 bg-green-700 font-bold">
                                        <CreditCard className="w-5 h-auto" />
                                        Pay Invoice
                                    </Button>
                                </form>
                            )
                        }
                        {
                            invoice.status === 'paid' && (
                                <p className="text-xl font-bold flex gap-2">
                                    <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                                    Invoice Paid
                                </p>
                            )
                        }
                    </div>
                </div>
                <h2 className="text-lg mb-4 font-bold">
                    Billing Details
                </h2>

                <ul className="grid gap-2">
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
                        <span>{invoice.id}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
                        <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
                        <span>{invoice.customer.name}</span>
                    </li>
                </ul>
            </Container>
        </main>
    );
}
