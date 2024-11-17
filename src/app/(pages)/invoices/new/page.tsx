"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Form from 'next/form';
import { createAction } from "@/app/actions";
import { SyntheticEvent, useState, useEffect, startTransition } from "react";
import { useRouter } from 'next/navigation';  // import useRouter for navigation

export default function Home() {
    const [state, setState] = useState("ready");
    const [invoiceId, setInvoiceId] = useState<number | null>(null);
    const router = useRouter();  // Hook to handle redirection

    const handleOnSubmit = async (event: SyntheticEvent) => {
        if (state === 'pending') {
            event.preventDefault();
            return;
        }

        setState("pending");
        const target = event.target as HTMLFormElement;

        // Using the startTransition to manage state updates without blocking UI rendering
        startTransition(async () => {
            const formData = new FormData(target);

            try {
                // Call the server action and get the new invoice ID
                const result = await createAction(formData);
                const { id } = result; // Get the ID of the created invoice

                setInvoiceId(id); // Update local state with the new invoice ID
            } catch (error) {
                console.error("Error during form submission:", error);
                setState("ready");
            }
        });
    }

    // After state update with invoice ID, redirect to the invoice details page
    useEffect(() => {
        if (invoiceId !== null) {
            router.push(`/invoices/${invoiceId}`);
        }
    }, [invoiceId, router]);  // Trigger the effect when invoiceId changes

    return (
        <main className="flex flex-col justify-center h-full gap-6 max-w-5xl mx-auto my-12 px-5">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Invoices</h1>
            </div>

            <Form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 max-w-sm">
                <div>
                    <Label htmlFor="name" className="block mb-2 font-semibold text-sm">Billing Name</Label>
                    <Input name="name" id="name" type="text" />
                </div>
                <div>
                    <Label htmlFor="email" className="block mb-2 font-semibold text-sm">Billing Email</Label>
                    <Input name="email" id="email" type="text" />
                </div>
                <div>
                    <Label htmlFor="value" className="block mb-2 font-semibold text-sm">Value</Label>
                    <Input name="value" id="value" type="text" />
                </div>
                <div>
                    <Label htmlFor="description" className="block mb-2 font-semibold text-sm">Description</Label>
                    <Textarea name="description" id="description" />
                </div>
                <div>
                    <Button type="submit" disabled={state === 'pending'}>Submit</Button>
                </div>
            </Form>
        </main>
    );
}
