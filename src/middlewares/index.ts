import express from 'express'
import { get, merge } from 'lodash'

import { getUserBySessionToken } from '../db/users'

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = get(req, 'cookies.sessionToken')

    if (!sessionToken) return res.status(401).json({ 'error': sessionToken }).end()

    const existingUser = await getUserBySessionToken(sessionToken)

    if (!existingUser) return res.status(401).json({ 'error': existingUser }).end()

    merge(req, { identity: existingUser })

    return next()
  } catch (error) {
    return res.status(401).json({ 'error': error }).end()
  }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity._id') as string

    if (!currentUserId) return res.status(401).json({ 'error': currentUserId }).end()

    if (currentUserId.toString() !== id) return res.status(401).json({ 'error': currentUserId }).end()

    return next()
  } catch (error) {
    return res.status(400).json({ 'error': error }).end()
  }
}