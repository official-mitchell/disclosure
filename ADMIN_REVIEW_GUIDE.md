# Admin Review Guide - Catastrophic Disclosure

## Quick Access

**Production URL**: https://disclosure-alluminate.vercel.app

**GM Password**: `admin123`

---

## Step-by-Step Review Instructions

### 1. Access GM Dashboard

1. Go to https://disclosure-alluminate.vercel.app
2. Click **"GM Login"** button
3. Enter password: `admin123`
4. Click **"Access GM Dashboard"**

You should now see the GM Control Panel with:
- Quick stats showing 12 players and 6 clues
- 1 Released clue
- Navigation options for Clues and Players

---

### 2. Review Clue Management

**From the GM Dashboard:**
1. Click **"Manage Clues"** card

You'll see 6 example clues organized by phase:

#### Phase 1 Clues:
- **[EXAMPLE] Intercepted Transmission - PHOENIX**
  - Status: ✅ **Released** to ALL players
  - Target: All players

- **[EXAMPLE] Roswell Incident Report - Classified**
  - Status: ⚪ Not released
  - Target: US players only

#### Phase 2 Clues:
- **[EXAMPLE] Biological Analysis - Unknown Origin**
  - Status: ⚪ Not released
  - Target: SCIENTIST archetype only

- **[EXAMPLE] Tunguska Event - New Evidence**
  - Status: ⚪ Not released
  - Target: RUSSIA players only

#### Phase 3 Clues:
- **[EXAMPLE] Beijing Summit - Secret Protocols**
  - Status: ⚪ Not released
  - Target: DIPLOMAT archetype only

- **[EXAMPLE] Operation MAJESTIC - Full Disclosure**
  - Status: ⚪ Not released
  - Target: All players

**Test These Features:**
- ✅ **Release a clue**: Click "Release" on any unreleased clue
- 🎲 **Randomize assignments**: Click "Randomize" on a clue (try "1 Random" and "50% Random")
- 🔙 **Retract a clue**: Click "Retract" on the already-released clue
- 📝 **Edit a clue**: Click "Edit" to modify any clue details
- 🚀 **Phase Release**: Click "Release All" for an entire phase

---

### 3. Review Player Management

**From the GM Dashboard:**
1. Click **"Manage Players"** card

You'll see 12 example players organized by country:

#### 🇺🇸 United States (4 players):
- [EXAMPLE] Alice Johnson - SCIENTIST
- [EXAMPLE] David Miller - GENERAL
- [EXAMPLE] Sarah Chen - EXECUTIVE
- [EXAMPLE] Marcus Webb - JOURNALIST

#### 🇷🇺 Russia (4 players):
- [EXAMPLE] Boris Petrov - SPY
- [EXAMPLE] Elena Volkov - OPERATIVE
- [EXAMPLE] Dmitri Sokolov - GENERAL
- [EXAMPLE] Natasha Ivanov - SCIENTIST

#### 🇨🇳 China (4 players):
- [EXAMPLE] Wei Chen - DIPLOMAT
- [EXAMPLE] Li Huang - SCIENTIST
- [EXAMPLE] Zhang Wei - SPY
- [EXAMPLE] Mei Lin - EXECUTIVE

**Test These Features:**
- ➕ **Add a player**: Click "+ Add Player" and create a new one
- ✏️ **Edit a player**: Click any player row to edit inline
- 📋 **View character dossier**: Click "Dossier" to view/edit character details
- 🗑️ **Delete a player**: Click "Delete" (will ask for confirmation)

---

### 4. Test View As Player Feature

**From the GM Dashboard:**
1. Look at the top-right corner for the **"View As Player"** dropdown
2. Select any player (e.g., "[EXAMPLE] Alice Johnson")
3. You'll see exactly what that player sees in their dashboard

**What to check:**
- The released clue "[EXAMPLE] Intercepted Transmission - PHOENIX" should be visible
- Clues targeted to other countries/archetypes should NOT be visible
- Try different players to see how targeting works

**To return to GM view:**
- Click the "← Back to GM Dashboard" link at the top

---

### 5. Test Player Login

**Open a new incognito/private browser window:**
1. Go to https://disclosure-alluminate.vercel.app
2. Click **"Player Login"**
3. Try logging in as different players:

#### Example Logins (PIN is repeated digits):
- **Name**: `[EXAMPLE] Alice Johnson` | **PIN**: `1111` (US Scientist)
- **Name**: `[EXAMPLE] Boris Petrov` | **PIN**: `5555` (Russia Spy)
- **Name**: `[EXAMPLE] Wei Chen` | **PIN**: `9999` (China Diplomat)

**What to test:**
- You should see the one released clue (PHOENIX)
- Dashboard shows player's country and archetype
- Click **"Dossier"** tab to see character sheet (if created)
- Try **"Logout"** and log in as different players

---

### 6. Test Clue Targeting

To verify the targeting system works correctly:

**As GM:**
1. Go to **Clue Management**
2. **Release** the clue: "[EXAMPLE] Roswell Incident Report" (targeted to US only)
3. Click **"Randomize"** → **"50% Random"** to assign it to some US players

**Then test as players:**
1. Log in as `[EXAMPLE] Alice Johnson` (US) - PIN: `1111`
   - ✅ Should see BOTH clues if she was randomly selected
2. Log in as `[EXAMPLE] Boris Petrov` (Russia) - PIN: `5555`
   - ❌ Should only see PHOENIX (not the US-only Roswell clue)

---

### 7. Test Create New Clue

**As GM:**
1. Go to **Clue Management**
2. Click **"+ New Clue"** button
3. Fill in all fields:
   - Title, Phase, Target Type
   - Legitimacy, Confidentiality
   - Event Date, Backstory
   - Supporting Intel, Source
   - Takeaways (multiple)
4. Click **"Create Clue"**
5. Verify it appears in the list

---

### 8. Test Character Dossier System

**As GM:**
1. Go to **Player Management**
2. Click **"Dossier"** on any player
3. Click **"Create Character Dossier"**
4. Fill in character details across all 8 sections
5. Save and verify it displays correctly

**As Player:**
1. Log in as that player
2. Click **"Dossier"** tab
3. Verify the character sheet displays with all sections

---

## Example Clue Targeting Summary

| Clue | Phase | Target | Currently Released? |
|------|-------|--------|---------------------|
| PHOENIX | 1 | All | ✅ Yes |
| Roswell | 1 | US only | ❌ No |
| Biological Analysis | 2 | Scientists only | ❌ No |
| Tunguska | 2 | Russia only | ❌ No |
| Beijing Summit | 3 | Diplomats only | ❌ No |
| Operation MAJESTIC | 3 | All | ❌ No |

---

## Things to Verify

### ✅ Core Functionality
- [ ] GM can log in
- [ ] GM can create/edit/delete clues
- [ ] GM can create/edit/delete players
- [ ] GM can release/retract clues
- [ ] GM can randomize clue assignments
- [ ] GM can release entire phases at once
- [ ] GM can view as any player
- [ ] Players can log in
- [ ] Players see only their assigned clues
- [ ] Targeting by country works correctly
- [ ] Targeting by archetype works correctly
- [ ] Character dossier system works

### 🎨 Visual Elements
- [ ] Logo appears on homepage
- [ ] Favicon shows in browser tab
- [ ] Icons appear in navigation bars
- [ ] Clue cards have HOI4-style design
- [ ] All pages have consistent branding

### 🔄 Real-time Updates
- [ ] Player dashboard auto-refreshes every 15 seconds
- [ ] New clues appear without manual refresh
- [ ] Retracted clues disappear appropriately

---

## Test Scenarios

### Scenario 1: Phase Release
1. As GM, go to Clue Management
2. Click "Release All" for Phase 2
3. As player (any scientist), refresh dashboard
4. Verify Biological Analysis clue now appears

### Scenario 2: Individual Targeting
1. As GM, release "Roswell" clue
2. Randomize to 50% of US players
3. Test login for multiple US players
4. Some should see it, some shouldn't
5. Russian/Chinese players should NEVER see it

### Scenario 3: Archetype Targeting
1. As GM, release "Biological Analysis" (Scientists only)
2. Log in as Alice Johnson (US Scientist) - should see it
3. Log in as David Miller (US General) - should NOT see it
4. Log in as Li Huang (China Scientist) - should see it

---

## Quick Reference - All Login Credentials

### Players (Format: Name - Archetype - PIN)

**🇺🇸 United States:**
- [EXAMPLE] Alice Johnson - SCIENTIST - `1111`
- [EXAMPLE] David Miller - GENERAL - `2222`
- [EXAMPLE] Sarah Chen - EXECUTIVE - `3333`
- [EXAMPLE] Marcus Webb - JOURNALIST - `4444`

**🇷🇺 Russia:**
- [EXAMPLE] Boris Petrov - SPY - `5555`
- [EXAMPLE] Elena Volkov - OPERATIVE - `6666`
- [EXAMPLE] Dmitri Sokolov - GENERAL - `7777`
- [EXAMPLE] Natasha Ivanov - SCIENTIST - `8888`

**🇨🇳 China:**
- [EXAMPLE] Wei Chen - DIPLOMAT - `9999`
- [EXAMPLE] Li Huang - SCIENTIST - `0000`
- [EXAMPLE] Zhang Wei - SPY - `1234`
- [EXAMPLE] Mei Lin - EXECUTIVE - `5678`

**🔐 Game Master:**
- Password: `admin123`

---

## Support & Issues

If you encounter any issues during testing:
1. Check browser console for errors (F12 → Console tab)
2. Verify you're using the correct credentials
3. Try in a different browser or incognito mode
4. Check that Vercel Deployment Protection isn't blocking access

**Note**: All example data is clearly labeled with `[EXAMPLE]` prefix for easy identification and cleanup later.
