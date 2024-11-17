"use server";

import { Invoices } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export const createAction = async (formData: FormData) => {
    const { userId }: { userId: string | null } = await auth();
    
    // Parse form data
    const value: number = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = formData.get('description') as string;

    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        // Insert the new invoice into the database
        const results = await db.insert(Invoices)
            .values({
                value,
                description,
                userId,
                status: 'open',
            })
            .returning({
                id: Invoices.id,
            });

            
        // Return the ID of the newly created invoice (this will be used for redirection)
        return { id: results[0].id };
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
    }
};
