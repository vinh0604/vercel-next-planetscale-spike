import type { NextApiRequest, NextApiResponse } from "next";
import { NotesDao } from "../../../dao/notes_dao";

const notesDao = new NotesDao();

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
  const note = await notesDao.findById(req.query.id as string);
  if (note != undefined) {
    return res.status(200).json(note);
  } else {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }
}

async function updateNoteHandler(req: NextApiRequest, res: NextApiResponse) {
  const note = await notesDao.findById(req.query.id as string);
  if (note == undefined) {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }

  try {
    await notesDao.update(note.id, req.body.code);
    return res.status(204).send(null);
  } catch (err) {
    console.error(`Note ${req.query.id} failed to update.`, err);
    return res.status(422).json({
      code: "FAILED_OPERATION",
      message: "Cannot update content for Note.",
    });
  }
}

async function deleteNoteHandler(req: NextApiRequest, res: NextApiResponse) {
  const note = await notesDao.findById(req.query.id as string);
  if (note == undefined) {
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "Note does not exist." });
  }

  try {
    await notesDao.delete(note.id);
    return res.status(204).send(null);
  } catch (err) {
    console.error(`Note ${req.query.id} failed to delete.`, err);
    return res
      .status(422)
      .json({ code: "FAILED_OPERATION", message: "Cannot delete Note." });
  }
}
