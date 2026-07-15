import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { conflict, unauthorized } from '../utils/errors.js';
import { signToken } from '../middleware/auth.js';
import type { UserRow } from '../utils/mappers.js';
import { mapUser } from '../utils/mappers.js';

export async function register(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const existing = await query('SELECT pk_id FROM wp_users WHERE email = $1', [normalizedEmail]);
  if (existing.rowCount) {
    throw conflict('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query<UserRow>(
    `INSERT INTO wp_users (name, email, password_hash, subscription, role)
     VALUES ($1, $2, $3, 'FREE', 'USER')
     RETURNING pk_id, name, email, subscription, role`,
    [name, normalizedEmail, passwordHash],
  );
  const user = result.rows[0];
  const token = signToken(user.pk_id, user.email, user.role as 'USER' | 'ADMIN');
  return {
    token,
    userId: user.pk_id,
    name: user.name,
    email: user.email,
    subscription: user.subscription,
    role: user.role,
  };
}

export async function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const result = await query<UserRow & { password_hash: string | null }>(
    'SELECT pk_id, name, email, subscription, role, password_hash FROM wp_users WHERE email = $1',
    [normalizedEmail],
  );
  const user = result.rows[0];
  if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
    throw unauthorized('Invalid email or password');
  }
  const token = signToken(user.pk_id, user.email, user.role as 'USER' | 'ADMIN');
  return {
    token,
    userId: user.pk_id,
    name: user.name,
    email: user.email,
    subscription: user.subscription,
    role: user.role,
  };
}

export async function getProfile(userId: number) {
  const result = await query<UserRow>(
    'SELECT pk_id, name, email, subscription, role FROM wp_users WHERE pk_id = $1',
    [userId],
  );
  const user = result.rows[0];
  if (!user) {
    throw unauthorized('User not found');
  }
  return mapUser(user);
}
