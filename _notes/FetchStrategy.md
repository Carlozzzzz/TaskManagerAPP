# 📡 Data Fetching Strategy: Handlers vs. Effects

## 🎯 The Core Philosophy
In a Senior-level architecture, we distinguish between **Initialization** (what the page needs to exist) and **Intent** (what the user wants to do).

---

## 🏗️ 1. Initialization (Use `useEffect`)
**Definition:** Data required for the primary UI to be functional.
**Scenarios:**
- The main data for a table (e.g., the User list).
- Global settings (e.g., Theme, User Profile).

### 🏛️ Senior Why:
If the user cannot use the page without this data, it must load as soon as the component "mounts." 

---

## ⚡ 2. Intent-Based Fetching (Use Handlers)
**Definition:** Data required only for a specific user action.
**Scenarios:**
- **Opening a Modal:** Fetching the specific permissions for a Role.
- **Dropdowns:** Fetching a list of "Departments" only when the user clicks the "Department" selector.
- **Expandable Rows:** Fetching "Task History" only when a row is expanded.

### 🏛️ Senior Why:
1. **Server Optimization:** Avoids "N+1" problems. If you have 100 rows, you don't fetch 100 sets of details on page load. You only fetch the 1 or 2 the user actually clicks.
2. **Data Freshness:** Data fetched in a handler is "Real-Time." Data fetched in a `useEffect` on page load might be "stale" (hours old) by the time the user clicks a button.
3. **Reduced Memory:** Your React state stays "Thin." You don't store 500 permission objects in memory if the user is only looking at a list of names.
4. **Orchestration:** Using an `async` handler allows you to use `Promise.all()` to coordinate multiple dependencies (e.g., Fetching Roles AND Modules) before the UI presents the result.

---

## 🛠️ Implementation Comparison

### ❌ The Junior Way (Effect-Heavy)
*Problem: Fetches everything on load, even if the user never clicks "Edit".*
```javascript
useEffect(() => {
    fetchUsers();
    fetchRoles();    // ⚠️ Wasteful if user never clicks "Manage Roles"
    fetchModules();  // ⚠️ Wasteful if user never clicks "Manage Roles"
}, []);
```

### ✅ The Senior Way (Intent-Based)
*Solution: Only the primary list loads automatically. Details load on demand.*
```javascript
// Initial Load
useEffect(() => {
    fetchUsers(); 
}, []);

// Action-Based Load (The Handler)
const handleOpenRoleManagement = async () => {
    setIsModalOpen(true); // Open UI immediately
    
    // Fetch dependencies in parallel when intent is confirmed
    await Promise.all([
        fetchRoles(),
        fetchModules()
    ]);
};
```

---

## 📈 Decision Matrix

| Question | Use `useEffect` | Use **Handler** |
| :--- | :---: | :---: |
| Is the data visible immediately? | ✅ | ❌ |
| Is the data inside a Modal/Popup? | ❌ | ✅ |
| Does the data change frequently? | ❌ | ✅ |
| Is it a high-volume list (>50 items)?| ❌ | ✅ |

---

## 💡 Pro-Tip: The "Pre-Fetch" (Ultra Senior)
If your API is slow, you can use **Hover Intent**.
- Start the fetch on `onMouseEnter` of the button.
- By the time the user finishes the 200ms "click" action, the data is already half-loaded.
- This creates the illusion of a **0ms loading time**.

---

## ⚠️ Checklist
1. **Cleanup:** If the user closes a modal before the handler finishes, does your code handle the "ghost" data correctly?
2. **Spinners:** Does your modal show a localized spinner while the handler is working?
3. **Errors:** If the handler fails, does it show a Toast and stop the action?
```