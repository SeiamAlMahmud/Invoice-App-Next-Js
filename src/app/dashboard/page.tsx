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


export default function Home() {
  return (
    <main className="flex flex-col justify-center h-hfull gap-6 text-center max-w-5xl mx-auto my-12">
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
          <TableRow>
            <TableCell className="font-medium text-left p-4">
              <span className="font-bold">
                31/12/2024
              </span>
            </TableCell>
            <TableCell className="text-left p-4">
              <span className="font-bold">
                Philip J.Fry
              </span>
            </TableCell>
            <TableCell className="text-left">fry@planetewxpress.com</TableCell>
            <TableCell className="text-center p-4">
              <Badge className="rounded-full cursor-pointer">Open</Badge>
            </TableCell>
            <TableCell className="text-right p-4">
              <span className="font-bold">
                $250.00
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </main>
  );
}
