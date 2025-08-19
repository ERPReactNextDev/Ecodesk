import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const db = await connectToDatabase();
        const ticketsCollection = db.collection("PO");

        const {
            CompanyName,
            ContactNumber,
            SalesAgent,
            POSource,
            POStatus,
            PONumber,
            POAmount,
            PORemarks,
            SONumber,
            SODate,
            PaymentTerms,
            PaymentDate,
            DeliveryDate,
            createdAt,
            ReferenceID,
            userName,
            Role,
            createdBy
        } = req.body;

        if (!CompanyName) {
            return res.status(400).json({ error: "Missing required fields: name of the company." });
        }

        const ticketData = {
            CompanyName,
            ContactNumber,
            SalesAgent,
            POSource,
            POStatus,
            PONumber,
            POAmount,
            PORemarks,
            SONumber,
            SODate,
            PaymentTerms,
            PaymentDate,
            DeliveryDate,
            ReferenceID: ReferenceID || "",
            userName: userName || "",
            Role: Role || "",
            createdBy,
            createdAt,
            updatedAt: new Date(),
        };

        // ✅ Insert into Tickets
        const { insertedId: ticketId } = await ticketsCollection.insertOne(ticketData);
        res.status(201).json({ message: "Data created in Tickets (and Accounts if new)", ticketId });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
