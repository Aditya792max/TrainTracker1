# Trackline

A small train tracking app with a React/Vite client and Express/MongoDB API.

## Start locally

1. Copy `Server/.env.example` to `Server/.env` and set MongoDB, JWT, Redis and RailRadar values. Use a working MongoDB connection string and a JWT secret of at least 32 characters.
2. Install and start the server with `cd Server && npm install && npm run dev`.
3. Start Redis if you want shared rate limiting across server instances. If `REDIS_URL` is omitted, a per-process token bucket is used.
4. Start the client with `cd Client && npm install && npm run dev`.

The API listens on port `5000`; the Vite client listens on port `5173`. Set `CLIENT_URL` if the client origin changes. The RailRadar key stays on the server and is never sent to the browser.

## API

- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`, `DELETE /api/users/:id`
- `GET /api/trains/:number?dataType=full|static|live&journeyDate=YYYY-MM-DD&dataProvider=railradar|NTES`

All routes except registration and login require a bearer JWT. User profile reads and mutations are restricted to the authenticated user's own record. Passwords are bcrypt hashed, and only the last four Aadhaar digits are collected. API requests are limited to a 100-token bucket replenished at 100 tokens per minute.

For a new account, choose **Create account** on the sign-in screen first; then sign in with that email and password. The server must be able to connect to MongoDB before either action can work.
# TrainTracker1
