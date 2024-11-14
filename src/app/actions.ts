"use server"


import { Invoices } from "@/db/schema";
import { db } from "@/db";
import { redirect } from 'next/navigation'

export const createAction = async (formData: FormData) => {

    const value: number = Math.floor(parseFloat(String(formData.get('value'))) * 100);
    const description = formData.get('description') as string;
    // console.log(description)

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

}
