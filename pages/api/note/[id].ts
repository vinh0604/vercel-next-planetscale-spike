import type { NextApiRequest, NextApiResponse } from 'next'

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, name },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get a mermaid note
      res.status(200).json({ id })
      break
    case 'PUT':
      // Update a mermaid note
      res.status(200).json({ id })
      break
    case 'DELETE':
      // Delete a mermaid note
      res.status(204)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}