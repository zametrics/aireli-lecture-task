import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import { createUser } from "../models/User"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const newUser = {
    email,
    password
  } as PlatformUser;

  try {
    const user = await createUser(newUser);

    if (!user) {
      res.status(500).json({ message: 'User could not be created' });
      return;
    }

    res.status(201).json({ user });
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE constraint failed')) {
      res.status(409).json({ message: 'Email already exists' });
      return;
    }

    res.status(500).json({ message: 'Registration failed' });
  }
};