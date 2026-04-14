# Complete Data Access Flow - Workout Planner

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Entry (Frontend)                    │
│  - Input field with name                                    │
│  - User search suggestions                                  │
│  - Error handling & feedback                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─→ Typing in input
                       │   └─→ Calls /api/users/search?q=name
                       │       (Real-time typeahead)
                       │
                       └─→ Form submission
                           └─→ Calls /api/users/create (POST)
                               └─→ API Logic:
                                   1. Try Supabase insert
                                   2. If timeout/error → create locally
                                   3. Return {user: {id, name}}
                                   └─→ Frontend receives user object
                                       └─→ useUser hook stores user
                                           └─→ UserContext persists to localStorage
                                               └─→ Router redirects to /dashboard
```

## Component Hierarchy & Data Flow

### 1. **Home Page** (`/app/page.tsx`)
- Client-side component
- Renders `<UserEntry />` component
- Handles user name input

### 2. **User Entry Component** (`/components/user-entry.tsx`)
- Manages local state: `inputValue`, `suggestions`, `isLoading`, `error`
- Debounced search: calls `/api/users/search` after 300ms delay
- Form submission: calls `/api/users/create` (POST)
- On success:
  - Calls `setCurrentUser(user)` from UserContext
  - Navigates to `/dashboard`

### 3. **User Context** (`/lib/user-context.tsx`)
**Manages:**
- `currentUser`: {id, name} | null
- Persists to localStorage automatically
- Restores from localStorage on app load
**Provides:** `useUser()` hook for consuming components

**Flow:**
```
Frontend setCurrentUser(user)
    ↓
UserContext updates state
    ↓
useEffect triggers
    ↓
Saves to localStorage: 'currentUser'
    ↓
Any component using useUser() can access
```

### 4. **Dashboard Page** (`/app/dashboard/page.tsx`)
**Checks:**
- Is `currentUser` loaded?
  - NO → Show loading spinner
  - YES → Render dashboard

**On Mount:**
1. Checks `currentUser` from context (restored from localStorage)
2. Loads `userProfile` from localStorage
3. Displays user name and workout data

## API Endpoints

### POST `/api/users/create`
**Purpose:** Create or retrieve existing user

**Request:**
```json
{ "name": "John Doe" }
```

**Response (Success):**
```json
{ "user": { "id": "uuid-xxx", "name": "John Doe" } }
```

**Response (Error):**
```json
{ "error": "Name is required" }
```

**Fallback Behavior:**
- If Supabase unavailable → creates user locally with generated UUID
- All responses include valid user object
- No error stops the flow

### GET `/api/users/search?q=query`
**Purpose:** Search for existing users (typeahead)

**Response:**
```json
{ "users": [{ "id": "uuid-xxx", "name": "John Doe" }, ...] }
```

**Fallback Behavior:**
- If Supabase unavailable → returns empty array `[]`
- Doesn't prevent form submission
- User can still enter name and submit

## State Management Timeline

### Scenario 1: New User

```
TIME    EVENT                           FRONTEND                CONTEXT         STORAGE
────────────────────────────────────────────────────────────────────────────────────
0ms     App loads                       Home page renders       currentUser=null localStorage empty
        
100ms   User types "John"               Suggestions call        (no change)     (no change)
        
500ms   API returns []                  No suggestions          (no change)     (no change)
        
800ms   User clicks submit              Loading state           (no change)     (no change)
        
1200ms  API creates user locally        Returns {id, name}      (no change)     (no change)
        
1250ms  Frontend: setCurrentUser()      Dashboard load...       User set!       Saves user
        
1300ms  Router.push('/dashboard')       (Navigating)            User ready      User saved
        
1400ms  Dashboard renders               Shows "Welcome John"    ✓ Authenticated ✓ Persisted
```

### Scenario 2: Returning User (Page Reload)

```
TIME    EVENT                           FRONTEND                CONTEXT         STORAGE
────────────────────────────────────────────────────────────────────────────────────
0ms     App loads                       (blank)                 Hydrating...    currentUser exists
        
50ms    UserProvider useEffect          (loading)               Restoring...    Read from localStorage
        
100ms   User restored from storage      (still loading)         User set!       (no change)
        
120ms   Hydration complete              (page ready)            ✓ Ready         (no change)
        
200ms   Router checks auth              Dashboard recognized    ✓ Authenticated (no change)
        
300ms   Dashboard renders               Shows "Welcome John"    ✓ Ready         ✓ Persisted
```

### Scenario 3: User Logout

```
TIME    EVENT                           FRONTEND                CONTEXT         STORAGE
────────────────────────────────────────────────────────────────────────────────────
0ms     User clicks logout              Dashboard page          currentUser set localStorage saved
        
50ms    handleLogout() called           (no visual change)      Clearing...     (no change)
        
100ms   setCurrentUser(null)            (navigation starts)     User cleared    Removed from storage
        
150ms   Router.push('/')                (navigating)            null            Empty
        
200ms   Home page renders               User entry visible      ✓ Clear         ✓ Clear
```

## Error Handling & Recovery

### Database Connection Failure
```
API Request → Supabase timeout (5000ms)
    ↓
Catch error → Log warning
    ↓
Generate local UUID
    ↓
Return valid user object
    ↓
Frontend proceeds normally
    ↓
User created in localStorage (temporary)
    ↓
(Can sync to Supabase when connection restored)
```

### User Entry Form Error
```
User submits → API call fails → Error state set
    ↓
Error message displayed to user
    ↓
User can retry or modify input
    ↓
Error cleared on input change
    ↓
User can resubmit
```

## Security & Permissions

### Current Implementation (Offline Mode)
- No authentication required
- All data stored locally in browser
- No Supabase RLS policies enforced
- Safe for local/offline use

### When Supabase Connected (Future)
- Should implement:
  - User authentication via Supabase Auth
  - Row-Level Security (RLS) policies
  - Service role key for backend operations
  - Session management

### Best Practices Applied
- ✓ Timeouts prevent hanging requests
- ✓ Error handling prevents silent failures
- ✓ User context abstraction (not direct localStorage access)
- ✓ Graceful degradation (works offline)
- ✓ Console logging for debugging
- ✓ No sensitive data exposed to client

## Debugging Checklist

Use browser DevTools Console to verify:

```javascript
// Check if user is in context
localStorage.getItem('currentUser')
// Should return: {"id":"uuid","name":"John Doe"}

// Check API response
// Open Network tab, find /api/users/create request
// Should return: {"user":{"id":"uuid","name":"John Doe"}}

// Check console logs
// Look for [v0] prefixed messages
// Should show user creation/restoration flow
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| User input doesn't submit | API returns 500 | Check network, API fallback should work |
| Dashboard shows blank | No currentUser in context | Refresh page, check localStorage |
| Suggestions don't appear | Supabase unavailable | Expected, form still works |
| User disappears after reload | localStorage cleared | Check browser settings |
| Slow typing response | Database query timeout | Expected, fallback to offline mode |

## Testing the Complete Flow

### Test 1: Basic Access
1. Go to home page
2. Type a name
3. Click submit
4. Verify dashboard shows your name
5. Refresh page
6. Verify you're still logged in

### Test 2: Error Recovery
1. Create a user
2. Open DevTools (F12)
3. Go to Application → Storage → Clear All
4. Refresh page
5. Should redirect to home (no user)
6. Create user again

### Test 3: Offline Mode
1. Go home, create user
2. Open DevTools → Network → Offline
3. Refresh page
4. Should still load from localStorage
5. User persists even in offline

### Test 4: Browser Close
1. Create user
2. Close browser completely
3. Reopen
4. Go to app URL
5. Should auto-restore user from localStorage
