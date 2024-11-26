import { notFound } from "next/navigation";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { Page, Text, View, Document, StyleSheet, renderToStream } from '@react-pdf/renderer';
import { NextResponse } from "next/server";
// import Invoice from "../Invoice";
// import { text } from "stream/consumers";



// Create styles
const styles = StyleSheet.create({
    page: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 50
    },
    section: {
        marginBottom: 40
    },
    header: {
        fontSize: 18,
        marginBottom: 8
    },
    text: {
        fontSize: 14,
        marginBottom: 6
    },
    title: {
        fontSize: 22,
        marginBottom: 6
    },
    date: {
        fontSize: 14,
        marginBottom: 8
    },
    status: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: 50,
        color: 'white',
        fontSize: 12,
        paddingHorizontal: 4,
        paddingVertical: 4,
        backgroundColor: 'blue',
        borderRadius: 99,
    },
    value: {
        fontSize: 26,
        marginBottom: 10
    }

});

type Invoice = typeof Invoices.$inferSelect;

interface InvoiceProps extends Invoice {
    customer: typeof Customers.$inferSelect
}

const MyDocument = ({ id, value, description, createTs, status, customer }: InvoiceProps) => (
    <Document>
        <Page style={styles.page}>
            <View>
                <View style={styles.section}>
                    <Text style={styles.title}>Invoice {id}</Text>
                    <Text style={styles.date}>{new Date(createTs).toLocaleDateString()}</Text>
                    <Text style={styles.status}> {status.toUpperCase()}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.value}>{value / 100} </Text>
                    <Text style={styles.text}>{description} </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Billed To </Text>
                    <Text style={styles.text}>Name: {customer.name} </Text>
                    <Text style={styles.text}>Email: {customer.email} </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.header}>Payment Details </Text>
                    <Text style={styles.text}>Bank of the Universe</Text>
                    <Text style={styles.text}>12345678 </Text>
                    <Text style={styles.text}>12365440 </Text>
                </View>
            </View>
            <View>
                <Text style={styles.text}>Colby Fayock</Text>
                <Text style={styles.text}>Colby@gmail.com</Text>
            </View>
        </Page>
    </Document>
)
// Create Document Component
// const MyDocument = ({ id, value, description, createTs, status, customer }: InvoiceProps) => (
//     <Document>
//         <Page size="A4" style={styles.page}>
//             <Text style={styles.title}>Invoice {id}</Text>
//             <View>
//                 <View style={styles.section}>

//                     <View style={styles.section}>
//                         <Text style={styles.title}>Invoice {id}</Text>
//                         <Text style={styles.date}>{new Date(createTs).toLocaleDateString()}</Text>
//                         <Text style={styles.status}> {status.toUpperCase()}</Text>
//                     </View>
//                 </View>
//             </View>

//             <View style={styles.section}>
//                 <Text>Section #2</Text>
//             </View>
//         </Page>
//     </Document>
// );




export async function GET(request: Request, { params }: { params: { invoiceId: string } }) {

    const invoiceId = parseInt(params.invoiceId, 10);

    const { userId, orgId } = await auth();
    if (!userId) return null;
    // Await params before using them

    if (isNaN(invoiceId)) {
        // If invoiceId is not a valid number, trigger notFound
        notFound();
        throw new Error("Invalid Invoice ID");
    }

    // Fetch the invoice from the database
    let response;

    if (orgId) {
        [response] = await db.select()
            .from(Invoices)
            .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
            .where(
                and(
                    eq(Invoices.id, invoiceId),
                    eq(Invoices.organizationId, orgId)
                )
            )
            .limit(1);
    } else {
        [response] = await db.select()
            .from(Invoices)
            .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
            .where(
                and(
                    eq(Invoices.id, invoiceId),
                    eq(Invoices.userId, userId),
                    isNull(Invoices.organizationId)
                )
            )
            .limit(1);
    }



    if (!response) {
        notFound();
    }

    const invoice = {
        ...response.invoices,
        customer: response.customers,
    }

    const stream = await renderToStream(<MyDocument {...invoice} />);

    return new NextResponse(stream as unknown as ReadableStream)
}