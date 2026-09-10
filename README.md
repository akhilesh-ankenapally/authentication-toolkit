# Cybersecurity Authentication Toolkit Prototype

An educational cybersecurity prototype developed as a college assignment demonstration. It illustrates modern identity management principles, client- and server-side password complexity policies, salted cryptographic password hashing (`bcrypt`), stateless token authentication (`JWT`), and brute-force mitigation controls.

---

## 1. Problem Statement

Many modern web applications suffer from authentication vulnerabilities such as plaintext credential storage, predictable password acceptance, credential stuffing, and brute-force attacks. Standard insecure hashing algorithms like MD5 or plain SHA-256 are vulnerable to offline rainbow table lookups and high-speed GPU cracking. Additionally, poor session management exposes systems to token replay and unauthorized session hijackings.

## 2. Objective

The objective of this project is to implement an end-to-end, functional prototype that demonstrates defensive security controls for user authentication:
- Enforce strict password complexity checks (length, character classes, entropy).
- Prevent credential exposure by applying one-way salted hashing with an adaptive work factor (`bcrypt`).
- Provide stateless, cryptographically signed session management using JSON Web Tokens (JWT).
- Mitigate automated brute-force attacks through IP-based request rate limiting.
- Provide a clean, intuitive cybersecurity dashboard that can be demonstrated and evaluated in under 5 minutes.

---

## 3. Features

| Feature | Cybersecurity Implementation | Security Impact |
| :--- | :--- | :--- |
| **User Registration** | Sanitized inputs, duplicate account checks, multi-factor criteria validation. | Prevents account overwrite and weak password inception. |
| **Password Strength Checker** | Real-time visual feedback meter and checklist (length, [A-Z], [a-z], [0-9], symbols). | Guides users toward high-entropy passwords before submission. |
| **Secure Password Hashing** | One-way hashing via `bcrypt` with `saltRounds = 10`. Passwords never stored in plaintext. | Immunizes against precomputed rainbow table attacks and GPU dictionary cracking. |
| **User Login** | Constant-time password hash comparison via `bcrypt.compare`. | Protects against timing attacks and credential exposure. |
| **JWT Authentication** | Signed bearer tokens (`HS256` algorithm) with configurable expiration (`1h`). | Ensures cryptographically verifiable, stateless user identity. |
| **Basic Session Management** | Client-side bearer token authorization, token verification endpoint, and one-click session termination (logout). | Limits exposure window and prevents unauthorized access upon session termination. |
| **Basic Security Controls** | Rate limiting on authentication routes (maximum 5 attempts per IP per 15-minute window). | Thwarts automated credential guessing and brute-force attacks. |
| **Demo Autofill Mode** | Built-in single-click test credential generation. | Enables rapid evaluation and live demonstration in under 5 minutes. |

---

## 4. Technologies Used

### Frontend
- **React 18** (Vite build system)
- **Lucide Icons** (Cybersecurity visual indicators)
- **Custom CyberSec CSS System** (Dark theme, neon accents, responsive layout, glassmorphic HUD)

### Backend
- **Node.js** & **Express.js**
- **bcryptjs** (Adaptive salted cryptographic hashing)
- **jsonwebtoken** (JWT creation, signing, and verification)
- **express-rate-limit** (Brute-force protection middleware)
- **cors** & **dotenv**

### Database
- **MongoDB** (via Mongoose ODM) with a single `User` collection.
- *Zero-Config Fallback*: Supports standalone in-memory execution if no local MongoDB service is detected, enabling instant demonstration without configuration hurdles.

---

## 5. System Architecture & How It Works

### High-Level Architecture Diagram
```
+-----------------------------------------------------------------------------------+
|                                 CLIENT (React + Vite)                             |
|  +---------------------+   +-----------------------+   +-----------------------+  |
|  |    Register Page    |   |      Login Page       |   |       Dashboard       |  |
|  | (Strength Checker)  |   |  (Rate Limit Notice)  |   | (JWT Session / Auth)  |  |
|  +----------+----------+   +-----------+-----------+   +-----------+-----------+  |
+-------------|--------------------------|---------------------------|--------------+
              | POST /api/register       | POST /api/login           | GET /api/profile
              v                          v                           v (Bearer Token)
+-----------------------------------------------------------------------------------+
|                              BACKEND (Express.js API)                             |
|  +---------------------+   +-----------------------+   +-----------------------+  |
|  | Password Validator  |   | Rate Limiter (Max: 5) |   | JWT Verify Middleware |  |
|  |  (Complexity Rules) |   | (Brute Force Defense) |   |    (Header Check)     |  |
|  +----------+----------+   +-----------+-----------+   +-----------+-----------+  |
|             |                          |                           |              |
|             v                          v                           v              |
|     bcrypt.hash(pwd, 10)       bcrypt.compare(pwd, hash)     Token Signature OK?  |
+-------------|--------------------------|---------------------------|--------------+
              |                          |                           |
              +--------------------------+---------------------------+
                                         |
                                         v
                      +-------------------------------------+
                      |       MongoDB / In-Memory Store     |
                      |      (Single 'User' Collection)     |
                      |  - username                         |
                      |  - email                            |
                      |  - password (bcrypt $2b$10$... hash)|
                      |  - createdAt                        |
                      +-------------------------------------+
```

### 1. Authentication Flow
1. **Registration**:
   - User enters credentials.
   - The password must satisfy all 5 requirements: min 8 characters, uppercase, lowercase, digit, and symbol.
   - The backend validates the inputs, hashes the password using `bcrypt.hash(password, 10)`, and saves the record.
2. **Login**:
   - The user submits their identifier (username/email) and password.
   - The rate limiter checks if the client IP has exceeded 5 failed attempts in the current window.
   - The backend retrieves the user record and executes `bcrypt.compare(plaintextPassword, storedHash)`.
   - Upon verification, an `HS256` signed JWT containing `{ id, username, email }` is issued with a 1-hour expiration.
3. **Session Management**:
   - The client stores the JWT in `localStorage` and attaches it to the `Authorization: Bearer <token>` header.
   - Protected endpoints (such as `/api/profile`) pass through `authenticateToken` middleware which verifies token integrity and expiration.
   - Logging out clears the stored token from `localStorage` and resets client state.

### 2. Password Hashing Explained
Plaintext passwords should **never** be saved in databases.
- **Salt Generation**: A cryptographically random salt (16 bytes) is generated and concatenated with the password before hashing. This ensures two users with identical passwords will produce completely different hashes.
- **Work Factor (Cost = 10)**: `bcrypt` uses the Eksblowfish key schedule algorithm. A cost factor of 10 means $2^{10} = 1024$ computational rounds, intentionally slowing down brute-force and dictionary attacks on leaked databases while remaining imperceptible to legitimate users (~60ms).

---

## 6. Installation & Execution Steps

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Optional: Local MongoDB or MongoDB Atlas URI (if not running, the application runs automatically in zero-setup in-memory mode).

### Step 1: Clone or Navigate to Project
```bash
cd "c:/Cybersecurity/authentication toolkit"
```

### Step 2: Install Dependencies
Run the unified installer in the root folder:
```bash
npm run install:all
```
*(Alternatively: `npm install` in root, `cd server && npm install`, and `cd ../client && npm install`)*.

### Step 3: (Optional) Configure Environment Variables
Create a `.env` file in the `server/` directory if connecting to a custom MongoDB database:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cybersec_auth
JWT_SECRET=cybersecurity_super_secret_assignment_key_2026
```
*(If omitted, defaults are automatically used)*.

### Step 4: Run the Application
Launch both the Express backend and React frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend**: Accessible at [http://localhost:3000](http://localhost:3000)
- **Backend API**: Accessible at [http://localhost:5000](http://localhost:5000)

---

## 7. 5-Minute Demonstration Walkthrough

Follow these steps for a quick in-person or recorded demonstration:

1. **Test Password Validation & Strength Checker**:
   - Navigate to **Register**.
   - Type a weak password like `pass` $\rightarrow$ Notice the real-time strength bar turns red and items are unchecked.
   - Click the **Demo Autofill** button $\rightarrow$ Fills a strong password (`CyberSec@2026!`). Notice all criteria turn green and the meter displays **Strong (Cyber-Compliant)**.
   - Click **Create Secure Account** $\rightarrow$ Successfully registered with salted bcrypt hash.

2. **Test Authentication & JWT Issuance**:
   - On the **Login** page, click **Autofill** (or enter the registered credentials) and click **Authenticate & Sign In**.
   - Observe immediate redirection to the **Dashboard**.

3. **Inspect Session Management & JWT**:
   - In the Dashboard, inspect the **Active JWT Session Token** card.
   - Click **Verify Token** $\rightarrow$ The client transmits the bearer token to `/api/profile` and receives server-side confirmation.
   - Click **Terminate Session (Logout)** $\rightarrow$ The token is cleared and session terminated.

4. **Demonstrate Rate Limiting (Brute-Force Defense)**:
   - On the Login page, enter incorrect credentials 5 times rapidly.
   - On the 6th attempt, observe the **Security Control Alert**: `HTTP 429 - Too many login attempts from this IP. Please try again after 15 minutes (Brute Force Protection active).`

---

## 8. Security Considerations

1. **Bcrypt vs Fast Hashes (MD5/SHA-256)**:
   - MD5 and SHA-256 are designed for data integrity and are too fast (billions of computations per second on GPUs), making them vulnerable to offline dictionary attacks.
   - `bcrypt` includes adaptive computational cost and salting to defeat GPU cracking and precomputed rainbow tables.
2. **Stateless JWT Trade-offs**:
   - JWTs eliminate server-side session memory overhead, but cannot be invalidated server-side before expiration unless a token blacklist/revocation store is maintained.
   - Short token lifetimes (e.g., 1 hour) are enforced to reduce the vulnerability window.
3. **Transport Layer Security**:
   - In a production environment, all authentication endpoints must be served strictly over HTTPS to prevent packet sniffing and token interception.

---

## 9. Future Improvements

- **Multi-Factor Authentication (MFA/2FA)**: Integration with TOTP algorithms (Google Authenticator) for two-step verification.
- **Refresh Token Rotation**: Issuing short-lived access tokens (15 minutes) paired with rotating refresh tokens stored in secure, `HttpOnly`, `SameSite` cookies.
- **Account Lockout Escalation**: Exponential backoff cool-down periods and email-based password reset tokens.
- **CAPTCHA Verification**: Adding Cloudflare Turnstile or reCAPTCHA v3 after 3 consecutive failed login attempts.

---

## 10. Screenshots Section

### 1. User Registration & Real-Time Password Strength Meter
```
+------------------------------------------------------------------------------+
| [O] CYBERSECURITY AUTH TOOLKIT                         [API: ONLINE]  Login  |
|                                                                              |
|                    USER REGISTRATION                                         |
|    Username: [ student_demo                  ]                               |
|    Email:    [ student@university.edu        ]                               |
|    Password: [ CyberSec@2026!                ]                               |
|                                                                              |
|    [Password Strength: Strong (Cyber-Compliant)]                             |
|    [========================================] (100% Green Meter)             |
|    [x] At least 8 characters        [x] Uppercase letter (A-Z)               |
|    [x] Lowercase letter (a-z)       [x] Number (0-9)                         |
|    [x] Special symbol (!@#$...)                                              |
|                                                                              |
|    [  CREATE SECURE ACCOUNT (SALTED BCRYPT HASH)  ]                          |
+------------------------------------------------------------------------------+
```
*(Screenshot placeholder: `screenshots/01_registration_password_strength.png`)*

### 2. User Login & Rate Limiting Defense
```
+------------------------------------------------------------------------------+
| [O] CYBERSECURITY AUTH TOOLKIT                         [API: ONLINE] Register|
|                                                                              |
|                    USER LOGIN                                                |
|    Username / Email: [ student_demo          ]                               |
|    Password:         [ ******************    ]                               |
|                                                                              |
|    [!] Security Control: Too many failed login attempts from this IP.        |
|        Brute-force protection active (HTTP 429).                             |
|                                                                              |
|    [  AUTHENTICATE & SIGN IN  ]                                              |
+------------------------------------------------------------------------------+
```
*(Screenshot placeholder: `screenshots/02_login_ratelimit.png`)*

### 3. Authenticated Dashboard & JWT Session Inspector
```
+------------------------------------------------------------------------------+
| [O] CYBERSECURITY AUTH TOOLKIT            [API: ONLINE]  [TERMINATE SESSION] |
|                                                                              |
|  Welcome, student_demo! (Authenticated Session Active)                       |
|                                                                              |
|  +--------------------------------+  +------------------------------------+  |
|  |         USER PROFILE           |  |         SESSION MANAGEMENT         |  |
|  | Username: student_demo         |  | JWT: eyJhbGciOiJIUzI1NiIsInR5c...  |  |
|  | Email:    student@univ.edu     |  | Expiration: 1 Hour                 |  |
|  | Status:   AUTHENTICATED (200)  |  | [ Verify Session Token ]           |  |
|  +--------------------------------+  +------------------------------------+  |
|                                                                              |
|  [ Implemented Security Controls: Password Policy | Salted Bcrypt | Rate Limit]|
+------------------------------------------------------------------------------+
```
*(Screenshot placeholder: `screenshots/03_dashboard_session.png`)*
#   a u t h e n t i c a t i o n - t o o l k i t  
 