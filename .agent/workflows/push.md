---
description: Safe git push workflow — verifies identity, builds, runs tests, and pushes without disturbing running dev servers
---

# /push — Safe Git Push

This workflow safely stages, tests, builds, and pushes changes to `origin main` using the Fills AI git profile. It never kills running dev servers.

// turbo-all

## Steps

### 1. Verify Git Identity (Fills AI profile, NOT global)

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && echo "Local:" && git config user.name && git config user.email && echo "---" && echo "Expected: fillsai / ceo@fills.ai"
```

If the local config is wrong, fix it:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git config user.name "fillsai" && git config user.email "ceo@fills.ai" && echo "Fixed git identity ✅"
```

### 2. Check What Changed

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git status --short
```

If nothing changed, stop here — nothing to push.

### 3. Generate Diff Summary (for test case generation)

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git diff --cached --stat 2>/dev/null || git diff --stat
```

Get the actual code diff for test generation:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git diff --cached -- '*.ts' '*.tsx' 2>/dev/null | head -200 || git diff -- '*.ts' '*.tsx' | head -200
```

### 4. Write Tests Based on Diff

For each changed module, create or update test files in the appropriate `__tests__/` directory.
Use `vitest` as the test runner. Tests should cover:
- Changed function behavior
- Edge cases introduced by the diff
- API endpoints if routes changed
- Auth flows if auth code changed

### 5. Run Tests

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && bun run test 2>&1
```

If tests fail, fix them before proceeding. Do NOT push with failing tests.

### 6. Typecheck (without building — won't disturb dev servers)

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && bun run typecheck 2>&1
```

If typecheck fails, fix the errors before proceeding.

### 7. Build Verification (in a separate process — does NOT kill dev servers)

Build the web app to ensure no compile errors:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix/apps/web && npx next build 2>&1 | tail -20
```

If build fails, fix errors before proceeding. Do NOT push broken code.

### 8. Verify Dev Servers Still Running

Confirm that running dev servers were not disturbed:

```bash
lsof -i :3000 2>/dev/null | grep -q LISTEN && echo "WEB: ✅ still running" || echo "WEB: ❌ down"; lsof -i :8081 2>/dev/null | grep -q LISTEN && echo "EXPO: ✅ still running" || echo "EXPO: ❌ down"
```

### 9. Stage All Changes

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git add -A && git status --short
```

### 10. Commit with Conventional Commit Message

Generate a commit message following the project's conventional commit format:
```
<type>(<scope>): <description>

Types:    feat | fix | refactor | docs | chore | test | ci
Scopes:   db | auth | web | mobile | ui | utils | shared | infra
```

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git commit -m "<generated message>"
```

### 11. Push to Origin

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && git push origin main 2>&1
```

### 12. Final Status Report

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && echo "════════════════════════════════════════" && echo "  CLARIX — PUSH COMPLETE" && echo "════════════════════════════════════════" && echo "" && echo "  👤 Author:  $(git config user.name) <$(git config user.email)>" && echo "  📝 Commit:  $(git log -1 --oneline)" && echo "  🏷️  Branch:  $(git branch --show-current)" && echo "  📊 Remote:  $(git remote get-url origin)" && echo "" && (lsof -i :3000 2>/dev/null | grep -q LISTEN && echo "  🖥️  Web:     ✅ still running" || echo "  🖥️  Web:     ❌ down") && (lsof -i :8081 2>/dev/null | grep -q LISTEN && echo "  📱 Expo:    ✅ still running" || echo "  📱 Expo:    ❌ down") && echo "" && echo "════════════════════════════════════════"
```
