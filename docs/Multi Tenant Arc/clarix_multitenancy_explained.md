# Clarix Multi-Tenancy — Explained Simply 🧪

---

## 🧠 The Core Idea in One Sentence

> **One Clarix deployment → many pharmacies → many staff per pharmacy → each staff has a specific role in THAT pharmacy.**

Think of Clarix like Gmail:
- 🏢 **Organization** = A company (Google, Apple)
- 👤 **User** = A person with an email (you)
- 🪪 **Membership** = Your job at that company (you're a "Developer" at Google)
- You can work at **multiple companies** with **different job titles**

---

## 📦 The 4 Key Entities — With Real Clarix Examples

### Entity 1: 👤 User (The Person)

A human being. Exists independently. Not tied to any pharmacy yet.

| id | name | email |
|----|------|-------|
| `u1` | Nithin | nithin@clarix.io |
| `u2` | Sarah | sarah@pharma.com |
| `u3` | James | james@lab.com |
| `u4` | Priya | priya@compounding.io |

> 💡 **Key insight:** Notice there's NO `organization_id` or `role` on the user. The user is just... a person.

---

### Entity 2: 🏢 Organization (The Pharmacy)

A 503B compounding pharmacy. Has its own license, DEA number, staff, batches, inventory — everything.

| id | name | slug | license_number | dea_number |
|----|------|------|---------------|------------|
| `org1` | PharmaCorp 503B | pharmacorp | PH-2026-001 | FA1234567 |
| `org2` | SteriMed Labs | sterimed | SM-2026-042 | FB9876543 |
| `org3` | ClearCompound | clearcompound | CC-2026-099 | FC5551234 |

> 💡 Each org is a **completely separate pharmacy** with its own batches, formulas, inventory, staff.

---

### Entity 3: 🪪 Membership (The Link — THIS IS THE MAGIC ✨)

This table answers: **"WHO works WHERE and as WHAT?"**

| id | user_id | organization_id | role | is_owner |
|----|---------|-----------------|------|----------|
| `m1` | 👤 Nithin (`u1`) | 🏢 PharmaCorp (`org1`) | `admin` | ✅ yes |
| `m2` | 👤 Nithin (`u1`) | 🏢 SteriMed (`org2`) | `qa_manager` | ❌ no |
| `m3` | 👤 Sarah (`u2`) | 🏢 PharmaCorp (`org1`) | `compounding_technician` | ❌ no |
| `m4` | 👤 Sarah (`u2`) | 🏢 SteriMed (`org2`) | `pharmacist_in_charge` | ✅ yes |
| `m5` | 👤 James (`u3`) | 🏢 PharmaCorp (`org1`) | `qa_specialist` | ❌ no |
| `m6` | 👤 Priya (`u4`) | 🏢 ClearCompound (`org3`) | `admin` | ✅ yes |
| `m7` | 👤 Priya (`u4`) | 🏢 PharmaCorp (`org1`) | `warehouse_clerk` | ❌ no |

#### 🔍 What this tells us:

| Person | PharmaCorp 🏢 | SteriMed 🏢 | ClearCompound 🏢 |
|--------|:------------:|:-----------:|:----------------:|
| 👤 Nithin | `admin` 👑 | `qa_manager` 🔬 | ❌ not a member |
| 👤 Sarah | `technician` 🧪 | `PIC` 👑 | ❌ not a member |
| 👤 James | `qa_specialist` 📋 | ❌ not a member | ❌ not a member |
| 👤 Priya | `warehouse_clerk` 📦 | ❌ not a member | `admin` 👑 |

> 🎯 **Same person, different role in different pharmacy.** Sarah is a technician at PharmaCorp but the Pharmacist-in-Charge at SteriMed!

---

### Entity 4: 🔐 Session (What's Active RIGHT NOW)

When a user logs in, their session tracks which org they're currently "inside":

| session_id | user_id | active_organization_id | current role (resolved) |
|-----------|---------|----------------------|------------------------|
| `s1` | 👤 Nithin | 🏢 PharmaCorp (`org1`) | `admin` 👑 |
| `s2` | 👤 Sarah | 🏢 SteriMed (`org2`) | `pharmacist_in_charge` 👑 |

> 💡 When Nithin switches from PharmaCorp → SteriMed, his role **automatically changes** from `admin` → `qa_manager`. The session updates, and all his API calls are now scoped to SteriMed data.

---

## 🎬 Scenario Walkthroughs

### Scenario 1: 🆕 Nithin Creates a New Pharmacy

```
Step 1: Nithin signs up
         → user table: { id: u1, name: "Nithin", email: "nithin@clarix.io" }
         → NO org yet. Just a person.

Step 2: Nithin clicks "Create Organization"
         → organization table: { id: org1, name: "PharmaCorp 503B", slug: "pharmacorp" }

Step 3: System auto-creates membership
         → organization_member: { user: u1, org: org1, role: "admin", is_owner: true }

Step 4: Session activates
         → session.active_organization_id = org1
```

**Result:**

| 👤 Nithin | 🏢 PharmaCorp |
|-----------|---------------|
| Role: `admin` 👑 | Owner: ✅ |

---

### Scenario 2: 📩 Nithin Invites Sarah as a Technician

```
Step 1: Nithin (admin at PharmaCorp) sends invite
         → invitation table: { org: org1, email: "sarah@pharma.com",
           role: "compounding_technician", status: "pending" }

Step 2: Sarah gets email → clicks link

Step 3a: Sarah already has a Clarix account?
          → Create membership: { user: u2, org: org1, role: "compounding_technician" }
          → invitation.status → "accepted"

Step 3b: Sarah is brand new?
          → Show sign-up form → create user → THEN create membership
          → invitation.status → "accepted"
```

**Result:**

| 👤 Sarah | Before | After |
|----------|--------|-------|
| 🏢 PharmaCorp | ❌ No access | ✅ `compounding_technician` 🧪 |

---

### Scenario 3: 🔄 Sarah Gets Hired by SteriMed Too

Sarah is already a technician at PharmaCorp. Now SteriMed wants her as their PIC.

```
Step 1: SteriMed admin invites sarah@pharma.com with role "pharmacist_in_charge"
         → invitation: { org: org2, email: "sarah@pharma.com",
           role: "pharmacist_in_charge" }

Step 2: Sarah accepts
         → NEW membership: { user: u2, org: org2,
           role: "pharmacist_in_charge", is_owner: true }
```

**Sarah now has 2 memberships:**

| Sarah's Orgs | Role | What She Can Do |
|-------------|------|-----------------|
| 🏢 PharmaCorp | `compounding_technician` 🧪 | Execute batch steps, scan barcodes |
| 🏢 SteriMed | `pharmacist_in_charge` 👑 | Approve formulas, release batches, sign-offs |

**Her org switcher dropdown looks like:**

```
┌──────────────────────────────┐
│  🏢 PharmaCorp 503B    ✓    │  ← currently active
│  🏢 SteriMed Labs           │
└──────────────────────────────┘
```

---

### Scenario 4: 🧪 Sarah Executes a Batch at PharmaCorp

Sarah is logged in, active org = PharmaCorp, role = `compounding_technician`.

```
Sarah opens "My Batches"
  → System checks: session.active_organization_id = org1
  → System checks: membership role = "compounding_technician"
  → Query: SELECT * FROM batch
           WHERE organization_id = 'org1'
             AND 'u2' = ANY(assigned_technicians)
  → Sarah sees ONLY PharmaCorp batches assigned to her
  → She CANNOT see SteriMed batches (even though she's PIC there)
```

| What Sarah Sees | PharmaCorp (active) | SteriMed (inactive) |
|----------------|:-------------------:|:-------------------:|
| Batches | ✅ Her assigned batches | 🚫 Hidden |
| Formulas | ✅ Read-only | 🚫 Hidden |
| Inventory | 🚫 No access (technician) | 🚫 Hidden |
| Release batches | 🚫 No (technician can't release) | 🚫 Hidden |

---

### Scenario 5: 🔀 Sarah Switches to SteriMed

Sarah clicks "SteriMed Labs" in the org switcher.

```
Step 1: API call → PATCH /session { active_organization_id: "org2" }

Step 2: Server checks → Does Sarah have membership in org2?
         → YES: { role: "pharmacist_in_charge" }

Step 3: Session updated → active org = org2, resolved role = PIC

Step 4: UI refreshes → completely different data, different permissions
```

**Now Sarah sees:**

| What Sarah Sees | PharmaCorp (inactive) | SteriMed (NOW active) |
|----------------|:---------------------:|:---------------------:|
| Batches | 🚫 Hidden | ✅ ALL batches (PIC sees everything) |
| Formulas | 🚫 Hidden | ✅ CRUD + Sign/Approve |
| Release batches | 🚫 Hidden | ✅ Can release ✍️ |
| Inventory | 🚫 Hidden | ✅ Read access |

> 🎯 **Same person. Same login. Completely different experience based on which org is active.**

---

### Scenario 6: 🚪 James Leaves PharmaCorp

James (`qa_specialist` at PharmaCorp) resigns.

```
Step 1: Admin deletes James's membership
         → DELETE FROM organization_member
           WHERE user_id = 'u3' AND organization_id = 'org1'

Step 2: James's USER account still exists!
         → He can still log into Clarix
         → He just has 0 orgs now
         → He sees: "You don't belong to any organization.
                     Create one or wait for an invite."

Step 3: If James joins another pharmacy later,
        he gets a fresh membership with a new role.
```

| | Before | After |
|--|--------|-------|
| James's access | 👤 → 🏢 PharmaCorp (`qa_specialist`) | 👤 → 🏢 (no orgs) |
| PharmaCorp data | ✅ Can access | 🚫 Can't access anything |
| User account | ✅ Exists | ✅ Still exists, just orphaned |

> 💡 **Unlike your current system where removing someone from an org = deleting the user entirely.**

---

### Scenario 7: 🔒 Data Isolation — What CANNOT Happen

| Attempted Action | Result | Why |
|-----------------|--------|-----|
| 👤 Nithin (PharmaCorp admin) tries to see SteriMed batches | 🚫 **Blocked** | His session's `active_org = org1`. Query scoped to `org1` only. |
| 👤 Sarah (SteriMed PIC) tries to release a PharmaCorp batch | 🚫 **Blocked** | Active org = `org2`, batch belongs to `org1`. WHERE clause filters it out. |
| 👤 Priya (ClearCompound admin) tries to view PharmaCorp audit trail | 🚫 **Blocked** | Even though Priya is `warehouse_clerk` at PharmaCorp, warehouse_clerk has no audit access per RBAC. |
| API call without `organization_id` | 🚫 **Blocked** | Middleware rejects any request where session has no active org. |
| Direct SQL query bypassing app | 🚫 **Blocked** (with RLS) | Postgres RLS policy: `WHERE org_id = current_setting('app.org_id')` |

---

## 🔴 Your Current System vs 🟢 Target System

### How It Looks Today

**🔴 Today (Clarix Current):**

```
user table:
┌──────┬─────────┬───────────────────┬─────────────────────┐
│  id  │  name   │  organization_id  │  role               │
├──────┼─────────┼───────────────────┼─────────────────────┤
│  u1  │ Nithin  │  org1             │  admin              │  ← stuck to org1 forever
│  u2  │ Sarah   │  org1             │  compounding_tech   │  ← can ONLY be in org1
│  u3  │ James   │  org1             │  qa_specialist      │  ← one role, period
└──────┴─────────┴───────────────────┴─────────────────────┘

❌ Sarah can't join SteriMed without creating a SECOND user account
❌ Sarah can't be a technician here AND a PIC there
❌ If org1 is deleted, Sarah's user is gone (cascade delete)
```

**🟢 After (Target):**

```
user table (CLEAN — no org, no role):
┌──────┬─────────┬────────────────────┐
│  id  │  name   │  email             │
├──────┼─────────┼────────────────────┤
│  u1  │ Nithin  │  nithin@clarix.io  │
│  u2  │ Sarah   │  sarah@pharma.com  │
│  u3  │ James   │  james@lab.com     │
└──────┴─────────┴────────────────────┘

organization_member table (THE GLUE):
┌──────┬─────────┬─────────┬──────────────────────┬──────────┐
│  id  │ user_id │ org_id  │  role                │ is_owner │
├──────┼─────────┼─────────┼──────────────────────┼──────────┤
│  m1  │  u1     │  org1   │  admin               │  ✅      │
│  m2  │  u1     │  org2   │  qa_manager          │  ❌      │
│  m3  │  u2     │  org1   │  compounding_tech    │  ❌      │
│  m4  │  u2     │  org2   │  pharmacist_in_charge│  ✅      │
│  m5  │  u3     │  org1   │  qa_specialist       │  ❌      │
└──────┴─────────┴─────────┴──────────────────────┴──────────┘

✅ Sarah is in 2 orgs with different roles
✅ Deleting membership ≠ deleting the user
✅ Each org manages its own staff independently
```

---

## 🧪 How Batch Execution Looks (End to End)

```
┌─────────────────────────────────────────────────────────────┐
│  🏢 PharmaCorp 503B — Active Org                            │
│                                                             │
│  📋 Batch #PH-2026-0847 — Famotidine 20mg/mL               │
│                                                             │
│  Step 1: Tech executes    → 👤 Sarah (technician) ✍️        │
│  Step 2: Tech weighs      → 👤 Sarah (technician) ✍️        │
│  Step 3: QA reviews       → 👤 James (qa_specialist) ✍️     │
│  Step 4: PIC releases     → ❌ NOT Sarah (she's tech here)  │
│                             → Need someone with PIC role     │
│                               at PharmaCorp                  │
│                                                             │
│  ⚖️ Separation of Duties:                                   │
│  Execute ≠ Review ≠ Release (must be different people)       │
│                                                             │
│  🔒 Org Isolation:                                           │
│  This batch is INVISIBLE to SteriMed and ClearCompound       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Permission Resolution Flow

When any API request comes in, here's what happens:

```
👤 Sarah clicks "View Batches"
        │
        ▼
┌─────────────────────────┐
│ 1️⃣  Read session token   │
│    → user_id = u2        │
│    → active_org = org1   │
└──────────┬──────────────┘
           │
           ▼
┌───────────────────────────────────────┐
│ 2️⃣  Lookup membership                 │
│    SELECT role FROM org_member        │
│    WHERE user_id = u2                 │
│      AND org_id = org1                │
│                                       │
│    → role = "compounding_technician"  │
└──────────┬────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────┐
│ 3️⃣  Check permission                  │
│    Can "compounding_technician"       │
│    access /batches?                   │
│                                       │
│    RBAC matrix says:                  │
│    technician → R (assigned only)     │
│                                       │
│    → ✅ ALLOWED (read, assigned)      │
└──────────┬────────────────────────────┘
           │
           ▼
┌───────────────────────────────────────┐
│ 4️⃣  Query with org scoping            │
│    SELECT * FROM batch                │
│    WHERE organization_id = 'org1'     │
│      AND 'u2' = ANY(assigned_techs)   │
│                                       │
│    → Returns 3 batches                │
└───────────────────────────────────────┘
```

---

## 🗝️ TL;DR — The 3 Rules

| Rule | Emoji | Explanation |
|------|:-----:|-------------|
| **Users are free agents** | 👤 ≠ 🏢 | A user is NOT owned by an org. They're a person who can join/leave orgs freely. |
| **Role lives on the membership** | 🪪 = 👤 + 🏢 + 🎭 | "Sarah is a technician at PharmaCorp" is ONE membership row. "Sarah is PIC at SteriMed" is ANOTHER row. |
| **Session picks the active org** | 🔐 → 🏢 | At any moment, the user is "inside" one org. Switching orgs = switching their entire permission set. |

---

*This is how Vercel, Clerk, WorkOS, and every serious multi-tenant app works. Clarix just needs the `organization_member` table to unlock all of this.* ✨
