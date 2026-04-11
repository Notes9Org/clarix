---
id: SCR-001
title: Authentication Screens
version: "1.1"
status: approved
priority: P0
author: fillsai
created: 2026-04-05
last_reviewed: 2026-04-07
change_control: CC-2026-002
cfr_references: [Part 11.10, Part 11.50, Part 11.70, Part 11.300]
urs_refs: [URS-001, URS-002]
frs_refs: [FRS-001, FRS-002, FRS-003]
---

# 01 — Authentication Screens

> **Users:** All roles  
> **Routes:** `/login`, `/signup`  
> **Priority:** P0 — Must build first  
> **21 CFR Part 11 Scope:** Electronic signatures, unique user identification, session management

## Revision History

| Version | Date       | Author   | Change Description                              | Approved By |
|---------|------------|----------|-------------------------------------------------|-------------|
| 1.0     | 2026-04-05 | fillsai  | Initial screen specification                    | fillsai     |
| 1.1     | 2026-04-07 | fillsai  | Added acceptance criteria, error/edge cases,    | fillsai     |
|         |            |          | data requirements, loading/empty states, CFR refs|            |

---

## Screen A1: Login Page (`/login`)

**Scenario:** Any user opens the app for the first time or after session expiry.

```
+──────────────────────────────────────────────────+
│                                                   │
│               ┌──────┐                            │
│               │  C   │  ← Logo (28×28, rounded)   │
│               └──────┘                            │
│                                                   │
│              Sign In                              │
│     Enter your credentials to continue            │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Email                                  │     │
│   │  [admin@clarix.io________________]      │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Password                               │     │
│   │  [••••••••________________________]     │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │           [ Sign In ]                   │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│        No account? Create one                     │
│                                                   │
│   ─────────────────────────────────────────────   │
│    cGMP Compliant · 21 CFR Part 11 · SOC 2 Ready │
│                                                   │
+──────────────────────────────────────────────────+
```

### States

```
STATE: Default
├── Email input: empty, placeholder "admin@clarix.io"
├── Password input: empty, placeholder "••••••••"
└── Button: white bg, "Sign In"

STATE: Loading
├── Button: gray bg, disabled, "Signing in..."
└── Inputs: disabled

STATE: Error
├── Red text below password: "Invalid credentials"
│   OR "Something went wrong. Please try again."
└── Inputs: retain values

STATE: Locked (R10: 5 failed attempts)
├── All inputs disabled
├── Red banner: "Account locked. Try again in 30 minutes."
└── Button disabled
```

### Interaction Flow

```
User lands on /login
    │
    ├─→ Enters email + password
    │       │
    │       ├─ Valid → Redirect to /dashboard
    │       │           └─ Audit: LOGIN event logged
    │       │
    │       ├─ Invalid → Show error, increment failed_login_count
    │       │
    │       └─ 5th failure → Lock account 30min (R10)
    │
    └─→ Clicks "Create one" → Navigate to /signup
```

---

## Screen A2: Signup Page (`/signup`)

**Scenario:** Admin creates first account during facility onboarding.

```
+──────────────────────────────────────────────────+
│                                                   │
│               ┌──────┐                            │
│               │  C   │                            │
│               └──────┘                            │
│                                                   │
│            Create Account                         │
│      Set up your Clarix account                   │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Full Name                              │     │
│   │  [________________________________]     │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Email                                  │     │
│   │  [________________________________]     │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Password                               │     │
│   │  [________________________________]     │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Organization Name                      │     │
│   │  [________________________________]     │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │        [ Create Account ]               │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│      Already have an account? Sign in             │
│                                                   │
+──────────────────────────────────────────────────+
```

### Validation Rules

```
Full Name:    required, min 2 chars
Email:        required, valid email format
Password:     required, min 8 chars
              (future: complexity rules)
Organization: required, min 2 chars
```

---

## Screen A3: Session Timeout Lock

**Scenario:** User idle for 30min (web) or 5min (iPad). Overlay appears.

```
+──────────────────────────────────────────────────+
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓  ┌──────────────────────────────────┐  ▓▓▓▓▓▓│
│▓▓▓  │                                  │  ▓▓▓▓▓▓│
│▓▓▓  │    <Lock />  Session Expired     │  ▓▓▓▓▓▓│
│▓▓▓  │                                  │  ▓▓▓▓▓▓│
│▓▓▓  │    Signed in as: Carlos T.       │  ▓▓▓▓▓▓│
│▓▓▓  │    Role: Technician              │  ▓▓▓▓▓▓│
│▓▓▓  │                                  │  ▓▓▓▓▓▓│
│▓▓▓  │    Password                      │  ▓▓▓▓▓▓│
│▓▓▓  │    [________________________]    │  ▓▓▓▓▓▓│
│▓▓▓  │                                  │  ▓▓▓▓▓▓│
│▓▓▓  │    [ Unlock ]  [ Sign Out ]      │  ▓▓▓▓▓▓│
│▓▓▓  │                                  │  ▓▓▓▓▓▓│
│▓▓▓  └──────────────────────────────────┘  ▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
+──────────────────────────────────────────────────+
  ▓ = blurred background of current page (bg-black/60)
```

### Rules (R9)

```
Web timeout:  30 minutes inactivity
iPad timeout: 5 minutes inactivity
Action:       Overlay locks screen, preserves page state
Unlock:       Re-enter password → resume where left off
Sign Out:     Clears session → redirect to /login
```

---

## Auth Flow Diagram

```
                    ┌──────────┐
                    │  / root  │
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │                     │
        Has session?           No session
              │                     │
              ▼                     ▼
     ┌────────────────┐    ┌──────────────┐
     │   /dashboard   │    │   /login      │
     │   (app shell)  │    │              │
     └────────────────┘    └──────┬───────┘
              │                    │
              │              ┌─────┴──────┐
         Idle timeout?       │            │
              │           Success      Failure
              ▼              │            │
     ┌────────────────┐      ▼            ▼
     │  Session Lock  │  /dashboard   Error msg
     │  (overlay)     │               (5th → R10)
     └────────────────┘
```

---

*Next: [02-app-shell.md](./02-app-shell.md) — Sidebar & navigation layout*

---

## Acceptance Criteria (for IQ/OQ/PQ Validation)

### Screen A1: Login
- [ ] AC-A1-01: Login form renders with email and password fields
- [ ] AC-A1-02: Invalid credentials display inline error within 2 seconds
- [ ] AC-A1-03: 5th consecutive failed attempt triggers 30-minute lockout (Rule R10)
- [ ] AC-A1-04: Successful login redirects to `/dashboard`
- [ ] AC-A1-05: Audit trail records `LOGIN_SUCCESS` with IP, device, user agent, timestamp
- [ ] AC-A1-06: Audit trail records `LOGIN_FAIL` with failed attempt count
- [ ] AC-A1-07: "Create one" link navigates to `/signup`
- [ ] AC-A1-08: Password field obscures input with `•` characters
- [ ] AC-A1-09: Form is keyboard-accessible (Tab order: email → password → button)
- [ ] AC-A1-10: Compliance footer displays "cGMP Compliant · 21 CFR Part 11 · SOC 2 Ready"

### Screen A2: Signup
- [ ] AC-A2-01: All 4 fields are required; form does not submit with empty fields
- [ ] AC-A2-02: Email validation rejects malformed addresses inline
- [ ] AC-A2-03: Password minimum 8 characters enforced client-side
- [ ] AC-A2-04: Successful signup creates user with `status: active` and default role
- [ ] AC-A2-05: Duplicate email shows error: "An account with this email already exists"

### Screen A3: Session Lock
- [ ] AC-A3-01: Overlay appears after 30min web / 5min iPad inactivity (Rule R9)
- [ ] AC-A3-02: Shows current user name and role
- [ ] AC-A3-03: Correct password unlocks and returns to previous page state
- [ ] AC-A3-04: "Sign Out" clears session and redirects to `/login`
- [ ] AC-A3-05: Background content is blurred (bg-black/60) and non-interactive

---

## Error & Edge Cases

```
EDGE CASE: Concurrent sessions
├── Same user on web + iPad simultaneously → both sessions valid
├── Session lock on one device does NOT affect the other
└── Audit trail records separate session IDs

EDGE CASE: Network failure during login
├── Timeout after 10 seconds → "Connection error. Please try again."
├── No retry counter increment for network failures
└── Retry button appears after error

EDGE CASE: Clock skew
├── Server-side timestamp used for all audit entries (NTP-synced)
├── Client clock mismatch logged but does not block login
└── Session expiry calculated server-side, not client-side

EDGE CASE: Account locked while session active
├── Active sessions remain valid until next auth check
├── New login attempts blocked during lockout period
└── Admin can manually unlock via /admin/users

ERROR: Password contains only whitespace
├── Client-side: trim + validate → "Password is required"
└── Server-side: same validation as defense-in-depth

ERROR: Account deactivated/suspended
├── Login attempt returns: "Account suspended. Contact your administrator."
├── Does NOT reveal account existence to prevent enumeration
└── Audit trail records LOGIN_BLOCKED event
```

---

## Data Requirements

```
Server Actions / API Endpoints needed:
├── POST /api/auth/sign-in  → Better-Auth credential flow
│   Request:  { email: string, password: string }
│   Response: { session: Session, user: User } | { error: string }
│
├── POST /api/auth/sign-up  → Better-Auth registration
│   Request:  { name: string, email: string, password: string, orgName: string }
│   Response: { session: Session, user: User } | { error: string }
│
├── POST /api/auth/sign-out → Better-Auth session destroy
│   Response: { success: boolean }
│
├── POST /api/auth/unlock   → Session lock re-authentication
│   Request:  { password: string }
│   Response: { session: Session } | { error: string }
│
└── GET /api/auth/session    → Check current session status
    Response: { session: Session | null }

Database tables accessed:
├── users (read: email lookup, write: failed_login_count)
├── session (read/write: session CRUD)
├── account (read: credential verification)
├── audit_trail (write: LOGIN events)
└── organizations (read: org name for signup)
```

---

