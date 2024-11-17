"use server"


import { Invoices } from "@/db/schema";
import { db } from "@/db";
import { redirect } from 'next/navigation';
import { auth } from "@clerk/nextjs/server";

export const createAction = async (formData: FormData) => {

    const { userId }: { userId: string | null } = await auth()
    const value: number = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = formData.get('description') as string;
    // console.log(description)
    if (!userId) return new Response('User is not signed in.', { status: 401 });
    try {


        const results = await db.insert(Invoices)
            .values({
                value,
                description,
                status: 'open'
            })
            .returning({
                id: Invoices.id
            })
        // console.log(results, "results")
        redirect(`/invoices/${results[0].id}`)
    } catch (error) {
        console.log(error)
        return Response.json(error)
    }
}
