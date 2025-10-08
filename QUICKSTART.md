# Quick Start Guide - emtime Dashboard

## 🎯 What You Need

1. **Google Account** with Calendar access
2. **Google Cloud Project** (free)
3. **Node.js 18+** and **pnpm**

## 🚀 5-Minute Setup

### Step 1: Google Cloud Setup (3 minutes)

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable **Google Calendar API**:
   - APIs & Services → Library → Search "Calendar" → Enable
4. Create **OAuth Client ID**:
   - APIs & Services → Credentials → Create Credentials
   - Application type: Web application
   - Authorized origins: `http://localhost:5173`
   - **Copy the Client ID** 📋 (This is all you need!)

### Step 2: Project Setup (2 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp .env.example .env

# 3. Edit .env and paste your Client ID
# VITE_GOOGLE_CLIENT_ID=paste_your_client_id_here
```

### Step 3: Setup Your Calendars

Create or rename calendars in Google Calendar:
- Calendar named "**Work**"
- Calendar named "**Class**" or "**Study**"
- Calendar named "**Study**" (if not using Class)

Add some events to test!

### Step 4: Run the App

```bash
pnpm dev
```

Visit: **http://localhost:5173**

## 📊 What to Expect

### Home Page
- Beautiful landing page
- "Sign in with Google" button
- You'll be asked to grant calendar read permissions

### Dashboard
- **Date Range**: Auto-detects current semester
- **Filter Holidays**: Toggle to exclude weekends/family days
- **Three Tabs**:
  - **Insights**: Charts and statistics
  - **Goals**: Track coding (2h), study (2h), sport (30min) daily
  - **Log**: Expandable tree of all events

## 🎨 Event Categorization

The app automatically categorizes events by keywords in their names:

### Work Events
Keywords: SITCON, SDC, COSCUP, emtech, Coding, justfont, Debate, Core System

### Study Events
Keywords: Calculus, Linear Algebra, Project Management, 高齡設計

### Life Events
Keywords: GYM

## 🛠️ Customization Tips

### Add Your Own Keywords

Edit `src/utils/dataAnalysis.ts`:

```typescript
export const categoryMapping: CategoryMapping = {
  Work: ['sitcon', 'meeting', 'project'],  // Add your keywords
  Study: ['calculus', 'homework', 'lab'],
  Life: ['gym', 'yoga', 'meditation'],
};
```

### Change Daily Goals

Edit the `analyzeGoals` function in `src/utils/dataAnalysis.ts`:

```typescript
codingGoal: 2,    // Change to your target hours
studyGoal: 2,
sportGoal: 0.5,   // 30 minutes = 0.5 hours
```

## ❓ Troubleshooting

### "No events found"
- ✅ Check calendar names contain "Work", "Class", or "Study"
- ✅ Verify date range includes your events
- ✅ Make sure you have events in those calendars

### Authentication errors
- ✅ Verify Client ID is correct in `.env`
- ✅ Check authorized origins in Google Cloud Console
- ✅ Try incognito mode

### API Errors
- ✅ Confirm Calendar API is enabled in Google Cloud
- ✅ Check that you've granted calendar permissions when logging in
- ✅ Try logging out and back in

## 📱 Usage Tips

1. **Best Practice**: Create separate calendars for different life areas
2. **Event Naming**: Include category keywords in event names
3. **Family Days**: Mark full-day family events to filter them out
4. **Regular Updates**: Refresh dashboard after adding events

## 🎓 Example Calendar Setup

```
Work Calendar:
- "SITCON Planning Meeting" → Categorized as Work > SITCON
- "Coding Session" → Work > Coding
- "Debate Practice" → Work > Debate

Study Calendar:
- "Calculus Homework" → Study > Calculus
- "Linear Algebra Class" → Study > Linear Algebra
- "Project Management Reading" → Study > Project Management

Class Calendar:
- (Same as Study, automatically categorized as Study)

Life Calendar:
- "GYM Workout" → Life > GYM
- "Family Dinner" → (Can be filtered out)
```

## 🚢 Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📚 More Information

- Full documentation: See `README.md`
- Google Calendar API: [Documentation](https://developers.google.com/calendar)
- Material-UI: [Component Library](https://mui.com/)

## 🎉 You're All Set!

Enjoy analyzing your daily life with emtime! 📊✨
