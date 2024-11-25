"use server";

import Stripe from 'stripe';
import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache"


const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

type AuthDefine = {
    userId: string | null;
    orgId: string | null | undefined;
};


export const createAction = async (formData: FormData) => {
    const { userId, orgId }: AuthDefine = await auth();

    // Parse form data
    const value: number = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = formData.get('description') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        // Insert the new invoice into the database
        const [customer] = await db.insert(Customers)
            .values({
                name,
                email,
                userId,
                organizationId: orgId || null,
            })
            .returning({
                id: Customers.id,
            });

        // Insert the new invoice into the database
        const results = await db.insert(Invoices)
            .values({
                value,
                description,
                userId,
                customerId: customer.id,
                status: 'open',
                organizationId: orgId || null,
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

    const { userId, orgId }: { userId: string | null, orgId: string | null | undefined } = await auth();

    // console.log("userId", userId)
    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        const id = formData.get('id') as string;
        const status = formData.get('status') as Status;
        let results;
        if (orgId) {
            results = await db.update(Invoices)
                .set({ status })
                .where(
                    and(
                        eq(Invoices.id, parseInt(id)),
                        eq(Invoices.organizationId, orgId)
                    )
                )
        } else {
            results = await db.update(Invoices)
                .set({ status })
                .where(
                    and(
                        eq(Invoices.id, parseInt(id)),
                        eq(Invoices.userId, userId),
                        isNull(Invoices.organizationId)
                    )
                )
        }


        console.log("results", results)
        revalidatePath(`/invoices/${parseInt(id)}`, 'page')

    } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
    }


}



export const deleteInvoiceAction = async (formData: FormData) => {

    const { userId, orgId }: { userId: string | null, orgId: string | null | undefined } = await auth();


    if (!userId) {
        // Return an error if user is not authenticated
        throw new Error("User not authenticated");
    }

    try {
        const id = formData.get('id') as string;

        let results;
        if (orgId) {
            results = await db.delete(Invoices)
                .where(
                    and(
                        eq(Invoices.id, parseInt(id)),
                        eq(Invoices.organizationId, orgId)
                    )
                )
        } else {
            results = await db.delete(Invoices)
                .where(
                    and(
                        eq(Invoices.id, parseInt(id)),
                        eq(Invoices.userId, userId),
                        isNull(Invoices.organizationId)
                    )
                )
        }


        console.log("results", results)

        // Indicate success in the response
        return { success: true };

    } catch (error) {
        console.error("Error creating invoice:", error);
        throw new Error("Failed to create invoice");
    }


}
