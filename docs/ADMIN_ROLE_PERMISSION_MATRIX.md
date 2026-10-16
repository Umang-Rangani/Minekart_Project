# MineKart Admin — Role & Permission Matrix

> **Status:** Verification draft — review and mark changes before any code is written.  
> **Model:** Hybrid (role defaults + per-user overrides)  
> **Inspired by:** msv-pvt (`prefix:action` keys, SuperAdmin bypass, shared `ROLES` / `SECTION_KEYS` / `ACTIONS` constants)

---

## 1. Overview

MineKart currently gates the admin panel with a single role check (`User` vs `Admin`). This document defines a **hybrid RBAC** model for all current admin features so access can be role-based with optional customization.

**Never hardcode role or permission strings in pages/routes.** Use shared constants (same pattern as msv-pvt) on both frontend and backend — see [§3.4 Constants files](#34-constants-files-frontend--backend).

| Concept | Behavior |
|---------|----------|
| **Role** | Assigns a **default** set of permissions (starting point for employees) |
| **Permissions** | Required for **every role except SuperAdmin** to access any admin feature |
| **Overrides** | After an employee is created, permissions can be changed per user |
| **Effective permissions** | Role defaults ∪ override grants − override revokes |
| **SuperAdmin** | Needs **no** permissions — implicit full access to the whole admin panel |
| **Storefront `User`** | Customer; created on the website; cannot access `/admin/*` |
| **Employee** | Any admin-panel role (`Admin`, `CatalogManager`, `OrderManager`, `Support`); created from Users page |
| **Constants** | `ROLES`, `SECTION_KEYS`, `ACTIONS` — identical shape in FE + BE |

### Access rule (critical)

| Who | How access works |
|-----|------------------|
| **SuperAdmin** | No permission checks. Sees every feature. Does not store or need `admin_permissions`. |
| **Everyone else** (`Admin`, `CatalogManager`, `OrderManager`, `Support`) | Must have the relevant permission (from role defaults and/or overrides) or access is denied. |

```
SuperAdmin ──→ Full site access (no permission map needed)

Any other admin role
  Login → Load role defaults → Apply user overrides → Effective permissions
                                                        ↓
                                Sidebar + page + API gates (permission required)
```

### How accounts are created

| Account type | Who creates | Where | Notes |
|--------------|-------------|-------|-------|
| **SuperAdmin** | You (dev/ops) | **Postman** (dedicated create / bootstrap API) | First SuperAdmin is **not** created from the website or Users “+”. Call the API once (or as needed) with role `SuperAdmin`. No permissions body required. |
| **Customer** (`ROLES.USER`) | Themselves | MineKart **website** (register / signup) | Storefront only. Never created from admin Users “+”. Never set to SuperAdmin via public register. |
| **Employee** (admin roles) | SuperAdmin or Admin (if permitted) | Admin **Users** page → **+** button | Create `Admin` / `CatalogManager` / `OrderManager` / `Support`; then set/change permissions. |

After an employee is created:

1. They get **role default** permissions from `ROLE_DEFAULT_PERMISSIONS`.
2. SuperAdmin (or Admin **if SuperAdmin granted** `ACTIONS.User.MANAGE_PERMISSIONS`) can open that user and **change their permissions**.
3. Admin can only grant permissions they themselves have (unless SuperAdmin — who can grant any).

---

## 2. Roles

Admin-panel roles (future User model enum expansion; today only `User` | `Admin` exist).  
In code use `ROLES.*` from §3.4 — never string literals.

| Role | `ROLES` constant | Stored value | Needs permissions? | Purpose |
|------|------------------|--------------|:------------------:|---------|
| Super Admin | `ROLES.SUPER_ADMIN` | `SuperAdmin` | **No** (bypass) | Full access to all features; create employees; assign any permissions |
| Admin | `ROLES.ADMIN` | `Admin` | **Yes** | Day-to-day ops; create employees + edit permissions **only if** SuperAdmin gave those permissions |
| Catalog Manager | `ROLES.CATALOG_MANAGER` | `CatalogManager` | **Yes** | Categories, subcategories, brands, products + dashboard view |
| Order Manager | `ROLES.ORDER_MANAGER` | `OrderManager` | **Yes** | Orders, returns, refunds, payment confirm + notifications + dashboard |
| Support | `ROLES.SUPPORT` | `Support` | **Yes** | Contact messages, limited order view, notifications |

**Not an admin / employee role**

| Role | `ROLES` constant | Stored value | Created via | Purpose |
|------|------------------|--------------|-------------|---------|
| Customer | `ROLES.USER` | `User` | MineKart website signup | Storefront only; no `/admin/*` |

### Hierarchy (for grant rules)

Use `ROLE_HIERARCHY` from §3.4:

`ROLES.SUPER_ADMIN` > `ROLES.ADMIN` > `ROLES.CATALOG_MANAGER` / `ROLES.ORDER_MANAGER` / `ROLES.SUPPORT`

- **SuperAdmin** — no permissions required; can create any employee; can assign any permission to anyone.
- **Admin** — needs permissions like everyone else. Can create employees and change their permissions **only when** SuperAdmin has granted `usr:create` / `usr:manage-permissions` (and may only grant keys Admin already has).
- Employees cannot create SuperAdmin accounts or edit SuperAdmin permissions.

---

## 3. Permission catalog

Pattern: **`prefix:action`** (same style as msv-pvt).

### 3.1 Sections and keys

| Section | Prefix | Permission keys |
|---------|--------|-----------------|
| Dashboard | `dash` | `dash:view` |
| Category | `cat` | `cat:listing`, `cat:view`, `cat:create`, `cat:update`, `cat:delete` |
| SubCategory | `sub` | `sub:listing`, `sub:view`, `sub:create`, `sub:update`, `sub:delete` |
| Brand | `br` | `br:listing`, `br:view`, `br:create`, `br:update`, `br:delete` |
| Product | `prd` | `prd:listing`, `prd:view`, `prd:create`, `prd:update`, `prd:delete` |
| Order | `ord` | `ord:listing`, `ord:view`, `ord:update-status`, `ord:confirm-payment`, `ord:return-review`, `ord:item-received`, `ord:refund`, `ord:delete` |
| User | `usr` | `usr:listing`, `usr:view`, `usr:create`, `usr:update-status`, `usr:delete`, `usr:manage-permissions` |
| Notification | `ntf` | `ntf:listing`, `ntf:view`, `ntf:update`, `ntf:delete` |
| Contact | `ctc` | `ctc:listing`, `ctc:view`, `ctc:reply`, `ctc:update-status`, `ctc:delete` |

### 3.2 Action meanings

| Action | Typical UI / API use |
|--------|----------------------|
| `listing` | List page / table access |
| `view` | Detail / read-only view |
| `create` | Create form / POST |
| `update` | Edit form / PUT |
| `delete` | Delete action |
| `create` (User section) | Create **employee** from Users page **+** button (not website customers) |
| `update-status` | Status toggle or workflow status change |
| `confirm-payment` | Confirm COD / ONLINE_ON_DELIVERY payment |
| `return-review` | Approve / reject return request |
| `item-received` | Mark returned item received |
| `refund` | Process / verify refund (Razorpay or manual) |
| `reply` | Reply to contact / support ticket |
| `manage-permissions` | Change an employee’s permissions after creation |

### 3.3 Storage shape (for later implementation)

```js
// Role defaults live in ROLE_DEFAULT_PERMISSIONS (see §3.4)
// Per-user overrides on User document, e.g.:
admin_permissions: {
  // SECTION_KEYS → array of ACTIONS.*.* values
  [SECTION_KEYS.Product]: [ACTIONS.Product.LISTING, ACTIONS.Product.VIEW],
  [SECTION_KEYS.Order]: [ACTIONS.Order.LISTING, ACTIONS.Order.VIEW, ACTIONS.Order.UPDATE_STATUS],
}
```

Stored values in Mongo remain the string keys (`prd:listing`, etc.). Code always reads/writes via constants.

### 3.4 Constants files (frontend + backend)

Same idea as msv-pvt `constants/permission.ts`: one source of names on each side. **Keep both files in sync** (same keys and string values).

| Side | File to create (implementation step) |
|------|--------------------------------------|
| Frontend | `frontend/src/constants/permission.js` |
| Backend | `backend/constants/permission.js` |

Optional later: shared package — for now duplicate the same exports in both places.

#### Exports (required)

| Export | Purpose |
|--------|---------|
| `ROLES` | All role string values (`User`, `SuperAdmin`, …) |
| `ADMIN_ROLES` | Roles that may enter `/admin/*` (excludes `User`) |
| `SECTION_KEYS` | Admin feature section names (map keys for `admin_permissions`) |
| `ACTIONS` | Nested `prefix:action` strings per section |
| `ROLE_DEFAULT_PERMISSIONS` | Default matrix from §4 as `{ [role]: { [section]: string[] } }` |
| `ROLE_HIERARCHY` | Ordered list for grant / compare rules |

#### Proposed constant definitions

Use these exact names and values when creating the files. Pages/middleware must import from here — **no raw `'Admin'` / `'prd:create'` strings**.

```js
// frontend/src/constants/permission.js
// backend/constants/permission.js
// (identical content)

export const ROLES = {
  USER: 'User',
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  CATALOG_MANAGER: 'CatalogManager',
  ORDER_MANAGER: 'OrderManager',
  SUPPORT: 'Support',
}

/** Roles allowed into the admin panel */
export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.CATALOG_MANAGER,
  ROLES.ORDER_MANAGER,
  ROLES.SUPPORT,
]

/** Higher index = higher privilege (for comparisons) */
export const ROLE_HIERARCHY = [
  ROLES.SUPPORT,
  ROLES.CATALOG_MANAGER,
  ROLES.ORDER_MANAGER,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
]

export const SECTION_KEYS = {
  Dashboard: 'Dashboard',
  Category: 'Category',
  SubCategory: 'SubCategory',
  Brand: 'Brand',
  Product: 'Product',
  Order: 'Order',
  User: 'User',
  Notification: 'Notification',
  Contact: 'Contact',
}

export const ACTIONS = {
  Dashboard: {
    VIEW: 'dash:view',
  },
  Category: {
    LISTING: 'cat:listing',
    VIEW: 'cat:view',
    CREATE: 'cat:create',
    UPDATE: 'cat:update',
    DELETE: 'cat:delete',
  },
  SubCategory: {
    LISTING: 'sub:listing',
    VIEW: 'sub:view',
    CREATE: 'sub:create',
    UPDATE: 'sub:update',
    DELETE: 'sub:delete',
  },
  Brand: {
    LISTING: 'br:listing',
    VIEW: 'br:view',
    CREATE: 'br:create',
    UPDATE: 'br:update',
    DELETE: 'br:delete',
  },
  Product: {
    LISTING: 'prd:listing',
    VIEW: 'prd:view',
    CREATE: 'prd:create',
    UPDATE: 'prd:update',
    DELETE: 'prd:delete',
  },
  Order: {
    LISTING: 'ord:listing',
    VIEW: 'ord:view',
    UPDATE_STATUS: 'ord:update-status',
    CONFIRM_PAYMENT: 'ord:confirm-payment',
    RETURN_REVIEW: 'ord:return-review',
    ITEM_RECEIVED: 'ord:item-received',
    REFUND: 'ord:refund',
    DELETE: 'ord:delete',
  },
  User: {
    LISTING: 'usr:listing',
    VIEW: 'usr:view',
    CREATE: 'usr:create', // employee via Users page + button (not website signup)
    UPDATE_STATUS: 'usr:update-status',
    DELETE: 'usr:delete',
    MANAGE_PERMISSIONS: 'usr:manage-permissions', // change employee permissions after create
  },
  Notification: {
    LISTING: 'ntf:listing',
    VIEW: 'ntf:view',
    UPDATE: 'ntf:update',
    DELETE: 'ntf:delete',
  },
  Contact: {
    LISTING: 'ctc:listing',
    VIEW: 'ctc:view',
    REPLY: 'ctc:reply',
    UPDATE_STATUS: 'ctc:update-status',
    DELETE: 'ctc:delete',
  },
}
```

#### `ROLE_DEFAULT_PERMISSIONS` (encode §4 matrix)

```js
const CATALOG_FULL = {
  [SECTION_KEYS.Category]: Object.values(ACTIONS.Category),
  [SECTION_KEYS.SubCategory]: Object.values(ACTIONS.SubCategory),
  [SECTION_KEYS.Brand]: Object.values(ACTIONS.Brand),
  [SECTION_KEYS.Product]: Object.values(ACTIONS.Product),
}

const CATALOG_READ = {
  [SECTION_KEYS.Category]: [ACTIONS.Category.LISTING, ACTIONS.Category.VIEW],
  [SECTION_KEYS.SubCategory]: [ACTIONS.SubCategory.LISTING, ACTIONS.SubCategory.VIEW],
  [SECTION_KEYS.Brand]: [ACTIONS.Brand.LISTING, ACTIONS.Brand.VIEW],
  [SECTION_KEYS.Product]: [ACTIONS.Product.LISTING, ACTIONS.Product.VIEW],
}

export const ROLE_DEFAULT_PERMISSIONS = {
  // SuperAdmin: empty on purpose — bypass; never check this map
  [ROLES.SUPER_ADMIN]: {},
  [ROLES.ADMIN]: {
    [SECTION_KEYS.Dashboard]: [ACTIONS.Dashboard.VIEW],
    ...CATALOG_FULL,
    [SECTION_KEYS.Order]: Object.values(ACTIONS.Order),
    [SECTION_KEYS.User]: [
      ACTIONS.User.LISTING,
      ACTIONS.User.VIEW,
      ACTIONS.User.CREATE, // + button: create employee
      ACTIONS.User.UPDATE_STATUS,
      ACTIONS.User.DELETE,
      // MANAGE_PERMISSIONS: not by default — SuperAdmin can grant it
    ],
    [SECTION_KEYS.Notification]: Object.values(ACTIONS.Notification),
    [SECTION_KEYS.Contact]: Object.values(ACTIONS.Contact),
  },
  [ROLES.CATALOG_MANAGER]: {
    [SECTION_KEYS.Dashboard]: [ACTIONS.Dashboard.VIEW],
    ...CATALOG_FULL,
  },
  [ROLES.ORDER_MANAGER]: {
    [SECTION_KEYS.Dashboard]: [ACTIONS.Dashboard.VIEW],
    ...CATALOG_READ,
    [SECTION_KEYS.Order]: Object.values(ACTIONS.Order),
    [SECTION_KEYS.Notification]: Object.values(ACTIONS.Notification),
  },
  [ROLES.SUPPORT]: {
    [SECTION_KEYS.Order]: [ACTIONS.Order.LISTING, ACTIONS.Order.VIEW],
    [SECTION_KEYS.Notification]: [
      ACTIONS.Notification.LISTING,
      ACTIONS.Notification.VIEW,
      ACTIONS.Notification.UPDATE,
    ],
    [SECTION_KEYS.Contact]: Object.values(ACTIONS.Contact),
  },
}
```

#### Usage (do this everywhere — like msv-pvt)

```js
// Frontend — page / button gate
import { SECTION_KEYS, ACTIONS, ROLES } from '../constants/permission'
import { hasPermission } from '../lib/permission' // future helper

if (hasPermission(user, SECTION_KEYS.Product, ACTIONS.Product.CREATE)) {
  // show Create Product
}

if (user.role === ROLES.SUPER_ADMIN) {
  // bypass
}

// Backend — middleware / route
import { SECTION_KEYS, ACTIONS, ROLES, ADMIN_ROLES } from '../constants/permission'

router.post(
  '/',
  authMiddleware,
  requirePermission(SECTION_KEYS.Category, ACTIONS.Category.CREATE),
  createCategory
)

if (!ADMIN_ROLES.includes(req.user.role)) {
  return res.status(403).json({ message: 'Forbidden' })
}
```

#### Anti-patterns (avoid)

```js
// BAD — raw strings
if (user.role === 'Admin') { ... }
if (hasPermission(user, 'Product', 'prd:create')) { ... }

// GOOD — constants
if (user.role === ROLES.ADMIN) { ... }
if (hasPermission(user, SECTION_KEYS.Product, ACTIONS.Product.CREATE)) { ... }
```

#### Sync rule

When adding a feature:

1. Add keys to `SECTION_KEYS` / `ACTIONS` in **both** FE and BE files  
2. Update `ROLE_DEFAULT_PERMISSIONS`  
3. Update the matrix tables in this doc  
4. Then wire UI / routes  

---

## 4. Default role × permission matrix

Legend: **Y** = granted by default · **—** = not granted · **ALL** = SuperAdmin bypass (does **not** store these keys; full access without a permission map)

Mark cells with your preferred change (e.g. change `—` → `Y`) when reviewing.

Remember: for Admin / CatalogManager / OrderManager / Support, a **—** means no access unless SuperAdmin (or an Admin with `MANAGE_PERMISSIONS`) later grants that key.

### 4.1 Dashboard

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `dash:view` | ALL | Y | Y | Y | — |

### 4.2 Category

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `cat:listing` | ALL | Y | Y | Y | — |
| `cat:view` | ALL | Y | Y | Y | — |
| `cat:create` | ALL | Y | Y | — | — |
| `cat:update` | ALL | Y | Y | — | — |
| `cat:delete` | ALL | Y | Y | — | — |

### 4.3 SubCategory

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `sub:listing` | ALL | Y | Y | Y | — |
| `sub:view` | ALL | Y | Y | Y | — |
| `sub:create` | ALL | Y | Y | — | — |
| `sub:update` | ALL | Y | Y | — | — |
| `sub:delete` | ALL | Y | Y | — | — |

### 4.4 Brand

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `br:listing` | ALL | Y | Y | Y | — |
| `br:view` | ALL | Y | Y | Y | — |
| `br:create` | ALL | Y | Y | — | — |
| `br:update` | ALL | Y | Y | — | — |
| `br:delete` | ALL | Y | Y | — | — |

### 4.5 Product

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `prd:listing` | ALL | Y | Y | Y | — |
| `prd:view` | ALL | Y | Y | Y | — |
| `prd:create` | ALL | Y | Y | — | — |
| `prd:update` | ALL | Y | Y | — | — |
| `prd:delete` | ALL | Y | Y | — | — |

### 4.6 Order

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `ord:listing` | ALL | Y | — | Y | Y |
| `ord:view` | ALL | Y | — | Y | Y |
| `ord:update-status` | ALL | Y | — | Y | — |
| `ord:confirm-payment` | ALL | Y | — | Y | — |
| `ord:return-review` | ALL | Y | — | Y | — |
| `ord:item-received` | ALL | Y | — | Y | — |
| `ord:refund` | ALL | Y | — | Y | — |
| `ord:delete` | ALL | Y | — | Y | — |

### 4.7 User (customers list + employee create / permissions)

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `usr:listing` | ALL | Y | — | — | — |
| `usr:view` | ALL | Y | — | — | — |
| `usr:create` | ALL | Y | — | — | — |
| `usr:update-status` | ALL | Y | — | — | — |
| `usr:delete` | ALL | Y | — | — | — |
| `usr:manage-permissions` | ALL | —* | — | — | — |

\* Admin default is **—**. SuperAdmin can grant `usr:manage-permissions` to an Admin; then that Admin can change employee permissions (only keys they have).

Notes:

- **SuperAdmin** column is “ALL” meaning bypass — SuperAdmin does not need these keys stored.
- `usr:create` = Users page **+** → create **employee** (Admin / CatalogManager / OrderManager / Support). Website customers are **not** created here.
- `usr:manage-permissions` = after create (or later), edit that employee’s permission map.
- No one edits SuperAdmin accounts’ permissions (SuperAdmin does not use a permission map).
- Matrix tables show **stored string values** for readability; in code always use `ACTIONS.*` / `ROLES.*`.

### 4.8 Notification

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `ntf:listing` | ALL | Y | — | Y | Y |
| `ntf:view` | ALL | Y | — | Y | Y |
| `ntf:update` | ALL | Y | — | Y | Y |
| `ntf:delete` | ALL | Y | — | Y | — |

### 4.9 Contact

| Permission | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|------------|:----------:|:-----:|:--------------:|:------------:|:-------:|
| `ctc:listing` | ALL | Y | — | — | Y |
| `ctc:view` | ALL | Y | — | — | Y |
| `ctc:reply` | ALL | Y | — | — | Y |
| `ctc:update-status` | ALL | Y | — | — | Y |
| `ctc:delete` | ALL | Y | — | — | Y |

---

## 5. Hybrid override rules

### 5.1 Access evaluation

1. If `user.role === ROLES.SUPER_ADMIN` → **allow everything**. Do not read permissions. Stop.
2. Otherwise → load `ROLE_DEFAULT_PERMISSIONS[user.role]`, merge user overrides → **effective permissions**.
3. Feature allowed only if the required `ACTIONS.*` key is in effective permissions. No key → deny.

### 5.2 Overrides (change permissions after employee create)

1. **Defaults first** — New employee starts with role defaults from §4.
2. **Change anytime** — SuperAdmin, or Admin with `ACTIONS.User.MANAGE_PERMISSIONS`, edits that user’s `admin_permissions`.
3. **Grants** add keys; **denies** remove keys the role would have.
4. **Granter limits**
   - SuperAdmin: can assign **any** permission.
   - Admin (with `MANAGE_PERMISSIONS`): can only assign permissions **they themselves** currently have.
5. **Targets** — Can edit CatalogManager / OrderManager / Support / Admin employees as allowed by hierarchy. **Cannot** edit SuperAdmin. **Cannot** invent website customers via this flow (customers come from signup).

### 5.3 Bootstrap SuperAdmin (Postman)

- Public website `register` always creates `ROLES.USER` only — cannot become SuperAdmin.
- Users page **+** never offers `SuperAdmin` as a role option.
- Create SuperAdmin via **Postman**:

```http
POST {{API_URL}}/users/bootstrap-superadmin
Header: x-bootstrap-secret: <SUPERADMIN_BOOTSTRAP_SECRET from backend .env>
Content-Type: application/json

{
  "name": "Owner",
  "email": "owner@minekart.com",
  "password": "your-secure-password",
  "phone": ""
}
```

- Set `SUPERADMIN_BOOTSTRAP_SECRET` in `backend/.env` (see `.env.example`).
- Existing `Admin` users keep working with role-default permissions; use Postman when you need a SuperAdmin.

### 5.4 Create employee (Users page +)

| Actor | Requirement | Can create |
|-------|-------------|------------|
| SuperAdmin | None (bypass) | `Admin`, `CatalogManager`, `OrderManager`, `Support` — **not** SuperAdmin (use Postman for that) |
| Admin | `ACTIONS.User.CREATE` | `CatalogManager`, `OrderManager`, `Support`, and `Admin` — **not** SuperAdmin |

Flow:

1. Users page → **+** → form (name, email, password, **role**).
2. Save → employee created with that role’s **default** permissions.
3. Optionally open **Permissions** UI immediately (needs `MANAGE_PERMISSIONS`) and adjust.

### 5.5 Website customer

- Register on MineKart website → `ROLES.USER` only.
- No admin permissions, no `/admin` access.
- Appears in Users list for listing/status/delete if actor has those `usr:*` keys — not created via +.

### 5.6 Safety

- Cannot lock out the last SuperAdmin.
- SuperAdmin never depends on a permission map.
- Postman SuperAdmin create must not be callable without protection in production.

---

## 6. Sidebar → section mapping

Current nav from `frontend/src/admin/AdminLayout.jsx`. Show sidebar item if the user has **any** permission for that `SECTION_KEYS.*` (same idea as msv-pvt). Wire `menuItems` with `section: SECTION_KEYS.X` — never hardcode section names.

| Nav label | Path | `SECTION_KEYS` | Min permission to show |
|-----------|------|----------------|------------------------|
| Dashboard | `/admin` | `Dashboard` | `ACTIONS.Dashboard.VIEW` |
| Category | `/admin/category` | `Category` | any `ACTIONS.Category.*` |
| SubCategory | `/admin/subcategory` | `SubCategory` | any `ACTIONS.SubCategory.*` |
| Brand | `/admin/brand` | `Brand` | any `ACTIONS.Brand.*` |
| Products | `/admin/products` | `Product` | any `ACTIONS.Product.*` |
| Orders | `/admin/orders` | `Order` | any `ACTIONS.Order.*` |
| Users | `/admin/users` | `User` | any `ACTIONS.User.*` |
| Notifications | `/admin/notifications` | `Notification` | any `ACTIONS.Notification.*` |
| Contact Messages | `/admin/contact-messages` | `Contact` | any `ACTIONS.Contact.*` |

### Default sidebar visibility by role

| Nav | SuperAdmin | Admin | CatalogManager | OrderManager | Support |
|-----|:----------:|:-----:|:--------------:|:------------:|:-------:|
| Dashboard | Y | Y | Y | Y | — |
| Category | Y | Y | Y | Y | — |
| SubCategory | Y | Y | Y | Y | — |
| Brand | Y | Y | Y | Y | — |
| Products | Y | Y | Y | Y | — |
| Orders | Y | Y | — | Y | Y |
| Users | Y | Y | — | — | — |
| Notifications | Y | Y | — | Y | Y |
| Contact Messages | Y | Y | — | — | Y |

---

## 7. Page / action gate checklist (for later implementation)

Use `ACTIONS.*` constants only. **SuperAdmin skips all of these.**

| Module | LISTING / VIEW | CREATE | UPDATE | DELETE | Extra |
|--------|----------------|--------|--------|--------|-------|
| Dashboard | `ACTIONS.Dashboard.VIEW` | — | — | — | — |
| Category | `.LISTING` / `.VIEW` | `.CREATE` | `.UPDATE` | `.DELETE` | Active/Inactive via update |
| SubCategory | `.LISTING` / `.VIEW` | `.CREATE` | `.UPDATE` | `.DELETE` | |
| Brand | `.LISTING` / `.VIEW` | `.CREATE` | `.UPDATE` | `.DELETE` | |
| Product | `.LISTING` / `.VIEW` | `.CREATE` | `.UPDATE` | `.DELETE` | |
| Order | `.LISTING` / `.VIEW` | — | `.UPDATE_STATUS` | `.DELETE` | `.CONFIRM_PAYMENT`, `.RETURN_REVIEW`, `.ITEM_RECEIVED`, `.REFUND` |
| User | `.LISTING` / `.VIEW` | `.CREATE` (employee +) | `.UPDATE_STATUS` | `.DELETE` | `.MANAGE_PERMISSIONS` |
| Notification | `.LISTING` / `.VIEW` | — | `.UPDATE` (mark read) | `.DELETE` | |
| Contact | `.LISTING` / `.VIEW` | — | `.UPDATE_STATUS` | `.DELETE` | `.REPLY` |

Users UI notes:

- **+** button visible only with `ACTIONS.User.CREATE` (or SuperAdmin).
- **Permissions** action visible only with `ACTIONS.User.MANAGE_PERMISSIONS` (or SuperAdmin).
- Website customers: list/status/delete only — no permission editor (they are not employees).

---

## 8. Review checklist — please verify

Use this list to approve or request changes before coding.

### Roles & access

- [ ] SuperAdmin needs **no** permissions and gets **all** features — OK?
- [ ] Every other admin role **must** have permissions to access features — OK?
- [ ] Names via `ROLES.*` are OK
- [ ] Customers = `ROLES.USER` via **website signup** only — OK?
- [ ] Employees = created from Users **+** by SuperAdmin/Admin — OK?

### Constants files (§3.4)

- [ ] Paths OK: `frontend/src/constants/permission.js` + `backend/constants/permission.js`
- [ ] Export set OK: `ROLES`, `ADMIN_ROLES`, `ROLE_HIERARCHY`, `SECTION_KEYS`, `ACTIONS`, `ROLE_DEFAULT_PERMISSIONS`
- [ ] `ACTIONS.User.CREATE` + `MANAGE_PERMISSIONS` OK
- [ ] Agree: never use raw role/permission strings in pages — only constants

### Defaults

- [ ] CatalogManager: no order/contact/user access — OK?
- [ ] OrderManager: catalog **read-only** (listing/view) — OK?
- [ ] Support: order **view only** (no status/payment/refund) — OK?
- [ ] Support: **no** `ACTIONS.Dashboard.VIEW` — OK, or grant dashboard?
- [ ] Support: **no** `ACTIONS.Notification.DELETE` — OK?
- [ ] Admin has `usr:create` by default, but **not** `usr:manage-permissions` until SuperAdmin grants it — OK?

### Hybrid / employee flows

- [ ] After employee create, permissions can be changed — OK?
- [ ] Admin can change permissions **only if** SuperAdmin granted `MANAGE_PERMISSIONS` — OK?
- [ ] Admin granter can only grant permissions they have — OK?

### Decisions locked from your feedback

| # | Topic | Decision |
|---|-------|----------|
| 1 | SuperAdmin | No permissions needed; full site access |
| 2 | All other roles | Permission required for every feature |
| 3 | Customer create | MineKart website only (`ROLES.USER`) |
| 4 | Employee create | Users page **+** button |
| 5 | Change permissions | After create (and anytime); SuperAdmin always; Admin if granted `MANAGE_PERMISSIONS` |
| 6 | Permission UI | Under Users (employee row / detail) |
| 7 | First / extra SuperAdmin | **Postman API** bootstrap — not website signup, not Users “+” |

### Still open (optional)

| # | Question | Current draft answer |
|---|----------|----------------------|
| 1 | May Support confirm payment or update order status? | **No** — view/list only |
| 2 | May OrderManager edit products? | **No** — listing/view only |
| 3 | Does Support see Dashboard? | **No** |
| 4 | May Admin create another Admin via +? | **Yes** (not SuperAdmin) |
| 5 | FE/BE constant files identical? | **Yes** — duplicate until a shared package exists |

---

## 9. Out of scope (this document only)

This doc defines the contract only. **Not done yet:**

- Creating `frontend/src/constants/permission.js` or `backend/constants/permission.js` (next step after approval)
- User model / middleware / frontend guards / `hasPermission` helpers
- Migration of existing `Admin` users (later: map current `Admin` → `ROLES.ADMIN` or `ROLES.SUPER_ADMIN`)
- Sealing currently unprotected catalog APIs

---

## 10. Current app baseline (reference)

| Item | Today |
|------|--------|
| Roles in DB | `User`, `Admin` only (`backend/model/users.js`) |
| Frontend gate | `user.role === 'Admin'` (`AdminProtected.jsx`) — raw string |
| Backend | `roleMiddleware('Admin')` / `adminMiddleware` — raw strings |
| Constants files | **None** — to be added per §3.4 |
| Fine-grained permissions | None |

**Next implementation order (after you approve this doc):**

1. Add identical `permission.js` constants on FE + BE (§3.4)  
2. Expand User `role` enum + `admin_permissions`  
3. `hasPermission` / `requirePermission` helpers using `SECTION_KEYS` + `ACTIONS`  
4. Sidebar + page gates + API middleware using those constants only

---

## 11. Sign-off

| | |
|--|--|
| Reviewed by | |
| Date | |
| Changes requested | |
| Approved for implementation | Yes / No |
