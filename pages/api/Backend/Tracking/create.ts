import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function create(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const db = await connectToDatabase();
        const Collection = db.collection("Tracking");

        const {
            DateRecord,
            CompanyName,
            CustomerName,
            ContactNumber,
            TicketType,
            TicketConcern,
            Department,
            EndorsedDate,
            ClosedDate,
            Status,
            SalesAgent,
            SalesManager,
            Remarks,
            NatureConcern,
            ReferenceID,
            userName,
            Role,
            createdBy
        } = req.body;

        if (!CompanyName) {
            return res.status(400).json({ error: "Missing required fields: name of the company." });
        }

        const ticketData = {
            DateRecord,
            CompanyName,
            CustomerName,
            ContactNumber,
            TicketType,
            TicketConcern,
            Department,
            EndorsedDate,
            ClosedDate,
            Status,
            SalesAgent,
            SalesManager,
            Remarks,
            NatureConcern,
            ReferenceID: ReferenceID || "",
            userName: userName || "",
            Role: Role || "",
            createdBy,
            updatedAt: new Date(),
        };

        // ✅ Insert into Tracking
        const { insertedId: ticketId } = await Collection.insertOne(ticketData);
        res.status(201).json({ message: "Data created in Tracking (and Accounts if new)", ticketId });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
