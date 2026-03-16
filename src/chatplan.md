
### 1. High-level concept

- **Goal**: Ek real-time chatroom jaha website par online users apni feelings share kar sakein.
- **Free entry**: Chatroom landing page par koi bhi user aa sakta hai, basic details de sakta hai.
- **Paid connection**: Sirf paid users (₹25 / day) hi dusre users ko 1:1 chat request bhej sakte hain. Request accept karne ke liye dusre user ko pay karna zaroori nahi.
- **Validity**: Payment ke baad user ko current din ki raat 12:00 AM (midnight) tak request bhejne ka access hoga.

### 2. User flows (Hindi + short English)

#### 2.1 New user entry flow (free)

1. User website par `Chatroom` page open karega.
2. System check karega:
   - Agar logged-in user system already hai to basic details pre-fill.
   - Agar nahi hai, to basic details form dikhayenge:
     - **Name** (ya display name / nickname)
     - **Age range** (18–24, 25–34, 35–44, etc.)
     - **Gender (optional)**
     - **City / State (optional)**
     - **Mood / feeling (short text)**
     - **Consent**: Terms & conditions + privacy confirmation (checkbox).
3. Submit ke baad user ka profile lightweight record DB me banega (guest ya registered, aapki choice).
4. User ko public chat lobby / available users list dikhayi jayegi (basic info + online status).

#### 2.2 Payment & subscription (₹25 per day)

1. Lobby me ek CTA button: **“Pay ₹25 to send chat requests today”**.
2. User button click karega:
   - Agar user logged-in nahi hai: pehle quick registration/login (email/phone OTP) ka flow.
   - Phir payment gateway page pe redirect.
3. Payment gateway:
   - Recommended: **Razorpay / Stripe / PayU / Paytm** (India focus ho to Razorpay/Paytm).
   - Amount: ₹25
   - Order ID + user ID + date store karna hoga.
4. Payment success ke baad:
   - Backend me **access record** create hoga:
     - `user_id`
     - `valid_from` = abhi ka time
     - `valid_till` = today midnight (server timezone consistent rakhenge, e.g. Asia/Kolkata)
     - `status` = active
   - Frontend ko success message: **“Aaj raat 12 baje tak aap kisi bhi online user ko chat request bhej sakte hain.”**
5. Har request bhejte time backend validate karega:
   - Kya aaj ke liye active payment access hai?
   - Agar nahi: 403 + message **“Request bhejne ke liye aaj ka access khatam ho gaya hai. Dubara pay karein.”**

#### 2.3 Chat request flow

1. Paid user lobby me kisi user card par **“Send chat request”** button dekhega.
2. Click par:
   - Backend check:
     - Sender ka `paid_access` active?
     - Kya target user self nahi hai?
     - Kya already active chat session in dono ke beech me nahi hai?
3. Agar sab OK:
   - `chat_request` record create hoga.
   - Real-time notification target user ko jayega (websocket / pusher / supabase realtime).
4. Target user ke UI me modal / side panel:
   - “`<SenderName>` wants to chat with you. Accept / Reject”
5. User actions:
   - **Accept**:
     - `chat_session` create, `status = active`
     - Dono users ko same 1:1 chat room me navigate.
   - **Reject**:
     - Request `status = rejected`
     - Sender ko notification “Your request was rejected.” (optionally reason).

#### 2.4 1:1 chat flow

1. Chat technology:
   - Real-time using **WebSockets**.
   - Options:
     - Next.js app router + a backend websocket server (Node.js / NestJS / Express + ws/socket.io).
     - Third-party service (Pusher / Ably / Supabase Realtime).
2. Chat features (initial phase):
   - Text messages only (no images/file for v1).
   - Typing indicator (optional later).
   - Online/offline indicator.
   - Message timestamps.
   - Auto-scroll to latest message.
3. Session ending:
   - Users manually end chat.
   - Or session auto ends after inactivity (e.g., 30 mins no message) – optional.
   - User ka **send-request access** tab tak rahega jab tak date change nahi ho jati (midnight).

### 3. Roles & permissions

- **Guest / Anonymous**:
  - Chatroom page dekh sakta hai.
  - Basic detail form fill kar sakta hai.
  - Dusro ki basic profile/availability dekh sakta hai.
  - **Chat request send nahi kar sakta**.
- **Registered Free User**:
  - Login hai, profile saved hai.
  - Requests **receive + accept/reject** kar sakta hai.
  - Khud request send nahi kar sakta agar paid access nahi hai.
- **Paid User (today)**:
  - Above sab ke saath:
  - **Request send karne ka right**.
  - Validity same day midnight tak.
- **Admin**:
  - User list, sessions, payments, reports dekh sakta hai.
  - Users ko block / mute kar sakta hai.

### 4. Data model (draft schema)

#### 4.1 Users

- `users` table (agar already hai to extend karenge):
  - `id` (PK)
  - `name`
  - `email` / `phone` (auth ke liye)
  - `display_name` (nickname, optional)
  - `age_range`
  - `gender` (optional)
  - `city`
  - `created_at`
  - `updated_at`

#### 4.2 Daily access / payments

- `chat_access_passes` table:
  - `id`
  - `user_id` (FK -> users)
  - `date` (YYYY-MM-DD, user timezone)
  - `valid_from` (timestamp)
  - `valid_till` (timestamp)
  - `payment_gateway` (e.g. `razorpay`)
  - `payment_order_id`
  - `payment_status` (`created | paid | failed | refunded`)
  - `amount` (₹25)
  - `created_at`

#### 4.3 Chat requests

- `chat_requests` table:
  - `id`
  - `from_user_id`
  - `to_user_id`
  - `status` (`pending | accepted | rejected | cancelled | expired`)
  - `created_at`
  - `responded_at` (null until accept/reject)

#### 4.4 Chat sessions

- `chat_sessions` table:
  - `id`
  - `request_id` (FK -> chat_requests)
  - `user1_id`
  - `user2_id`
  - `status` (`active | ended | banned`)
  - `started_at`
  - `ended_at`

#### 4.5 Messages

- `chat_messages` table:
  - `id`
  - `session_id` (FK -> chat_sessions)
  - `sender_id`
  - `content` (text)
  - `created_at`
  - `is_read` (boolean, optional)

### 5. Tech stack decisions (aligned with current project)

- **Frontend framework**: Next.js (already used in project `src/app`).
- **UI**:
  - New route: `app/chat/page.tsx` – lobby + entry form.
  - New dynamic route: `app/chat/[sessionId]/page.tsx` – 1:1 chat room.
  - Reuse existing design system (`components/ui`, `layout`, etc.).
- **Backend**:

  - Use Next.js **Route Handlers** for REST APIs:
    - `POST /api/chat/access/create-order` – payment order create.
    - `POST /api/chat/access/verify` – payment success webhook / callback.
    - `GET  /api/chat/access/status` – current user ka aaj ka access check.
    - `POST /api/chat/request` – send chat request.
    - `POST /api/chat/request/respond` – accept/reject.
    - `GET  /api/chat/sessions` – active session list for user.
  - Real-time:
    - Option A (recommended): Third-party like **Pusher** (simple integration, scalable).
    - Option B: Own WebSocket server (custom Node server) – zyada control but config heavy.

- **Database**:

  - Use existing DB layer (`lib/db`) pattern follow karenge.
  - Naye tables add karenge: `chat_access_passes`, `chat_requests`, `chat_sessions`, `chat_messages`.

- **Payment gateway**:
  - For India: **Razorpay** suggested.
  - Flow:
    1. Frontend calls `create-order` API.
    2. Backend uses Razorpay SDK to create order and returns order_id.
    3. Frontend opens Razorpay checkout.
    4. On success, Razorpay callback + frontend verification API ko hit karega.
    5. Backend verifies signature, then `chat_access_passes` record create/update.

### 6. Business rules (exact conditions)

- **Free entry**:
  - Koi bhi user chatroom lobby open kar sakta hai.
  - Basic details form mandatory if first time.
- **Paid request sending**:
  - Sirf wo user jiske paas **aaj ke liye active `chat_access_pass`** ho.
  - `valid_till` = same calendar day ke 23:59:59 server time (India timezone align).
- **Request receiving / accepting**:
  - Koi bhi registered user request receive & accept kar sakta hai.
  - Accept karne ke liye payment zaruri nahi.
- **Multiple requests**:
  - Same 2 users ke beech ek time pe sirf 1 active/pending request allowed.
  - Per day multiple sessions allowed, jab tak `valid_till` expired nahi hota.
- **Abuse control (basic)**:
  - Per paid user per day max request limit (e.g. 30) – optional but recommended.
  - Blocked users ko request nahi bhej sakte / receive nahi kar sakte.

### 7. Privacy & safety considerations

- **Anonymity options**:
  - Real name optional; nickname allowed.
  - Profile picture optional (v2).
- **Moderation**:
  - Admin panel se chat sessions/messages read-only view for abuse cases (need policy).
  - Report user feature (v2).
- **Data retention**:
  - Messages retention period (e.g. 90 days) decide karna.
  - Delete request from user par data anonymize/soft-delete.

### 8. Implementation phases

- **Phase 1 – Base setup**

  - New DB tables for access, requests, sessions, messages.
  - Basic `Chatroom` lobby page (no real-time yet, just list of users).
  - Payment gateway integration + daily access logic.

- **Phase 2 – Request system**

  - API endpoints for send/accept/reject request.
  - UI for incoming request modal.
  - Lock request sending behind active access check.

- **Phase 3 – Real-time chat**

  - Integrate WebSockets / Pusher.
  - 1:1 chat UI + messages store.
  - Online status, simple typing indicator (optional).

- **Phase 4 – Polishing & safety**
  - Rate limiting, maximum requests/day, block/report options.
  - Better UI/UX, mobile friendly, error states.

### 9. Open questions (to decide later)

- Kya chat anonymous hoga ya real identity dikhani hai?
- Kya ek paid access me only 1 chat session allow ya multiple? (Plan currently: **multiple**).
- Kya female users ke liye alag rules/rates honge? (business decision).
- Kya future me voice/video add karna hai? (architecture me dhyaan rakhenge).
