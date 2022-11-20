import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function notesHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { code },
    method,
  } = req

  switch (method) {
    case 'POST':
      const note = await prisma.note.create({
        data: {
          code
        }
      })
      return res.status(201).json(note)
    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}