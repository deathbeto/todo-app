import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const ACCESS_EXPIRES_IN = '30m';
const REFRESH_EXPIRES_IN = '7d';
const ISSUER = 'todo-app-auth';

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'El usuario ya existe' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Error registrando usuario' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const accessToken = jwt.sign({ sub: user._id.toString(), email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
      issuer: ISSUER
    });
    const refreshToken = jwt.sign({ sub: user._id.toString() }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
      issuer: ISSUER
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { issuer: ISSUER });
    const accessToken = jwt.sign({ sub: payload.sub }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
      issuer: ISSUER
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token inválido' });
  }
}
