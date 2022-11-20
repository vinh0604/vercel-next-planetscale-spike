import type { NextApiRequest, NextApiResponse } from "next";
import { Note, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function noteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return await getNoteHandler(req, res);
    case "PUT":
      return await updateNoteHandler(req, res);
    case "DELETE":
      return await deleteNoteHandler(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getNoteHandler(req: NextApiRequest, res: NextApiResponse) {
  const note = await findNote(req.query.id as string);
  if (note != undefined) {
    return res.status(200).json(note);
  } else {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }
}

async function updateNoteHandler(req: NextApiRequest, res: NextApiResponse) {
  const note = await findNote(req.query.id as string);
  if (note == undefined) {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }

  try {
    await prisma.note.update({
      where: {
        id: note.id,
      },
      data: {
        code: req.body.code,
      },
    });
    res.status(204);
  } catch (err) {
    console.error(`Note ${req.query.id} failed to update.`, err);
    return res
      .status(422)
      .json({
        code: "FAILED_OPERATION",
        message: "Cannot update content for Note.",
      });
  }
}

async function deleteNoteHandler(req: NextApiRequest, res: NextApiResponse) {
  const note = await findNote(req.query.id as string);
  if (note == undefined) {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }

  try {
    await prisma.note.delete({
      where: {
        id: note.id,
      },
    });
    res.status(204);
  } catch (err) {
    console.error(`Note ${req.query.id} failed to delete.`, err);
    return res
      .status(422)
      .json({ code: "FAILED_OPERATION", message: "Cannot delete Note." });
  }
}

async function findNote(id: string): Promise<Note | undefined> {
  try {
    return await prisma.note.findFirstOrThrow({
      where: {
        id,
      },
    });
  } catch (err) {
    console.error(`Note ${id} not found`, err);
    return undefined;
  }
}
