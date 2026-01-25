# Team Roles Feature - Complete Page State Specification

## 1. Overview

The Team Roles feature enables companies to manage their organizational structure by assigning Human employees and/or AI agents to predefined departmental roles. Each role can have:
- A Human profile (right card)
- An AI profile (left card)
- Both Human AND AI profiles displayed simultaneously
- Placeholder cards for vacant slots

---

## 2. Database Schema

### Table: `company_roles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `company_id` | uuid | Foreign key to companies |
| `department_slug` | text | Department identifier (e.g., "revenue-generation") |
| `role_title` | text | Role name (e.g., "VP of Sales") |
| `status` | text | "filled", "hiring", or "vacant" |
| `profile_type` | text | "human", "ai", or "both" |
| `assigned_name` | text | Human team member name |
| `assigned_email` | text | Human email address |
| `assigned_phone` | text | Human phone number |
| `assigned_photo_url` | text | Human profile photo URL |
| `google_meet_link` | text | Human's Google Meet link |
| `ai_name` | text | AI agent display name |
| `ai_type` | text | "Chat", "Chat, Voice", "Chat, SMS", etc. |
| `ai_agent_id` | text | External AI agent identifier |

**Unique Constraint:** `(company_id, department_slug, role_title)`

---

## 3. TypeScript Interfaces

### `CompanyRole` (walletTypes.ts)
```typescript
interface CompanyRole {
  id: string;
  department_slug: string;
  role_title: string;
  status: 'filled' | 'hiring' | 'vacant';
  assigned_name?: string;
  assigned_email?: string;
  assigned_phone?: string;
  assigned_photo_url?: string;
  google_meet_link?: string;
  profile_type?: 'human' | 'ai' | 'both';
  ai_name?: string;
  ai_type?: string;
  ai_agent_id?: string;
  hire_request_id?: string;
}
```

### `ProfileData` (ProfileCard.tsx)
```typescript
interface ProfileData {
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  googleMeetLink?: string;
  profileLink?: string;
  type: 'human' | 'ai';
  aiType?: string;
  aiAgentId?: string;
}
```

### `HireFormData` (HireOptionsModal.tsx)
```typescript
type ProfileType = 'human' | 'ai' | 'both';
type AIAddon = 'voice' | 'sms' | 'integration';

interface HireFormData {
  profileType: ProfileType;
  humanName?: string;
  humanEmail?: string;
  humanPhone?: string;
  humanPhotoUrl?: string;
  googleMeetLink?: string;
  aiName?: string;
  aiType?: string;
  aiAddons?: AIAddon[];
  aiAgentId?: string;
}
```

---

## 4. Component Architecture

### Component Hierarchy
```
UsageWallet
└── TeamRolesSection (Sheet panel)
    └── HireOptionsModal

DepartmentPage
└── RolesStructure
    ├── ProfileCard (AI - left)
    ├── ProfileCard (Human - right)
    ├── Placeholder Card (Hire AI)
    ├── Placeholder Card (Hire Human)
    └── HireOptionsModal
```

### Key Components

**RolesStructure.tsx** - Main roles display component
- Always renders 2-column grid per role
- AI card/placeholder on LEFT, Human card/placeholder on RIGHT
- Collapsible role details with description, responsibilities, skills

**ProfileCard.tsx** - Displays filled role information
- Supports `compact` mode for inline display
- Shows avatar, name, contact info (email, phone, Google Meet)
- AI cards show "Chat Now" button
- Human cards show "Meet" and "Email" buttons

**HireOptionsModal.tsx** - Role assignment form
- Step 1: Select type (Human, AI, or Both)
- Step 2: Enter details
- AI Type defaults to "Chat" with optional add-ons (Voice, SMS, Integration)
- Add-ons show cost notes (e.g., "Phone number + usage fees")

---

## 5. Edge Functions

### `update-company-role` 
**Purpose:** Upsert role assignments
**Endpoint:** `supabase.functions.invoke('update-company-role', { body })`

**Payload:**
```typescript
{
  company_id: string;
  department_slug: string;
  role_title: string;
  assigned_name?: string;
  assigned_email?: string;
  assigned_phone?: string;
  assigned_photo_url?: string;
  google_meet_link?: string;
  profile_type: 'human' | 'ai' | 'both';
  ai_name?: string;
  ai_type?: string;
  ai_agent_id?: string;
  status?: string;
}
```

**Status Logic:**
- If `assigned_name` OR `ai_name` is provided -> status = "filled"
- Otherwise -> status = "vacant"

### `wallet-proxy`
**Purpose:** Aggregate all company data including roles
**Returns:** Complete `WalletData` object with `company_roles` array

---

## 6. UI States

### Role Card States

| State | AI Column (Left) | Human Column (Right) |
|-------|------------------|---------------------|
| Empty | Hire AI placeholder | Hire Human placeholder |
| AI Only | AI ProfileCard | Hire Human placeholder |
| Human Only | Hire AI placeholder | Human ProfileCard |
| Both | AI ProfileCard | Human ProfileCard |

### Placeholder Card Design
- Dashed border (2px)
- Rounded corners (xl)
- Hover: border color intensifies, background changes
- Contains: icon, title, subtitle, description

**AI Placeholder (Purple theme):**
```
Border: border-purple-300
Background: bg-purple-50/50
Hover Border: border-purple-500
Hover Background: bg-purple-100/50
Icon: Bot in purple circle (bg-purple-100)
Title: "Hire AI"
Subtitle: "Deploy an AI agent"
Description: "Click to deploy an AI assistant for this role"
```

**Human Placeholder (Blue theme):**
```
Border: border-blue-300
Background: bg-blue-50/50
Hover Border: border-blue-500
Hover Background: bg-blue-100/50
Icon: User in blue circle (bg-blue-100)
Title: "Hire Human"
Subtitle: "Assign a team member"
Description: "Click to add a human employee to this role"
```

---

## 7. Department Configuration

Departments are defined in `departmentConfigs.ts` with:
- 6 departments total
- Each has color, icon, roles array
- Roles include: title, description, responsibilities[], skills[], hiringType

**Department Colors:**
| Department | Color | Tailwind Classes |
|------------|-------|------------------|
| Revenue Generation | blue | bg-blue-500, text-blue-500 |
| Creative & Content | pink | bg-pink-500, text-pink-500 |
| Technology | purple | bg-purple-500, text-purple-500 |
| Operations | green | bg-green-500, text-green-500 |
| Finance | orange | bg-orange-500, text-orange-500 |
| People & Culture | teal | bg-teal-500, text-teal-500 |

---

## 8. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User opens Service Hub department or My Service Account │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. wallet-proxy fetches company_roles from database         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Roles matched to department config by slug + role_title  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. UI renders ProfileCards for filled, placeholders vacant  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. User clicks placeholder -> HireOptionsModal opens        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. User submits form -> update-company-role edge function   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Success -> refresh wallet data -> UI updates             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Key Files Reference

| File | Purpose |
|------|---------|
| `src/components/RolesStructure.tsx` | Department page roles display with dual-column layout |
| `src/components/ProfileCard.tsx` | Profile card component for human/AI display |
| `src/components/HireOptionsModal.tsx` | Hire/assign form modal with 2-step flow |
| `src/components/TeamRolesSection.tsx` | Wallet page roles section (accordion style) |
| `src/lib/walletTypes.ts` | TypeScript interfaces for wallet/role data |
| `src/lib/departmentConfigs.ts` | Department and role definitions |
| `supabase/functions/update-company-role/index.ts` | Role upsert API endpoint |
| `supabase/functions/wallet-proxy/index.ts` | Data aggregation API |

---

## 10. Replication Checklist

To recreate this feature in a new project:

- [ ] **Database Setup**
  - [ ] Create `company_roles` table with above schema
  - [ ] Add unique constraint on (company_id, department_slug, role_title)
  - [ ] Enable RLS with appropriate policies

- [ ] **Edge Functions**
  - [ ] Create `update-company-role` edge function
  - [ ] Extend wallet proxy to fetch company_roles with joins

- [ ] **Configuration**
  - [ ] Define department configurations with roles array
  - [ ] Set up department color mappings

- [ ] **Components**
  - [ ] Build ProfileCard component with human/AI variants
  - [ ] Build HireOptionsModal with 2-step flow
  - [ ] Build RolesStructure with persistent dual-column layout
  - [ ] Build placeholder cards with proper theming

- [ ] **Integration**
  - [ ] Wire up data flow from wallet to components
  - [ ] Implement role assignment handlers
  - [ ] Add refresh logic after assignments

---

## 11. Design Tokens

### Colors Used
```css
/* AI Theme - Purple */
--ai-primary: purple-500
--ai-bg: purple-50/50, purple-100
--ai-border: purple-300, purple-500 (hover)
--ai-dark-bg: purple-950/20, purple-900/30 (hover)

/* Human Theme - Blue */
--human-primary: blue-500
--human-bg: blue-50/50, blue-100
--human-border: blue-300, blue-500 (hover)
--human-dark-bg: blue-950/20, blue-900/30 (hover)

/* Status Colors */
--filled: emerald (both), blue (human), purple (ai)
--hiring: amber
--vacant: gray
```

### Spacing & Layout
```css
/* Card Grid */
grid-cols-1 sm:grid-cols-2
gap-3 (cards), gap-4 (larger sections)

/* Card Padding */
p-4 (placeholder cards)
p-6 (profile cards)

/* Border Radius */
rounded-xl (cards)
rounded-full (avatars)

/* Avatar Sizes */
w-12 h-12 (standard)
w-10 h-10 (compact)
```

---

*Generated: January 2026*
*Version: 1.0*
