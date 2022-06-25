import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.method === "GET") {
    const user = session.user.uid;

    const playlist = await db.collection("playlist").find({ user }).toArray();
    res.status(200).send(playlist);
  }
  if (req.method === "POST") {
    // Process a POST request
    const movies = await db.collection("playlist").insertOne(req.body);
    res.status(200);
  }
}
