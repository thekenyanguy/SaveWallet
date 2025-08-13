import { neon } from '@neondatabase/serverless';
import "dotenv/config";

//Creates a SQL connection using the Neon database URL from the environment variables
//This allows the application to interact with the database using SQL queries
export const sql = neon(process.env.DATABASE_URL)


export async function initDB() {
    try {
        // Create table if not exists with correct constraints
        await sql`
            CREATE TABLE IF NOT EXISTS transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE
            )
        `;

        try {
            await sql`ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_key`;
            await sql`ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_title_key`;
        } catch (err) {
            console.warn("No old unique constraints to drop:", err.message);
        }

        console.log("Database initialized successfully (constraints fixed)");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}