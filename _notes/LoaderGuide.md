# ⏳ UI Loading Strategy Guide (Senior Dev Edition)

## 🎯 Overview
Loading states are not just about showing a spinner; they are about **Perceived Performance** and **Data Integrity**. We use different strategies depending on whether the user is *reading* data or *writing* data.

---

## 🚦 1. The Blocking Context Loader (The "Wait for Me")
**Method:** Using your `useLoading` context hook.
**Behavior:** A full-screen backdrop that prevents any user interaction.

### ✅ When to use:
- **Destructive Actions:** Deleting a record (prevents double-clicks).
- **Major State Changes:** Syncing configurations, updating permissions, or resetting passwords.
- **Form Submissions:** When a "Save" or "Update" is in progress (prevents navigating away or changing data while it's saving).

### 🛠️ Code Pattern:
```javascript
const { saveRole, loading } = useRoles();
const { showLoading, hideLoading } = useLoading();

const handleSubmit = async (data) => {
    showLoading(); // Block the UI
    try {
        await saveRole(data);
    } finally {
        hideLoading(); // Release the UI
    }
};
```

---

## 💀 2. Skeleton & Inline Loading (The "Perceived Speed")
**Method:** Ghost rows or localized spinners.
**Behavior:** The UI layout is visible immediately, but data cells show "shimmering" placeholders.

### ✅ When to use:
- **Initial List Fetch:** When entering a page (Users, Companies, Tasks).
- **Opening a Modal:** While fetching the specific details (e.g., Role Permissions).
- **Dashboard Widgets:** Individual cards loading their own stats.

### 🏛️ Senior Why:
Skeletons prevent **Layout Shift** (where the UI "jumps" when data arrives). It tells the user exactly where the content will appear, making the app feel faster.

---

## ⚡ 3. Optimistic UI (The "Instant Feedback")
**Method:** Update the local state *before* the API call finishes.
**Behavior:** The user clicks a toggle, the UI changes instantly, and the API call happens in the background.

### ✅ When to use:
- **Status Toggles:** Switching a user from "Active" to "Inactive."
- **Sorting/Reordering:** Moving a task from "To Do" to "Done."

### 🛠️ Logic Pattern:
1. User clicks.
2. **Instantly** update local React state.
3. Call API.
4. **If API fails:** Revert the state and show a Toast error.

---

## 📋 Strategy Checklist (Decision Tree)

Use this checklist whenever you build a new feature:

| If the action is... | Use this strategy: | Why? |
| :--- | :--- | :--- |
| **Loading a list/table** | 💀 Skeletons / Inline | Keeps the user moving; feels faster. |
| **Saving a new record** | 🛑 Blocking Context | Prevents duplicate data and data corruption. |
| **Toggling a checkbox** | ⚡ Optimistic UI | Feels "Snappy" and modern. |
| **Syncing DB Config** | 🛑 Blocking Context | High-risk; system must stay stable during sync. |
| **Fetching Modal Details**| ⏳ Inline Spinner (Inside Modal) | Responsive; allows user to close modal if they change their mind. |

---

## ⚠️ Senior Developer Warnings

1. **The "Flash of Loading":** Don't show a loader for API calls that take less than 200ms. It creates a "flicker" that annoys users. (Your `useLoading` can be enhanced with a 200ms delay before showing the spinner).
2. **Cleanup:** Always use `finally { hideLoading(); }`. If your API crashes and you don't call `hideLoading`, the user is permanently locked out of the app.
3. **Context Renaming:** Always alias your loading states in pages with multiple hooks: 
   `const { loading: rolesLoading } = useRoles();`
```