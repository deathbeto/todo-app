import jwt from 'jsonwebtoken';

const ISSUER = process.env.AUTH_ISSUER || 'todo-app-auth';

export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { issuer: ISSUER });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
