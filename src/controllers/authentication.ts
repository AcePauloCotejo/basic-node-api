import express from 'express'

import { createUser, getUserByEmail } from '../db/users'
import { random, authentication } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json(req.body).end()

    const user = await getUserByEmail(email)
      .select('+authentication.password +authentication.salt')

    if (!user) return res.status(404).json(user).end()

    const expectedHash = authentication(user.authentication.salt, password)

    if (user.authentication.password !== expectedHash) return res.status(401).json(user).end()  

    const salt = random()

    user.authentication.sessionToken = authentication(salt, user._id.toString())

    await user.save()

    res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/', httpOnly: true, secure: true, maxAge: 3600000 })

    return res.status(200).json(user).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) return res.status(400).json(req.body).end()

    const existingUser = await getUserByEmail(email)

    if (existingUser) return res.status(409).json(existingUser).end()

    const salt = random()
    
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    })

    return res.status(200).json(user).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
}