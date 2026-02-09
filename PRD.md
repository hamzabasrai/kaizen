# Kaizen - Product Requirements Document

## Overview

**Kaizen** is an iOS habit tracking and countdown app built with React Native and Expo. The app helps users build positive habits and track important dates through an intuitive, beautiful interface with GitHub-style contribution graphs and tile-based countdowns.

---

## Technical Stack

- **Framework**: Expo SDK ~54.0.33
- **Navigation**: Expo Router with Bottom Tab Navigator
- **State Management**: Zustand (lightweight, recommended for this project)
- **Database**: Supabase (PostgreSQL + Real-time subscriptions)
- **Authentication**: Supabase Auth (anonymous or email-based)
- **UI Components**: React Native Paper or custom components
- **Styling**: NativeWind (Tailwind for RN) or StyleSheet
- **Icons**: @expo/vector-icons
- **Animations**: React Native Reanimated

---

## Navigation Structure

### Bottom Tab Navigator

| Tab            | Icon                           | Description                 |
| -------------- | ------------------------------ | --------------------------- |
| **Habits**     | `CheckboxOutline` / `Checkbox` | Grid view of all habits     |
| **Countdowns** | `CalendarOutline` / `Calendar` | Tile view of all countdowns |

### Navigation Flow

```
┌─────────────────┐
│   Root Layout   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│              Bottom Tab Navigator               │
├─────────────────────────┬───────────────────────┤
│       Habits Tab        │     Countdowns Tab    │
├─────────────────────────┼───────────────────────┤
│  - Habits List Screen   │ - Countdowns List     │
│  - Habit Detail Modal   │ - Countdown Detail    │
│  - Calendar Picker      │ - Add/Edit Countdown  │
│  - Add/Edit Habit       │                       │
└─────────────────────────┴───────────────────────┘
```

---

## Feature Specifications

### 1. Habit Tracking

#### 1.1 Habits List Screen

- **Layout**: Vertical list of habit cards
- **Each Card Contains**:
  - Habit name and icon/color
  - GitHub-style contribution grid (last 365 days)
  - Current streak indicator
  - Quick stats (completion rate)

#### 1.2 GitHub-Style Contribution Grid

- **Structure**: 7 rows (days of week) × 53 columns (weeks)
- **Cell Colors**:
  - No activity: `surfaceVariant`
  - 1 completion: Light accent
  - 2+ completions: Medium accent
  - 3+ completions: Dark accent
  - 4+ completions: Darkest accent
- **Timeframe**: Last 365 days, configurable in settings
- **Interaction**: Tap grid → Opens Calendar Modal

#### 1.3 Calendar Modal

- **Purpose**: View and toggle habit completion for specific dates
- **Features**:
  - Monthly calendar view
  - Swipe to navigate months
  - Tap date to toggle completion
  - Visual indicators for completed days
  - Multi-select for batch editing (optional)

#### 1.4 Add/Edit Habit Screen

**Fields**:

- Name (required)
- Icon (emoji or icon selection)
- Color (theme color selection)
- Frequency goal (e.g., "3x per week", "Daily")
- Reminder notification settings (time, days of week)
- Notes (optional)

#### 1.5 Habit Statistics

Displayed on each habit card:

- **Current Streak**: Consecutive days completed
- **Longest Streak**: All-time best streak
- **Completion Rate**: % of target days completed

#### 1.6 Data Model

```typescript
interface Habit {
	id: string;
	user_id: string;
	name: string;
	icon: string;
	color: string;
	frequency_goal: number; // e.g., 7 for daily, 3 for 3x/week
	frequency_period: 'day' | 'week' | 'month';
	reminder_enabled: boolean;
	reminder_time?: string; // HH:mm format
	reminder_days?: number[]; // 0-6 for Sun-Sat
	notes?: string;
	created_at: string;
	updated_at: string;
}

interface HabitCompletion {
	id: string;
	habit_id: string;
	user_id: string;
	date: string; // YYYY-MM-DD format
	completed: boolean;
	created_at: string;
}
```

---

### 2. Countdown Tracker

#### 2.1 Countdowns List Screen

- **Layout**: Vertical scroll of tiles
- **Sorting**: By date (nearest first)
- **Tile Design**:
  - Title and date prominently displayed
  - Days remaining (large number)
  - Progress bar (optional visual)
  - Icon/image (optional)

#### 2.2 Countdown Tile

**Display Information**:

- Title (event name)
- Target date
- Days remaining (or "Today!" if 0, "Overdue" if past)
- Progress indicator (time elapsed vs. remaining)
- Category color/icon

#### 2.3 Add/Edit Countdown Screen

**Fields**:

- Title (required)
- Target date (required)
- Is recurring toggle
- Recurrence type (if recurring): daily, weekly, monthly, yearly
- Icon/color selection
- Reminder notification settings
- Notes

#### 2.4 Completed Countdowns

- Countdowns that pass their date are marked "Completed"
- Displayed with strikethrough or dimmed styling
- Option to archive or delete
- For recurring countdowns: auto-create next occurrence

#### 2.5 Data Model

```typescript
interface Countdown {
	id: string;
	user_id: string;
	title: string;
	target_date: string; // ISO date string
	is_recurring: boolean;
	recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	icon?: string;
	color: string;
	reminder_enabled: boolean;
	reminder_time?: string;
	notes?: string;
	is_completed: boolean;
	created_at: string;
	updated_at: string;
}
```

---

### 3. User Interface

#### 3.1 Theme Support

- **Light Mode**: Clean, modern design with white backgrounds
- **Dark Mode**: Dark backgrounds with appropriate contrast
- **System Preference**: Auto-detect and respect system setting
- **Manual Toggle**: Allow manual override in settings

#### 3.2 Color Palette

- Primary accent color (user configurable per habit/countdown)
- Success color (green tones)
- Warning color (orange/yellow)
- Error color (red)
- Neutral grays for backgrounds and text

#### 3.3 Typography

- Modern, clean sans-serif font family
- Clear hierarchy: Display, Headline, Body, Caption
- Accessibility: Minimum 16px for body text

#### 3.4 Animations

- Smooth transitions between screens
- Grid cell animations on completion
- Streak celebration animations
- Pull-to-refresh feedback

---

### 4. Notifications

#### 4.1 Habit Reminders

- Configurable per habit
- Time-based (e.g., 8:00 AM daily)
- Day-specific (e.g., Mon/Wed/Fri only)
- Customizable message

#### 4.2 Countdown Reminders

- Alert X days before target date (configurable)
- Day-of notification option
- Recurring countdown notifications

#### 4.3 Notification Permissions

- Request permission on first app launch
- Settings screen for managing permissions
- Respect user's Do Not Disturb settings

---

### 5. iOS Home Screen Widgets

#### 5.1 Widget Types

1. **Habit Grid Widget**: Display GitHub-style grid for a selected habit
2. **Streak Widget**: Show current streak for quick motivation
3. **Countdown Widget**: Display nearest countdown with days remaining
4. **Multi-Countdown Widget**: Show up to 3 upcoming countdowns

#### 5.2 Widget Configuration

- Allow users to select which habit/countdown to display
- Small, medium, and large widget sizes
- Support for dark mode in widgets

#### 5.3 Technical Implementation

- Use Expo Config Plugin for widget support
- Implement App Groups for data sharing
- Update widgets when app state changes

---

### 6. Data Export

#### 6.1 Export Format

- JSON format for maximum portability
- Includes all habits, completions, countdowns, and settings
- Timestamped export

#### 6.2 Export Options

- Export to Files app
- Share via iOS share sheet
- AirDrop support

#### 6.3 Import (Future Feature)

- Import previously exported JSON
- Merge or replace existing data

---

### 7. Database Schema (Supabase)

#### 7.1 Tables

**profiles** (auto-created by Supabase Auth)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'
);
```

**habits**

```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  frequency_goal INTEGER DEFAULT 1,
  frequency_period TEXT DEFAULT 'day',
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  reminder_days INTEGER[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
```

**habit_completions**

```sql
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

CREATE INDEX idx_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX idx_completions_date ON habit_completions(date);
```

**countdowns**

```sql
CREATE TABLE countdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_type TEXT,
  icon TEXT,
  color TEXT,
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_time TIME,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_countdowns_user_id ON countdowns(user_id);
CREATE INDEX idx_countdowns_target_date ON countdowns(target_date);
```

#### 7.2 Row Level Security (RLS)

- Enable RLS on all tables
- Policies: Users can only read/write their own data

#### 7.3 Real-time Subscriptions

- Subscribe to habit_completions changes
- Subscribe to countdowns changes
- Update UI in real-time across devices

---

## Project Structure

```
kaizen/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator configuration
│   │   ├── habits.tsx            # Habits list screen
│   │   └── countdowns.tsx        # Countdowns list screen
│   ├── habit/
│   │   ├── [id].tsx              # Habit detail/edit screen
│   │   ├── new.tsx               # Create new habit
│   │   └── calendar.tsx          # Calendar modal for completions
│   ├── countdown/
│   │   ├── [id].tsx              # Countdown detail/edit screen
│   │   └── new.tsx               # Create new countdown
│   ├── settings.tsx              # App settings screen
│   ├── _layout.tsx               # Root layout with providers
│   └── index.tsx                 # Redirect to habits
├── components/
│   ├── habit/
│   │   ├── HabitCard.tsx         # Habit card with grid
│   │   ├── ContributionGrid.tsx  # GitHub-style grid
│   │   ├── CalendarPicker.tsx    # Date picker modal
│   │   └── StreakDisplay.tsx     # Streak statistics
│   ├── countdown/
│   │   ├── CountdownTile.tsx     # Countdown tile component
│   │   ├── DaysRemaining.tsx     # Large days display
│   │   └── ProgressBar.tsx       # Countdown progress
│   ├── ui/
│   │   ├── ColorPicker.tsx       # Color selection
│   │   ├── IconPicker.tsx        # Icon selection
│   │   ├── NotificationToggle.tsx # Reminder settings
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   └── shared/
│       ├── Header.tsx            # Screen header
│       ├── EmptyState.tsx        # Empty list state
│       └── Loading.tsx           # Loading indicator
├── store/
│   ├── useHabitsStore.ts         # Zustand habit state
│   ├── useCountdownsStore.ts     # Zustand countdown state
│   └── useThemeStore.ts          # Theme preferences
├── lib/
│   ├── supabase.ts               # Supabase client configuration
│   ├── notifications.ts          # Notification handlers
│   ├── widgets.ts                # Widget update helpers
│   └── utils.ts                  # Utility functions
├── hooks/
│   ├── useHabits.ts              # Habit data fetching
│   ├── useCountdowns.ts          # Countdown data fetching
│   ├── useStats.ts               # Statistics calculations
│   └── useTheme.ts               # Theme management
├── types/
│   ├── habit.ts                  # Habit type definitions
│   ├── countdown.ts              # Countdown type definitions
│   └── index.ts                  # Shared types
├── constants/
│   ├── colors.ts                 # Color palette
│   ├── icons.ts                  # Icon mappings
│   └── config.ts                 # App configuration
├── services/
│   ├── habits.ts                 # Habit API calls
│   ├── countdowns.ts             # Countdown API calls
│   └── export.ts                 # Data export service
├── assets/
│   └── images/                   # App images and icons
├── widgets/                      # iOS Widget Extension
│   └── KaizenWidget/
├── app.json                      # Expo configuration
├── package.json
└── PRD.md                        # This document
```

---

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)

- [x] Setup Expo project with required dependencies
- [x] Configure Supabase database and authentication
- [x] Implement basic navigation structure
- [x] Create data models and API services
- [x] Setup Zustand stores

### Phase 2: Habit Tracking (Week 3-4)

- [ ] Build habit list screen
- [ ] Implement GitHub-style contribution grid
- [ ] Create calendar picker modal
- [ ] Add create/edit habit flow
- [ ] Implement habit statistics (streaks, completion rate)

### Phase 3: Countdown Tracking (Week 5)

- [ ] Build countdown list with tile layout
- [ ] Implement add/edit countdown
- [ ] Add recurring countdown support
- [ ] Build countdown detail view

### Phase 4: UI/UX Polish (Week 6)

- [ ] Implement dark/light mode
- [ ] Add animations and transitions
- [ ] Create custom color/icon pickers
- [ ] Build settings screen

### Phase 5: Advanced Features (Week 7)

- [ ] Implement push notifications
- [ ] Add iOS home screen widgets
- [ ] Build data export functionality

### Phase 6: Testing & Launch (Week 8)

- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] App Store preparation
- [ ] Beta testing with TestFlight

---

## Dependencies to Add

```json
{
	"dependencies": {
		"@supabase/supabase-js": "^2.x",
		"zustand": "^4.x",
		"react-native-calendars": "^1.x",
		"date-fns": "^3.x",
		"expo-notifications": "~0.29.x",
		"expo-background-fetch": "~13.x",
		"expo-task-manager": "~12.x",
		"react-native-reanimated": "~4.1.1",
		"@react-native-async-storage/async-storage": "1.x"
	}
}
```

---

## Success Metrics

- Users create at least 3 habits within first week
- 70% daily active users complete at least one habit
- Average session duration > 2 minutes
- App Store rating > 4.5 stars
- < 1% crash rate

---

## Future Enhancements

1. **Social Features**: Share habits, compete with friends
2. **AI Insights**: Personalized recommendations based on patterns
3. **Integration**: Apple Health, Calendar sync
4. **Advanced Analytics**: Trend analysis, predictive streaks
5. **Templates**: Pre-built habit templates for common goals
6. **Export Options**: CSV, PDF, cloud backup services
7. **Wearable Support**: Apple Watch app
8. **Achievement System**: Gamification with badges and rewards

---

_Document Version: 1.0_
_Last Updated: 2026-02-08_
_Status: Draft - Ready for Review_
