import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const session = await getSession({ req });

  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    const mid = parseInt(id);
    await db
      .collection("playlist")
      .deleteOne({ "movie.id": mid, user: session.user.uid });
    res.status(200);
  }
}
