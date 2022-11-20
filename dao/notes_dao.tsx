import { Note, PrismaClient } from "@prisma/client";

export class NotesDao {
  db: PrismaClient;
  constructor() {
    this.db = new PrismaClient();
  }

  async findById(id: string): Promise<Note> {
    try {
      return await this.db.note.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      console.error(`Note ${id} not found`, err);
      return undefined;
    }
  }

  async create(code: string) {
    return await this.db.note.create({
      data: {
        code: code
      },
    });
  }

  async update(id: string, code: string) {
    return await this.db.note.update({
      where: {
        id: id,
      },
      data: {
        code: code,
        updatedAt: new Date()
      },
    });
  }

  async delete(id: string) {
    return await this.db.note.delete({
      where: {
        id: id,
      }
    });
  }
}