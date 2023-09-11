import express from 'express';

import { UserModel, deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers()

    return res.status(200).json(users).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const deleteUser = await deleteUserById(id)

    return res.status(200).json(deleteUser).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) return res.status(400).json({ 'error': 'username is required' }).end()

    const user = await getUserById(id)

    user.username = username

    await user.save()

    return res.status(200).json(user).end()
  } catch (error) {
    return res.status(400).json(error).end()
  }
}