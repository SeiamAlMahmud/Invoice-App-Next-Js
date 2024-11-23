"use client"
import { Badge } from "@/components/ui/badge";
import { Invoices, Status, statuses } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { ChevronDown } from 'lucide-react';
import { Ellipsis } from 'lucide-react';


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/app/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";
import { useOptimistic } from "react";
import { useRouter } from 'next/navigation'; 


interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({ invoice }: InvoiceProps) {
    
  const router = useRouter();

    const [currentStatus, setCurrentStatus] = useOptimistic(
        invoice.status,
        (state, newStatus) => {
            if (statuses.includes(newStatus as Status)) {
                return newStatus as Status;
            }
            return state; // If invalid, return the previous state
        }
    );

    const handleOnUpdateStatus = async (formData: FormData) => {
        const orginalStatus = currentStatus;
        setCurrentStatus(formData.get('status'))

        try {
            await updateStatusAction(formData)

        } catch (error) {
            console.log(error)
            setCurrentStatus(orginalStatus)
        }
    }

    const handleDeleteInvoice = async (formData: FormData)=> {

        try {
            const result = await deleteInvoiceAction(formData);
            if (result.success) {
                router.push("/dashboard"); // Redirect to /dashboard after deletion 
        }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="w-full h-screen gap-6 mt-10 px-5">
            <Container>
                <div className="flex justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-4">
                        Invoices #{invoice.id}
                        <Badge className={cn(
                            "rounded-full",
                            currentStatus === 'open' && "bg-blue-500",
                            currentStatus === 'paid' && "bg-green-600",
                            currentStatus === 'void' && "bg-zinc-700",
                            currentStatus === 'uncollectible' && "bg-red-600",
                            "cursor-pointer capitalize"
                        )}>{currentStatus}</Badge>
                    </h1>
                    <div className="flex gap-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex item gap-2">
                                    Change status
                                    <ChevronDown className="w-4 h-auto" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {
                                    AVAILABLE_STATUSES.map(item => {
                                        return (
                                            <div key={item.id}>
                                                <DropdownMenuItem className="cursor-pointer w-full ">
                                                    <form action={handleOnUpdateStatus} className="w-full">
                                                        <input type="hidden" name="id" value={invoice.id} />
                                                        <input type="hidden" name="status" value={item.id} />
                                                        <button className="w-full text-left"> {item.label} </button>
                                                    </form>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="last:hidden" />
                                            </div>
                                        )
                                    })
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex item gap-2">
                                    <span className="sr-only">More Options</span>
                                    <Ellipsis className="w-4 h-auto" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>

                                <div >
                                    <DropdownMenuItem className="cursor-pointer w-full ">
                                        <form action={handleDeleteInvoice} className="w-full">
                                            <input type="hidden" name="id" value={invoice.id} />
                                            <button className="w-full text-left"> Delete Invoice </button>
                                        </form>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="last:hidden" />
                                </div>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <p className="text-3xl mb-3">
                    ${(invoice.value / 100).toFixed(2)}
                </p>
                <p className="text-lg mb-8">
                    {invoice.description}
                </p>
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
                        <span></span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Email</strong>
                        <span></span>
                    </li>
                </ul>
            </Container>
        </main>
    );
}
