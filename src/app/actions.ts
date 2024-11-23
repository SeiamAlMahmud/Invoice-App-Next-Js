"use server";

import { Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache"

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



export const updateStatusAction = async (formData: FormData) => {

    const { userId }: { userId: string | null } = await auth();

    // console.log("userId", userId)
    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        const id = formData.get('id') as string;
        const status = formData.get('status') as Status;

        const results = await db.update(Invoices)
            .set({ status })
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.userId, userId)
                )
            )

        console.log("results", results)
        revalidatePath(`/invoices/${parseInt(id)}`, 'page')

    } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
    }


}



export const deleteInvoiceAction = async (formData: FormData) => {

    const { userId }: { userId: string | null } = await auth();

    
    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        const id = formData.get('id') as string;

        const results = await db.delete(Invoices)
            .where(
                and(
                    eq(Invoices.id, parseInt(id)),
                    eq(Invoices.userId, userId)
                )
            )

        console.log("results", results)
        
          // Indicate success in the response
          return { success: true };

    } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
    }


}
