"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAction } from "@/app/actions";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';  // Import useRouter for navigation

export default function Home() {
    const [state, setState] = useState("ready");
    const [invoiceId, setInvoiceId] = useState<number | null>(null);
    const router = useRouter();  // Hook to handle redirection

    // After state update with invoiceId, redirect to the invoice details page
    useEffect(() => {
        if (invoiceId !== null) {
            router.push(`/invoices/${invoiceId}`);
        }
    }, [invoiceId, router]);  // Trigger the effect when invoiceId changes

    // Function to handle form submission
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission
        setState("pending"); // Set state to pending while submitting

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const result = await createAction(formData);
            const { id } = result; // Get the ID of the newly created invoice
            setInvoiceId(id); // Set the invoice ID for redirection
        } catch (error) {
            console.error("Error during form submission:", error);
            setState("ready");
        }
    };

    return (
        <main className="flex flex-col justify-center h-full gap-6 max-w-5xl mx-auto my-12 px-5">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Invoices</h1>
            </div>

            {/* Form with onSubmit handler for manual form submission */}
            <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
                <div>
                    <Label htmlFor="name" className="block mb-2 font-semibold text-sm">Billing Name</Label>
                    <Input name="name" id="name" type="text" required />
                </div>
                <div>
                    <Label htmlFor="email" className="block mb-2 font-semibold text-sm">Billing Email</Label>
                    <Input name="email" id="email" type="email" required />
                </div>
                <div>
                    <Label htmlFor="value" className="block mb-2 font-semibold text-sm">Value</Label>
                    <Input name="value" id="value" type="number" step="0.01" required />
                </div>
                <div>
                    <Label htmlFor="description" className="block mb-2 font-semibold text-sm">Description</Label>
                    <Textarea name="description" id="description" required />
                </div>
                <div>
                    {/* Submit button with conditional disable */}
                    <Button type="submit" disabled={state === 'pending'}>Submit</Button>
                </div>
            </form>
        </main>
    );
}
