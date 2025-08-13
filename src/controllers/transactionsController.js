import { sql } from '../config/db.js';

export async function getTransactionsByUserId(){

   
    // Get transactions for a specific user
    try {
    const { userId } = req.params;

        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
    // Return the transactions
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function createTransaction(req, res) {
    //title, amount, category,user_id
try {
    const { title, amount, category, user_id } = req.body;
    // Validate input
    if (!title || !user_id || !category || amount === undefined) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`INSERT INTO transactions(user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *
    `; // Use RETURNING * to get the inserted row
    // Use RETURNING * to get the inserted row

    console.log(transaction);
    res.status(201).json(transaction[0]); // Return the created transaction'

    // Insert transaction into the database
}catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {

        // Delete a transaction by ID
        try {
            const { id } = req.params;
            // Validate ID
         if (isNaN(parseInt(id))) {
                return res.status(400).json({ message: "Invalid transaction ID" });
            }
            // Delete the transaction
    
            const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
            if (result.length === 0) {
                return res.status(404).json({ message: "Transaction not found" });
            }
    
            res.status(200).json({ message: "Transaction deleted successfully" });
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

export async function getSummaryByUserId(req, res) {
   
    try {
        const { userId } = req.params;
        // Validate userId
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `; 
    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as total_income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `
    const expensesResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `
     res.status(200).json({
        balance: balanceResult[0].balance,
        income: incomeResult[0].total_income,
        expenses: expensesResult[0].expenses
    });
   } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
}

