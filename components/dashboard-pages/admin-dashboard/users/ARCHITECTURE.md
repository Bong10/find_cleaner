# Component Architecture Diagram

## Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                      User Management Page                        │
│                         (index.jsx)                              │
│                        493 lines                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ State Management                                         │   │
│  │ - users, loading, searchTerm                            │   │
│  │ - Modal states (view, edit, role, delete)              │   │
│  │ - Tabs, stats calculation, filtering                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Event Handlers                                           │   │
│  │ - fetchAllUsers() → AdminService                        │   │
│  │ - handleViewUser()                                      │   │
│  │ - handleEditUser() + handleSaveEdit()                   │   │
│  │ - handleChangeRole()                                    │   │
│  │ - handleToggleStatus() → activate/deactivate API       │   │
│  │ - handleDeleteUser() + confirmDelete()                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ UI Sections                                              │   │
│  │ - Page Header                                           │   │
│  │ - Stats Cards (4 cards)                                 │   │
│  │ - Tabs + Search Bar                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Renders Components
                            ▼
        ┌───────────────────────────────────────────┐
        │                                           │
        │         UsersList Component               │
        │           (144 lines)                     │
        │                                           │
        │  Props:                                   │
        │  - users[]                                │
        │  - loading                                │
        │  - onView(user)                          │
        │  - onEdit(user)                          │
        │  - onChangeRole(user)                    │
        │  - onToggleStatus(user)                  │
        │  - onDelete(user)                        │
        │                                           │
        │  Features:                                │
        │  - 7-column responsive table              │
        │  - Loading spinner                        │
        │  - Empty state                            │
        │  - 5 action buttons per user             │
        │  - Name fallback chains                   │
        │  - Type/status badges                     │
        │                                           │
        └───────────────────────────────────────────┘

            │ User Clicks Action Button
            │
            ▼
┌───────────────────────────────────────────────────────────┐
│                     Modal Components                       │
└───────────────────────────────────────────────────────────┘
     │                │                │                │
     │                │                │                │
     ▼                ▼                ▼                ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  View   │    │  Edit   │    │  Role   │    │ Delete  │
│  Modal  │    │  Modal  │    │ Change  │    │ Confirm │
│         │    │         │    │  Modal  │    │  Modal  │
│ 140 ln  │    │ 248 ln  │    │ 119 ln  │    │  61 ln  │
│         │    │         │    │         │    │         │
│ Props:  │    │ Props:  │    │ Props:  │    │ Props:  │
│ - user  │    │ - user  │    │ - user  │    │ - user  │
│ -onClose│    │ -onClose│    │ -onClose│    │ -onClose│
│         │    │ - onSave│    │-onSuccess│   │-onConfirm│
│         │    │-submitting│  │         │    │-submitting│
│         │    │         │    │         │    │         │
│Features:│    │Features:│    │Features:│    │Features:│
│-Read    │    │-Edit    │    │-Fetch   │    │-Confirm │
│ only    │    │ form    │    │ roles   │    │ deletion│
│-Basic   │    │-State   │    │-Select  │    │-Warning │
│ info    │    │ mgmt    │    │ new role│    │ message │
│-Cond.   │    │-Cond.   │    │-API call│    │-Danger  │
│ sections│    │ fields  │    │-Success │    │ styling │
│         │    │         │    │ callback│    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │                │                │                │
     │                │                │                │
     └────────────────┴────────────────┴────────────────┘
                      │
                      │ Callback Functions
                      ▼
            ┌─────────────────────┐
            │   AdminService      │
            │   API Layer         │
            └─────────────────────┘
                      │
                      │ HTTP Requests
                      ▼
            ┌─────────────────────┐
            │   Backend APIs      │
            │   Django/DRF        │
            │   127.0.0.1:8000    │
            └─────────────────────┘
```

## Data Flow

### 1. Initial Load
```
User opens page
    ↓
index.jsx useEffect() triggers
    ↓
fetchAllUsers() called
    ↓
Promise.all([getAllCleaners(), getAllEmployers()])
    ↓
Flatten nested user objects
    ↓
Map with type, role, IDs
    ↓
setUsers(allUsers)
    ↓
UsersList renders with users prop
```

### 2. View User Flow
```
User clicks "View" button
    ↓
UsersList calls onView(user)
    ↓
handleViewUser(user) in index.jsx
    ↓
setViewModal({ show: true, user })
    ↓
UserDetailsModal renders
    ↓
Displays all user information
    ↓
User clicks close or overlay
    ↓
onClose() called
    ↓
setViewModal({ show: false, user: null })
```

### 3. Edit User Flow
```
User clicks "Edit" button
    ↓
UsersList calls onEdit(user)
    ↓
handleEditUser(user) in index.jsx
    ↓
setEditModal({ show: true, user })
    ↓
UserEditModal renders with user data
    ↓
User modifies form fields
    ↓
useState updates formData
    ↓
User clicks "Save"
    ↓
onSave(formData) called
    ↓
handleSaveEdit() in index.jsx
    ↓
setSubmitting(true)
    ↓
AdminService.updateUser(id, basicFields)
    ↓
AdminService.updateCleaner/Employer(id, specificFields)
    ↓
toast.success()
    ↓
setEditModal({ show: false })
    ↓
fetchAllUsers() refreshes list
    ↓
setSubmitting(false)
```

### 4. Role Change Flow
```
User clicks "Change Role" button
    ↓
UsersList calls onChangeRole(user)
    ↓
handleChangeRole(user) in index.jsx
    ↓
setRoleModal({ show: true, user })
    ↓
RoleChangeModal renders
    ↓
useEffect() triggers fetchRoles()
    ↓
AdminService.getAllRoles()
    ↓
Roles displayed as selection cards
    ↓
User selects new role
    ↓
setSelectedRole(roleId)
    ↓
User clicks "Change Role"
    ↓
handleRoleChange(roleId) internal
    ↓
AdminService.changeUserRole(userId, roleId)
    ↓
toast.success()
    ↓
onSuccess() callback in index.jsx
    ↓
fetchAllUsers() refreshes list
    ↓
onClose() called
```

### 5. Activate/Deactivate Flow
```
User clicks toggle status button
    ↓
UsersList calls onToggleStatus(user)
    ↓
handleToggleStatus(user) in index.jsx
    ↓
Check user.is_active
    ↓
if active:
    AdminService.deactivateUser(id)
else:
    AdminService.activateUser(id)
    ↓
toast.success()
    ↓
fetchAllUsers() refreshes list
```

### 6. Delete User Flow
```
User clicks "Delete" button
    ↓
UsersList calls onDelete(user)
    ↓
handleDeleteUser(user) in index.jsx
    ↓
setDeleteModal({ show: true, user })
    ↓
DeleteConfirmModal renders
    ↓
Shows user info + warning
    ↓
User clicks "Yes, Delete User"
    ↓
onConfirm() called
    ↓
confirmDelete() in index.jsx
    ↓
setSubmitting(true)
    ↓
AdminService.deleteUser(id)
    ↓
toast.success()
    ↓
setDeleteModal({ show: false })
    ↓
fetchAllUsers() refreshes list
    ↓
setSubmitting(false)
```

## Component Props Reference

### UsersList
```javascript
{
  users: Array<User>,
  loading: boolean,
  onView: (user: User) => void,
  onEdit: (user: User) => void,
  onChangeRole: (user: User) => void,
  onToggleStatus: (user: User) => void,
  onDelete: (user: User) => void
}
```

### UserDetailsModal
```javascript
{
  user: User,
  onClose: () => void
}
```

### UserEditModal
```javascript
{
  user: User,
  onClose: () => void,
  onSave: (formData: FormData) => void,
  submitting: boolean
}
```

### RoleChangeModal
```javascript
{
  user: User,
  onClose: () => void,
  onSuccess: () => void
}
```

### DeleteConfirmModal
```javascript
{
  user: User,
  onClose: () => void,
  onConfirm: () => void,
  submitting: boolean
}
```

## User Object Structure

After flattening in fetchAllUsers():

```javascript
{
  // From nested user object
  id: number,              // Primary user ID
  name: string,
  email: string,
  phone_number: string,
  address: string,
  is_active: boolean,
  date_joined: string,
  last_login: string,
  
  // Added by mapping
  type: 'cleaner' | 'employer',
  role: 'Cleaner' | 'Employer',
  cleaner_id: number,      // Only for cleaners
  employer_id: number,     // Only for employers
  
  // Cleaner-specific (if type === 'cleaner')
  hourly_rate: number,
  experience_years: number,
  bio: string,
  clean_level: string,
  availability: string,
  rating: number,
  jobs_completed: number,
  
  // Employer-specific (if type === 'employer')
  business_name: string,   // Primary
  company_name: string,    // Fallback
  business_type: string,
  verified: boolean,
  jobs_posted: number
}
```

## Benefits of This Architecture

✅ **Separation of Concerns**: Each component has a single responsibility
✅ **Reusability**: Components can be used in other parts of the app
✅ **Maintainability**: Small files are easier to understand and modify
✅ **Testability**: Each component can be tested in isolation
✅ **Type Safety**: Clear prop interfaces (can add TypeScript later)
✅ **Performance**: Can memoize components individually
✅ **Collaboration**: Multiple developers can work on different components
✅ **Debugging**: Easier to locate and fix issues in small files
