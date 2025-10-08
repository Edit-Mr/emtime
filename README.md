# emtime - Daily Life Analysis Dashboard# React + TypeScript + Vite

A React + Material-UI dashboard application to analyze your daily life using Google Calendar data.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## FeaturesCurrently, two official plugins are available:

- 🔐 Google OAuth authentication- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- 📅 Automatic date range detection (Fall/Spring/Summer semesters)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 📊 Beautiful visualizations with charts and graphs

- 🎯 Goal tracking (Coding, Study, Sport)## React Compiler

- 📈 Category-based time analysis (Work, Study, Life)

- 🗂️ Hierarchical event log with expandable tree viewThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- 🔍 Holiday filtering (weekends and family days)

## Expanding the ESLint configuration

## Setup Instructions

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

### 1. Prerequisites

````js

- Node.js 18+ and pnpm installedexport default defineConfig([

- A Google Cloud Project with Calendar API enabled  globalIgnores(['dist']),

  {

### 2. Google Cloud Setup    files: ['**/*.{ts,tsx}'],

    extends: [

1. Go to [Google Cloud Console](https://console.cloud.google.com/)      // Other configs...

2. Create a new project or select an existing one

3. Enable the **Google Calendar API**:      // Remove tseslint.configs.recommended and replace with this

   - Go to "APIs & Services" > "Library"      tseslint.configs.recommendedTypeChecked,

   - Search for "Google Calendar API"      // Alternatively, use this for stricter rules

   - Click "Enable"      tseslint.configs.strictTypeChecked,

4. Create OAuth 2.0 credentials:      // Optionally, add this for stylistic rules

   - Go to "APIs & Services" > "Credentials"      tseslint.configs.stylisticTypeChecked,

   - Click "Create Credentials" > "OAuth client ID"

   - Choose "Web application"      // Other configs...

   - Add authorized JavaScript origins: `http://localhost:5173`    ],

   - Add authorized redirect URIs: `http://localhost:5173`    languageOptions: {

   - Copy the **Client ID**      parserOptions: {

5. Create an API Key:        project: ['./tsconfig.node.json', './tsconfig.app.json'],

   - Click "Create Credentials" > "API key"        tsconfigRootDir: import.meta.dirname,

   - Copy the **API Key**      },

   - (Optional) Restrict the key to Google Calendar API only      // other options...

    },

### 3. Configure Calendar Names  },

])

Make sure you have three calendars in your Google Calendar account with these names:```

- **Work** - For work-related events

- **Class** - For class schedulesYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

- **Study** - For study sessions

```js

The app will automatically fetch events from calendars containing these keywords (case-insensitive).// eslint.config.js

import reactX from 'eslint-plugin-react-x'

### 4. Install Dependenciesimport reactDom from 'eslint-plugin-react-dom'



```bashexport default defineConfig([

pnpm install  globalIgnores(['dist']),

```  {

    files: ['**/*.{ts,tsx}'],

### 5. Configure Environment Variables    extends: [

      // Other configs...

Create a `.env` file in the root directory:      // Enable lint rules for React

      reactX.configs['recommended-typescript'],

```bash      // Enable lint rules for React DOM

cp .env.example .env      reactDom.configs.recommended,

```    ],

    languageOptions: {

Edit `.env` and add your credentials:      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```        tsconfigRootDir: import.meta.dirname,

VITE_GOOGLE_CLIENT_ID=your_google_client_id_here      },

VITE_GOOGLE_API_KEY=your_google_api_key_here      // other options...

```    },

  },

### 6. Run the Development Server])

````

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Usage

### 1. Login

- Click "Sign in with Google" on the home page
- Grant calendar read permissions

### 2. Dashboard

#### Date Range Selector

- The app automatically detects the current semester:
    - **Fall**: September - January
    - **Spring**: February - June
    - **Summer**: July - August
- You can manually change the date range using the date pickers

#### Filter Holidays

- Toggle "Filter Holidays" to exclude:
    - Saturdays and Sundays
    - Full-day events tagged with "Family"

### 3. Insights Section

Shows comprehensive analysis of your time:

- **Summary Cards**: Total hours in each category (Work, Study, Life)
- **Pie Chart**: Visual distribution of time across categories
- **Ranking List**: Categories sorted by time spent
- **Daily Distribution Chart**: Stacked area chart showing daily breakdown
- **Subcategory Breakdowns**: Top 10 activities in each category

#### Event Categorization

Events are automatically categorized based on keywords in their names:

**Work** subcategories:

- SITCON, SDC, COSCUP, emtech, Coding, justfont, justwriteNOW, Debate, Core System

**Study** subcategories:

- Calculus, Linear Algebra, Project Management, 高齡設計

**Life** subcategories:

- GYM

### 4. Goals Section

Track your daily goals:

- **Coding**: 2 hours/day target
- **Study**: 2 hours/day target
- **Sport**: 30 minutes/day target

Each goal shows:

- Progress bar with percentage
- Days goal was met
- Total actual vs total goal hours
- Line charts comparing goal vs actual time

### 5. Log Section

Hierarchical view of all events:

- **Categories** (Work, Study, Life)
    - **Subcategories** (e.g., Calculus, SITCON, GYM)
        - **Individual Events** with details:
            - Event name
            - Date and time
            - Duration
            - Calendar source
            - Description

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Material-UI v7** - Component library
- **MUI X Charts** - Data visualization
- **React Router** - Navigation
- **Google Calendar API** - Calendar data
- **Google OAuth** - Authentication
- **Vite** - Build tool

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── InsightSection.tsx
│   ├── GoalSection.tsx
│   └── LogSection.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── pages/               # Page components
│   ├── HomePage.tsx
│   └── DashboardPage.tsx
├── services/            # API services
│   └── calendarService.ts
├── utils/               # Utility functions
│   ├── dataAnalysis.ts
│   └── dateUtils.ts
└── App.tsx              # Main app component
```

## Customization

### Modify Categories and Subcategories

Edit `src/utils/dataAnalysis.ts`:

```typescript
export const categoryMapping: CategoryMapping = {
	Work: ["sitcon", "sdc" /* add your keywords */],
	Study: ["calculus" /* add your keywords */],
	Life: ["gym" /* add your keywords */]
};
```

### Change Daily Goals

Edit `src/utils/dataAnalysis.ts` in the `analyzeGoals` function to change goal values.

### Adjust Semester Date Ranges

Edit `src/utils/dateUtils.ts` in the `detectSemester` function.

## Troubleshooting

### "No events found"

- Check that your calendar names contain "Work", "Class", or "Study"
- Verify the date range includes events
- Make sure you granted calendar read permissions

### Authentication errors

- Verify your Google Client ID is correct
- Check that authorized origins include your local URL
- Clear browser cache and try again

### API errors

- Ensure Google Calendar API is enabled in your project
- Check that your API key is valid and not restricted incorrectly
- Verify you haven't exceeded API quotas

## License

MIT

## Author

Edit-Mr (emtech)
