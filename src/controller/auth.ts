// src/controller/auth.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// 1) Define your full DB schema in one place:
interface Database {
  users: {
    id: string;
    email: string;
    password: string;
  };
  // …add other tables here…
}

// 2) Create a typed Supabase client:
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const jwtSecret = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<any>=> {
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into 'users' and return id & email
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword }])
      .select('id, email');

    if (error || !data) {
      return res.status(400).json({ error: error?.message });
    }

    const user = data[0];
    // Sign a JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed.' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    // Fetch the user (including hashed password)
    const { data, error } = await supabase
      .from('users')
      .select('id, email, password')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Compare hashes
    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Issue a new token
    const token = jwt.sign(
      { userId: data.id, email: data.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: { id: data.id, email: data.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed.' });
  }
};
