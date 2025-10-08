# Troubleshooting Guide

## Common Issues and Solutions

### ❌ "API key not valid" Error

**Problem**: Getting "API key not valid. Please pass a valid API key" when clicking "Refresh Data"

**Solution**: This has been fixed! The app now uses OAuth authentication only and doesn't require an API key.

**Steps to fix**:

1. Make sure you're using the latest code
2. Your `.env` file should only contain:
    ```
    VITE_GOOGLE_CLIENT_ID=your_client_id_here
    ```
3. Remove any `VITE_GOOGLE_API_KEY` line if present
4. Restart the dev server: `pnpm dev`
5. Log out and log back in

---

### ❌ "No events found"

**Problem**: Dashboard shows "No events found" even though you have calendar events

**Possible causes and solutions**:

1. **Calendar names don't match**
    - ✅ Ensure you have calendars containing "Work", "Class", or "Study" in their names
    - The search is case-insensitive, so "work", "Work", "WORK" all work

2. **Date range doesn't include events**
    - ✅ Check the date range picker
    - Try expanding the date range
    - The app auto-detects semester, but your events might be outside this range

3. **Calendar permissions not granted**
    - ✅ When you logged in, you need to grant calendar read permissions
    - Try logging out and logging in again
    - Check the browser console for permission errors

---

### ❌ Login/Authentication Issues

**Problem**: Can't log in or authentication fails

**Solutions**:

1. **Check your Client ID**

    ```bash
    # Make sure .env has the correct Client ID
    cat .env
    ```

2. **Verify Google Cloud Console settings**
    - Go to [Google Cloud Console](https://console.cloud.google.com/)
    - APIs & Services → Credentials
    - Check your OAuth 2.0 Client ID
    - Authorized JavaScript origins should include: `http://localhost:5173`
    - Authorized redirect URIs should include: `http://localhost:5173`

3. **Clear browser cache**
    - Open DevTools (F12)
    - Application → Storage → Clear site data
    - Try logging in again

4. **Try incognito mode**
    - This helps rule out cookie/cache issues

---

### ❌ "Failed to load calendar data"

**Problem**: Error message when trying to fetch calendar data

**Solutions**:

1. **Check Google Calendar API is enabled**
    - Go to [Google Cloud Console](https://console.cloud.google.com/)
    - APIs & Services → Library
    - Search for "Google Calendar API"
    - Make sure it's enabled (should show a green checkmark)

2. **Verify OAuth consent screen**
    - APIs & Services → OAuth consent screen
    - Make sure calendar scope is included
    - If in testing mode, add your email to test users

3. **Check browser console for errors**
    - Press F12 to open DevTools
    - Go to Console tab
    - Look for specific error messages
    - Share these if you need help

---

### ❌ Events not categorizing correctly

**Problem**: Events are going into wrong categories or showing as "Other"

**Solutions**:

1. **Check event names**
    - Events are categorized by keywords in their names
    - Make sure event names include keywords like:
        - Work: SITCON, Coding, Meeting, etc.
        - Study: Calculus, Homework, Linear Algebra, etc.
        - Life: GYM, Exercise, etc.

2. **Add custom keywords**
    - Edit `src/utils/dataAnalysis.ts`
    - Add your keywords to the `categoryMapping` object

    ```typescript
    export const categoryMapping: CategoryMapping = {
    	Work: ["sitcon", "meeting", "project"], // Add yours
    	Study: ["calculus", "homework"],
    	Life: ["gym", "yoga"]
    };
    ```

3. **Use calendar types**
    - Events from "Class" or "Study" calendars default to Study category
    - Events from "Work" calendar default to Work category

---

### ❌ Charts not showing / Loading forever

**Problem**: Dashboard loads but charts don't appear or keep loading

**Solutions**:

1. **Check if events loaded**
    - Open browser DevTools (F12)
    - Console tab
    - Look for "No events found" or API errors

2. **Date range issues**
    - Make sure you have events in the selected date range
    - Try manually selecting a wider date range

3. **Browser compatibility**
    - Use a modern browser (Chrome, Firefox, Edge, Safari)
    - Make sure JavaScript is enabled

---

### 🛠️ Development Issues

**Problem**: Build or dev server errors

**Solutions**:

1. **Clean install**

    ```bash
    rm -rf node_modules pnpm-lock.yaml
    pnpm install
    ```

2. **Check Node version**

    ```bash
    node --version  # Should be 18+
    ```

3. **Port already in use**
    ```bash
    # If port 5173 is already in use
    pnpm dev --port 5174
    ```

---

## Getting More Help

If none of these solutions work:

1. **Check browser console** (F12 → Console tab)
    - Copy any error messages

2. **Check network tab** (F12 → Network tab)
    - Look for failed requests to Google APIs
    - Check response details

3. **Verify environment variables**

    ```bash
    cat .env
    # Should show: VITE_GOOGLE_CLIENT_ID=...
    ```

4. **Test with a simple calendar**
    - Create a new calendar called "Work"
    - Add one simple event
    - See if it appears in the dashboard

5. **GitHub Issues**
    - Open an issue with:
        - Browser console errors
        - Steps to reproduce
        - Your setup (OS, browser, Node version)

---

## Quick Checklist ✅

Before asking for help, make sure:

- [ ] Google Calendar API is enabled in Cloud Console
- [ ] OAuth Client ID is created and configured correctly
- [ ] `.env` file exists with correct `VITE_GOOGLE_CLIENT_ID`
- [ ] You have calendars with "Work", "Class", or "Study" in their names
- [ ] Those calendars have events in the selected date range
- [ ] You granted calendar permissions when logging in
- [ ] Browser console shows no obvious errors
- [ ] Dev server is running without errors

---

## Still Need Help?

Open an issue on GitHub with:

- Operating system
- Browser and version
- Node.js version
- Error messages from console
- Screenshots if helpful
