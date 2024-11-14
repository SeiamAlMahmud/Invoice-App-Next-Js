"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { sql } from 'drizzle-orm'
import { db } from "@/db"
import { createAction } from "@/app/actions";
import { SyntheticEvent, useState } from "react";

export default function Home() {

    const [state, setState] = useState("ready");
    const handleOnSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if(state === 'pending') return;
        setState("pending");
        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        await createAction(formData)
        console.log("hey")
    }


    return (
        <main className="flex flex-col justify-center h-hfull gap-6  max-w-5xl mx-auto my-12">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Invoices</h1>
            </div>

            <form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 max-w-sm">
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
                    <Button className="w-full font-semibold">Submit</Button>
                </div>
            </form>

        </main>
    );
}
