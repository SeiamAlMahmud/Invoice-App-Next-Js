import { drizzle} from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";
import { Invoices, Customers } from "./schema";

// Define the configuration for the PostgreSQL connection pool
const poolConfig: PoolConfig = {
    connectionString: process.env.XATA_DATABASE_URL, // Ensure this environment variable is set
    max: 20
};

// Create a new PostgreSQL connection pool with the configuration
const pool = new Pool(poolConfig);

// Initialize drizzle with the connection pool
export const db = drizzle(pool, {
    schema : {
        Invoices,
         Customers
    }
});

// Now, `db` can be used to interact with your database, and TypeScript will understand its methods and types.
