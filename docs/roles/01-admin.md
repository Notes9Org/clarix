# Role: System Administrator (`admin`)

> **Tier:** 5 — System  
> **RBAC Token:** `admin`  
> **Access Level:** Full platform control — all modules  
> **Session Timeout:** Web: 30 minutes · iPad: N/A (admin is web-only)

---

## 1. Role Summary

The **System Administrator** is a non-clinical, platform-governance role. The admin does **not** participate in pharmaceutical operations (no batch execution, no batch release, no QA decisions). Instead, the admin holds absolute authority over the Clarix platform itself: user lifecycle, organizational configuration, system health, audit trail access, and integration management.

In regulated environments (21 CFR Part 11, cGMP), the admin role is treated as a **privileged system account** — all admin actions are double-logged (system log + application audit trail) and reviewed periodically by the QA Manager.

> **Key distinction:** The admin can *see* everything but cannot *do* clinical actions. The admin cannot sign batch records, release inventory, or approve deviations.

---

## 2. Primary Responsibilities

### 2.1 User Lifecycle Management
- Create, update, deactivate, and soft-delete user accounts
- Assign and modify role assignments (single role per user in Clarix)
- Unlock accounts after failed-login lockout (triggered after 5 consecutive failures)
- Reset credentials and force password changes
- Manage 2FA/biometric enrollment status
- Review and audit user access quarterly (access review log)

### 2.2 Organizational Configuration
- Configure organization-level settings: name, timezone, regulatory region
- Set global session timeout values (web / iPad independently)
- Configure notification delivery rules (email, push, in-app)
- Manage integration credentials: LIMS, ERP, label printing systems
- Toggle feature flags and beta modules per organization

### 2.3 Audit Trail & Compliance
- Access the full, unfiltered audit trail (`audit_trail` table — read-only)
- Search and export audit logs by: user, role, table, action, date range
- Generate compliance reports for FDA inspection readiness
- Respond to audit queries: "who changed this record and when?"
- Cannot modify, delete, or redact any audit trail entry (enforced at DB level)

### 2.4 Soft Delete Authority
- Only the admin can soft-delete records (sets `deleted_at` timestamp)
- Soft-deleted records are hidden from all other roles but remain in the database
- Hard delete is prohibited across all roles — data retention is permanent

### 2.5 System Health & Monitoring
- Monitor API health, background job status, and sync queue depth
- Review system alerts: failed sync, offline iPad reconnect conflicts, cron failures
- Manage scheduled jobs: expired lot cron, training expiry cron, calibration due cron

---

## 3. Daily Workflow in Clarix

### Morning Checklist
1. Review any new account creation requests from department managers
2. Check system health dashboard — failed jobs, offline devices, sync errors
3. Respond to any locked account notifications (failed login lockouts)

### Ongoing Tasks
- Process onboarding: new employees → create account → assign role → confirm qualification flags
- Process offboarding: deactivate account → assign out-of-date e-signature audit
- Respond to access change requests from QA Manager or VP

### Periodic
- **Weekly:** Review audit trail summary — flag anomalous actions for QA
- **Monthly:** Run user access review report — confirm all active users still warrant their roles
- **Quarterly:** Review integration credentials, rotate API keys, validate backup integrity

---

## 4. Clarix Screen Access

| Screen | URL | Access Level |
|--------|-----|-------------|
| Executive Dashboard | `/dashboard` | Read |
| User Management | `/admin/users` | Full CRUD |
| Audit Trail | `/admin/audit-trail` | Read |
| System Settings | `/admin/settings` | Full CRUD |
| Notifications Center | `/notifications` | Own records |
| All other screens | — | Read-only (no action) |

---

## 5. RBAC Permission Summary

| Resource | Permission | Notes |
|----------|-----------|-------|
| `organizations` | CRUD | Full control |
| `users` | CRUD | Including role assignment & deactivation |
| `audit_trail` | R | Read-only, no modification ever |
| `notifications` | CRUD | System-wide notification config |
| `master_formulas` | CRUD | Edit only — no clinical approval |
| `batches` | CRUD | Edit metadata — cannot sign or release |
| `inventory_items` | CRUD | Catalog management |
| `inventory_lots` | CRUD | Lot management — cannot QC-release |
| `documents` | CRUD | Document catalog management |
| `deviations` | CRUD | Administrative — no investigation authority |
| `equipment` | CRUD | Registry management |
| `training_records` | CRUD | Record management |
| `e_signatures` | R | Read-only, cannot create or forge |

---

## 6. Restrictions & Guardrails

| What | Why |
|------|-----|
| Cannot execute batch steps | Not a compounding role — prevents clinical authority |
| Cannot e-sign batch records or release inventory | Separation of duties — prevents admin from self-authorizing |
| Cannot close deviations | QA authority only |
| Cannot hard-delete any record | 21 CFR Part 11 data integrity requirement |
| Cannot read PHI if applicable | Data minimization principle |

---

## 7. Key Events & Triggers

| Event | Admin Action |
|-------|-------------|
| New employee hired | Create account, assign role, set qualification flags |
| Employee terminated | Deactivate account within same business day (SOX/cGMP requirement) |
| 5 failed login attempts | Account auto-locked → admin unlocks after identity verification |
| FDA inspection scheduled | Export audit trail, run user access review |
| Integration credential expiry | Rotate API keys, test integrations, confirm sync health |
| Orphaned record found | Investigate via audit trail, escalate to QA if data integrity issue found |

---

## 8. Regulatory Context

The admin role exists at the intersection of **21 CFR Part 11** (electronic records/signatures) and **21 CFR Part 211** (current GMP). Key compliance points:

- **§11.10(d):** System access must be limited to authorized individuals — admin enforces this
- **§11.10(e):** Secure, computer-generated audit trails — admin reviews but cannot alter
- **§11.300:** Controls for identification codes/passwords — admin manages credential lifecycle
- **§211.68:** Backup and security of computerized systems — admin owns this
- **§211.180:** General requirements for records — admin ensures all records are retained per policy

---

*Role: `admin` · Clarix 503B Platform · March 2026*
