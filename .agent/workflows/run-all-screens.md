---
description: Start all Clarix development screens — Supabase, Web, iOS (iPad), Android emulator. Checks what's already running and only starts what's missing.
---

# Run All Screens

This workflow brings up the full Clarix parallel development environment. It checks each service and only starts what's not already running.

// turbo-all

## Steps

### 1. Check Docker / OrbStack

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && docker info > /dev/null 2>&1 && echo "DOCKER: ✅ running" || echo "DOCKER: ❌ not running"
```

If Docker is not running, start it:

```bash
open -a OrbStack 2>/dev/null || open -a Docker 2>/dev/null; echo "Starting Docker... waiting 10s" && sleep 10
```

### 2. Check & Start Supabase (PostgreSQL)

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && supabase status 2>&1 | grep -q "API URL" && echo "SUPABASE: ✅ running" || echo "SUPABASE: ❌ not running"
```

If Supabase is not running, start it:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && supabase start 2>&1 | tail -5
```

### 3. Check & Start Web Dev Server (Next.js on :3000)

```bash
lsof -i :3000 2>/dev/null | grep -q LISTEN && echo "WEB: ✅ running on :3000" || echo "WEB: ❌ not running"
```

If web is not running, start it:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix && rm -rf apps/web/.next && bun run --filter @clarix/web dev 2>&1
```

Wait ~10s for it to be ready, then verify:

```bash
curl -s http://localhost:3000/api/auth/ok
```

### 4. Check & Start Expo Metro (Mobile on :8081)

```bash
lsof -i :8081 2>/dev/null | grep -q LISTEN && echo "EXPO: ✅ running on :8081" || echo "EXPO: ❌ not running"
```

If Expo is not running, start it:

```bash
cd /Users/nithin/Developer/Apps/fills2.0/clarix/apps/mobile && npx expo start --port 8081 2>&1
```

### 5. Check & Boot iPad Simulator

```bash
xcrun simctl list devices booted 2>/dev/null | grep -q "iPad" && echo "IPAD: ✅ booted" || echo "IPAD: ❌ not booted"
```

If iPad is not booted, boot it and open the app:

```bash
open -a Simulator && xcrun simctl boot "8C7A5BAE-03E0-4C56-8941-6D3A4211EB7E" 2>/dev/null; sleep 5 && xcrun simctl openurl "8C7A5BAE-03E0-4C56-8941-6D3A4211EB7E" "exp://$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):8081"
```

### 6. Check & Boot Android Emulator

```bash
~/Library/Android/sdk/platform-tools/adb devices 2>/dev/null | grep -q "emulator" && echo "ANDROID: ✅ running" || echo "ANDROID: ❌ not running"
```

If Android is not running, boot and open:

```bash
~/Library/Android/sdk/emulator/emulator -avd Medium_Phone_API_36.1 -no-snapshot-load &>/dev/null &; sleep 15 && ~/Library/Android/sdk/platform-tools/adb shell am start -a android.intent.action.VIEW -d "exp://$(ifconfig | grep 'inet ' | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):8081" host.exp.exponent
```

### 7. Final Status Report

```bash
echo "════════════════════════════════════════" && echo "  CLARIX — ALL SCREENS STATUS" && echo "════════════════════════════════════════" && echo "" && (docker info > /dev/null 2>&1 && echo "  🐳 Docker:   ✅" || echo "  🐳 Docker:   ❌") && (cd /Users/nithin/Developer/Apps/fills2.0/clarix && supabase status 2>&1 | grep -q "API URL" && echo "  🗄️  Supabase: ✅" || echo "  🗄️  Supabase: ❌") && (lsof -i :3000 2>/dev/null | grep -q LISTEN && echo "  🖥️  Web:      ✅ localhost:3000" || echo "  🖥️  Web:      ❌") && (lsof -i :8081 2>/dev/null | grep -q LISTEN && echo "  📱 Expo:     ✅ localhost:8081" || echo "  📱 Expo:     ❌") && (xcrun simctl list devices booted 2>/dev/null | grep -q "iPad" && echo "  📱 iPad:     ✅ Simulator" || echo "  📱 iPad:     ❌") && (~/Library/Android/sdk/platform-tools/adb devices 2>/dev/null | grep -q "emulator" && echo "  🤖 Android:  ✅ Emulator" || echo "  🤖 Android:  ❌") && echo "" && echo "════════════════════════════════════════"
```
