
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { CirclePlus } from 'lucide-react';
import Link from "next/link";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";


interface Invoice {
  id: number;
  createTs: Date;
  value: number;
  description: string;
  status: string;
  // Add additional fields for customer name/email if they exist
}

export default async function Home() {
  const results = await db.select().from(Invoices);
  console.log(results, "results")
  return (
    <main className="flex flex-col justify-center h-full gap-6 text-center max-w-5xl mx-auto my-12">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p>
          <Button variant="ghost" className="inline-flex gap-2" asChild>
            <Link href={"/invoices/new"}>
              <CirclePlus />
              Create Invoice
            </Link>
          </Button>
        </p>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="text-left">Customer</TableHead>
            <TableHead className="text-left">Email</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            results.map((invoice: Invoice) => {
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-left  p-0">
                    <Link href={`/invoices/${invoice.id}`} className="font-bold  block p-4">
                      {new Date(invoice.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0 ">
                    <Link href={`/invoices/${invoice.id}`} className="font-bold  block p-4">
                      Philip J.Fry
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">fry@planetewxpress.com</TableCell>
                  <TableCell className="text-center p-0 ">
                    <Link href={`/invoices/${invoice.id}`} className=" block p-4">
                      <Badge className={cn(
                        "rounded-full",
                        invoice.status === 'open' && " bg-blue-500 ",
                        invoice.status === 'paid' && " bg-green-600 ",
                        invoice.status === 'void' && " bg-zinc-700 ",
                        invoice.status === 'uncollectible' && " bg-red-600 ",
                        "cursor-pointer capitalize"
                      )}>{invoice.status}</Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right p-0">
                    <Link href={`/invoices/${invoice.id}`} className="font-bold  block p-4">
                      ${(invoice.value / 100).toFixed(2)}
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })
          }

        </TableBody>
      </Table>

    </main>
  );
}
