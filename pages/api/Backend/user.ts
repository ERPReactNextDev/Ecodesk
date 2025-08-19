import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await connectToDatabase();
    const userId = req.query.id as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      let query = {};
      if (ObjectId.isValid(userId)) {
        query = { _id: new ObjectId(userId) };
      } else {
        query = { ReferenceID: userId };
      }

      const user = await db.collection("users").findOne(query);

      if (user) {
        const { password, ...userData } = user;
        return res.status(200).json(userData);
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
