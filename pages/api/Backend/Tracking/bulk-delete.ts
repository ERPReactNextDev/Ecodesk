import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/ModuleCSR/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection("Tracking");
    const { ids } = req.body; // array of IDs from frontend

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided for bulk delete" });
    }

    // Convert string IDs to ObjectId
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await collection.deleteMany({ _id: { $in: objectIds } });

    res.status(200).json({ message: "Bulk delete successful", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "Failed to delete multiple records" });
  }
}
