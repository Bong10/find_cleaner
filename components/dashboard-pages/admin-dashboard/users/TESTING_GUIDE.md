# Testing Guide - User Management Refactoring

## Quick Start

1. **Start the backend server**:
   ```bash
   cd Backend
   python manage.py runserver
   ```
   Backend should be running at http://127.0.0.1:8000

2. **Start the frontend**:
   ```bash
   npm run dev
   ```
   Frontend should be at http://localhost:3000

3. **Login as admin** and navigate to User Management

## Test Scenarios

### ✅ Scenario 1: View All Users
**Expected Behavior:**
- Page loads without errors
- Users display in table format
- Names show correctly (not "N/A")
- Employer names show (business_name or company_name)
- Stats cards show correct counts
- All tabs work (All, Cleaners, Employers, Active, Inactive)

**Test Steps:**
1. Open User Management page
2. Check if users load
3. Verify names display correctly
4. Check stats match the counts in table
5. Click each tab and verify filtering works

**Common Issues:**
- If names show "N/A": Check backend response structure
- If page crashes: Check browser console for errors
- If no data loads: Verify backend is running and accessible

---

### ✅ Scenario 2: Search Users
**Expected Behavior:**
- Search works across name, email, phone, business_name
- Results update as you type
- Empty state shows when no matches

**Test Steps:**
1. Type in search box
2. Verify results filter correctly
3. Try searching by:
   - Name
   - Email
   - Phone number
   - Business name
4. Clear search and verify all users return

---

### ✅ Scenario 3: View User Details
**Expected Behavior:**
- Modal opens with user information
- All fields display correctly
- Conditional sections show based on user type (Cleaner vs Employer)
- Can close modal by clicking X or clicking outside

**Test Steps:**
1. Click "View" button (eye icon) on any user
2. Verify modal opens
3. Check all fields display:
   - Basic info (name, email, phone, etc.)
   - Type-specific info (cleaner or employer fields)
4. Click X button to close
5. Click outside modal to close

**API Endpoint Called:**
- None (uses existing data from list)

---

### ✅ Scenario 4: Edit User
**Expected Behavior:**
- Modal opens with pre-filled form
- Can modify basic fields (name, email, phone, address)
- Can modify type-specific fields (cleaner or employer)
- Save button updates user
- Success toast appears
- List refreshes with new data

**Test Steps:**
1. Click "Edit" button (pencil icon)
2. Verify form loads with existing data
3. Modify some fields:
   - Change name
   - Change email
   - Change phone
   - Toggle is_active checkbox
   - For cleaners: change hourly_rate, clean_level
   - For employers: change business_name, business_type
4. Click "Save"
5. Verify success toast
6. Check user list updates with new values

**API Endpoints Called:**
- `PATCH /api/users/{id}/` - Updates basic fields
- `PATCH /api/admin/cleaners/{cleaner_id}/` - Updates cleaner fields
- `PATCH /api/admin/employers/{employer_id}/` - Updates employer fields

**Common Issues:**
- 404 error: Check if user ID is correct
- 403 error: Verify admin permissions
- Validation errors: Check required fields

---

### ✅ Scenario 5: Activate/Deactivate User
**Expected Behavior:**
- Clicking toggle updates status immediately
- Badge changes color (green for active, red for inactive)
- Success toast appears
- User status persists on page refresh

**Test Steps:**
1. Find an active user
2. Click the ban/check icon button
3. Verify:
   - Success toast appears
   - Badge updates (Active → Inactive)
   - Status persists on refresh
4. Click again to reactivate
5. Verify status changes back

**API Endpoint Called:**
- `PATCH /api/users/{id}/` with `{is_active: true}` or `{is_active: false}`

**Common Issues:**
- Changes don't persist: Check backend saves is_active field
- Toast doesn't show: Check console for errors

---

### ✅ Scenario 6: Change User Role
**Expected Behavior:**
- Modal opens showing current role
- Available roles load from API
- Can select new role
- Warning message displays
- Save applies role change
- User list refreshes

**Test Steps:**
1. Click "Change Role" button (tag icon)
2. Verify modal opens with:
   - Current user email
   - Current role displayed
   - Available roles as cards
3. Click on a role card to select it
4. Verify warning message shows
5. Click "Change Role" button
6. Verify:
   - Success toast appears
   - Modal closes
   - User role updates in list

**API Endpoints Called:**
- `GET /api/roles/` - Fetches available roles
- `PATCH /api/users/{id}/` with `{role: roleId}` - Updates user role

**Common Issues:**
- Roles don't load: Check `/api/roles/` endpoint exists
- Role doesn't update: Verify role_id is correct in request
- 404 error: Check backend role management is set up

**Note:** This feature requires the roles table in backend. If not set up, you may need to create roles first.

---

### ✅ Scenario 7: Delete User
**Expected Behavior:**
- Confirmation modal shows
- User details display
- Warning about permanent deletion
- Can cancel or confirm
- Delete removes user from list

**Test Steps:**
1. Click "Delete" button (trash icon)
2. Verify confirmation modal shows:
   - User email
   - User name
   - User type badge
   - Warning message
3. Click "Cancel" - modal closes, nothing happens
4. Click "Delete" again
5. Click "Yes, Delete User"
6. Verify:
   - Success toast appears
   - Modal closes
   - User removed from list
   - User doesn't reappear on refresh

**API Endpoint Called:**
- `DELETE /api/users/{id}/`

**Common Issues:**
- User still appears: Check backend actually deletes
- Related data errors: Backend may need cascade delete
- 404 error: User may have been deleted already

---

## Error Testing

### Test API Failures
1. **Stop backend server**
2. Try to perform actions
3. Verify error toasts show
4. Check console for proper error handling

### Test Permission Issues
1. Login as non-admin user
2. Try to access User Management
3. Verify proper error handling or redirect

### Test Edge Cases
1. **Empty user list**: Verify empty state shows
2. **Very long names**: Check UI doesn't break
3. **Missing fields**: Verify "N/A" displays
4. **Special characters in search**: Verify no errors

---

## Browser Console Checks

Open Developer Tools (F12) and check:

### Should NOT see:
- ❌ Any React errors (red text)
- ❌ 404 errors for API calls
- ❌ Undefined variable errors
- ❌ Import errors

### Should see:
- ✅ Successful API calls (200 status)
- ✅ Console.log from your code (if any)
- ✅ Toast notifications appearing

---

## Performance Checks

1. **Initial load**: Should be under 2 seconds
2. **Search**: Should be instant (no API call needed)
3. **Tab switching**: Should be instant (client-side filtering)
4. **Modal open**: Should be instant
5. **API operations**: Should complete within 1-2 seconds

---

## Mobile Testing

Test on mobile viewport (resize browser or use device):

1. **Responsive layout**: Table should adapt
2. **Buttons**: Should be tappable
3. **Modals**: Should display correctly
4. **Search**: Should work on mobile keyboard

---

## Data Integrity Checks

After testing all operations:

1. **Refresh page**: All changes should persist
2. **Check backend**: Verify data in Django admin
3. **Check related records**: Ensure no orphaned data

---

## Rollback Plan

If something breaks:

1. **Stop the app**
2. **Restore old file**:
   ```bash
   cd components/dashboard-pages/admin-dashboard/users
   Remove-Item index.jsx
   Move-Item index-old.jsx index.jsx
   ```
3. **Restart app**
4. **Report issues** with:
   - Console errors
   - API responses
   - Steps to reproduce

---

## Known Limitations

1. **Roles Management**: The "Manage Roles" button doesn't go anywhere yet (needs separate page)
2. **Bulk Operations**: Not implemented (single user operations only)
3. **Advanced Filters**: Date range, verification status not available
4. **Export**: No CSV/Excel export yet
5. **User Type Conversion**: Can change role but not convert cleaner ↔ employer

---

## Success Criteria

✅ All users load with correct names
✅ Search and filters work
✅ View modal shows all information
✅ Edit saves changes successfully
✅ Activate/deactivate toggles status
✅ Role change updates user role
✅ Delete removes user permanently
✅ No console errors
✅ All toasts appear correctly
✅ Page is responsive on mobile
✅ Changes persist on refresh

If all above pass, the refactoring is successful! 🎉
