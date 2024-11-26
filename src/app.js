import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import expressMySQLSession from 'express-mysql-session';
import dotenv from 'dotenv';

import CharacterItemRouter from './routes/character.item.router.js';
import InventoryRouter from './routes/Inventory.router.js';
import ItemRouter from './routes/item.router.js';
import CharacterRouter from './routes/character.router.js';
import UsersRouter from './routes/users.router.js';
import LogMiddleware from './middlewares/log.middleware.js';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

dotenv.config();

const app = express();
const PORT = 3020;

const MySQLStore = expressMySQLSession(expressSession);
const sessionStore = new MySQLStore({
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true,
});

app.use(LogMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // 클라이언트에서 쿠키 접근 차단
      secure: false, // HTTPS에서만 작동하도록 설정 (로컬 개발에서는 false)
      maxAge: 1000 * 60 * 60 * 24, //1일 동안 쿠키를 사용할 수 있도록 설정한다.
    },
    store : sessionStore,
  })
);

app.use('/api', [UsersRouter, CharacterRouter, ItemRouter, InventoryRouter, CharacterItemRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});