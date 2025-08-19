import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";

export default async function createProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const ticketsCollection = db.collection("Tickets");
    const accountsCollection = db.collection("Accounts");

    const {
      TicketReferenceNumber,
      CompanyName,
      CustomerName,
      Gender,
      ContactNumber,
      Email,
      CustomerSegment,
      CityAddress,
      Traffic,
      TicketReceived,
      TicketEndorsed,
      Channel,
      WrapUp,
      Source,
      CustomerType,
      CustomerStatus,
      Status,
      SONumber,
      SOAmount,
      Quantity,
      Department,
      SalesManager,
      SalesAgent,
      Remarks,
      QuotationNumber,
      QuotationAmount,
      ItemCode,
      ItemDescription,
      PONumber,
      SODate,
      PaymentTerms,
      POSource,
      PaymentDate,
      DeliveryDate,
      POStatus,
      Inquiries,
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
      TicketReferenceNumber,
      CompanyName,
      CustomerName,
      Gender,
      ContactNumber,
      Email,
      CustomerSegment,
      CityAddress,
      Traffic,
      TicketReceived,
      TicketEndorsed,
      Channel,
      WrapUp,
      Source,
      CustomerType,
      CustomerStatus,
      Status,
      SONumber,
      SOAmount,
      Quantity,
      Department,
      SalesManager,
      SalesAgent,
      Remarks,
      QuotationNumber,
      QuotationAmount,
      ItemCode,
      ItemDescription,
      PONumber,
      SODate,
      PaymentTerms,
      POSource,
      PaymentDate,
      DeliveryDate,
      POStatus,
      Inquiries,
      ReferenceID: ReferenceID || "",
      userName: userName || "",
      Role: Role || "",
      createdBy,
      createdAt,
      updatedAt: new Date(),
    };

    // ✅ Insert into Tickets
    const { insertedId: ticketId } = await ticketsCollection.insertOne(ticketData);

    // ✅ Check if Account already exists with same CompanyName + CustomerName + ContactNumber
    const existingAccount = await accountsCollection.findOne({
      CompanyName,
      CustomerName,
      ContactNumber,
    });

    if (!existingAccount) {
      const accountData = {
        CompanyName,
        CustomerName,
        ContactNumber,
        Gender,
        Email,
        CityAddress,
        CustomerSegment,
        userName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await accountsCollection.insertOne(accountData);
    }

    res.status(201).json({ message: "Data created in Tickets (and Accounts if new)", ticketId });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
