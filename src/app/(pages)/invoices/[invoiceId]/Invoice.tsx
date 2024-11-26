"use client"
import { Badge } from "@/components/ui/badge";
import { Customers, Invoices, Status, statuses } from "@/db/schema";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { ChevronDown, CreditCard, FileDown, Trash2 } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
// import html2pdf from 'html2pdf.js'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


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
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";


interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect & {
        customer: typeof Customers.$inferSelect
    };
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
            await updateStatusAction({ formData })

        } catch (error) {
            console.log(error)
            setCurrentStatus(orginalStatus)
        }
    }

    const handleDeleteInvoice = async (formData: FormData) => {
        try {
           
            const result = await deleteInvoiceAction(formData);
            if (result.success) {
               
                router.push("/dashboard"); // Redirect to /dashboard after deletion 
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleOnClick =async ()=> {
        const html2pdf = await require('html2pdf.js')
        const element = document.getElementById("invoice")!; // Assert that the element is not null
        html2pdf(element, {
            margin: 20
        })
        
    }
    return (
        <main className="w-full h-screen gap-6 mt-10 px-5">
            <Container  id="invoice">
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
                    <div
                    data-html2canvas-ignore
                    className="flex gap-3 justify-between">
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

                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <span className="sr-only">More Options</span>
                                        <Ellipsis className="w-4 h-auto" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <div className="Container">
                                        <DropdownMenuItem className="cursor-pointer w-full">
                                            <DialogTrigger asChild>
                                                <span role="button" className="w-full text-left flex gap-2 cursor-pointer">
                                                    <Trash2 className="w-4 h-auto" />
                                                    Delete Invoice
                                                </span>
                                            </DialogTrigger>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer w-full">

                                            <Link href={`/invoices/${invoice.id}/payment`} className="w-full text-left flex gap-2 cursor-pointer">
                                                <CreditCard className="w-4 h-auto" />
                                                Payment
                                            </Link>

                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer w-full">

                                            <button 
                                            onClick={handleOnClick} className="w-full text-left flex gap-2 cursor-pointer">
                                                <FileDown className="w-4 h-auto" />
                                                Download Invoice
                                            </button>

                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="last:hidden" />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DialogContent className="bg-white">
                                <DialogHeader className="space-y-4">
                                    <DialogTitle className="text-3xl text-center">Delete Invoice?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your Invoice
                                        and remove your data from our servers.
                                    </DialogDescription>

                                    <DialogFooter>
                                        <form action={handleDeleteInvoice} className="w-1/2 flex justify-center mx-auto">
                                            <input type="hidden" name="id" value={invoice.id} />
                                            <SubmitButton
                                                text="Delete Invoice"
                                                text2="Deleteing Invoice..."
                                                variant="destructive"
                                            />
                                        </form>
                                    </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>




                    </div>
                </div>
                <div>
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
                        <span>{invoice.customer.name}</span>
                    </li>
                    <li className="flex gap-4">
                        <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Email</strong>
                        <span>{invoice.customer.email}</span>
                    </li>
                </ul>
                </div>
            </Container>
        </main>
    );
}
