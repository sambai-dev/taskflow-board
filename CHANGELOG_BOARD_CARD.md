# Board Card Refactoring & UI Updates

## Overview
This document summarizes the changes made to the Board Card component and Dashboard UI to improve vertical density, visual hierarchy, and dynamic theming.

## 1. New Component: `BoardCard`
A dedicated component was created at `components/BoardCard.tsx` to encapsulate the board card logic, replacing the inline Card implementation in `app/dashboard/page.tsx`.

### Key Features:
- **Compact Layout**: Reduced padding (`p-4`) and tighter spacing to optimize for vertical density.
- **Unified View Logic**: The same component logic is now used for both Grid and List views, ensuring consistency.
- **Dynamic Icon Coloring**:
  - **Empty Columns (0 tasks)**: Icons appear in dimmed grey (`text-gray-300`).
  - **Active Columns (>0 tasks)**: Icons inherit the **board's selected theme color** (e.g., Blue, Red, Green) instead of fixed semantic colors.
- **Visual Status Indicators**:
  - Replaced text labels with Lucide icons:
    - `Circle` (To Do)
    - `ArrowRight` (In Progress)
    - `CheckCircle` (Done)
    - `Layout` (Default)
- **Column Visibility**:
  - Displays up to 4 columns by default (typically To Do, In Progress, Review, Done).
  - Shows a "+N" counter only if there are more than 4 columns.

## 2. Dashboard Page Updates (`app/dashboard/page.tsx`)
- **Refactoring**: Replaced the verbose inline Card code with the new `<BoardCard />` component.
- **View Modes**: The dashboard supports switching between "Grid" and "List" views, both utilizing the updated `BoardCard` for a consistent look and feel.
- **Cleanup**: Removed redundant styling and logic that was moved into the new component.

## 3. Utility Updates (`lib/utils.ts`)
- **`getBoardColorClasses`**: Extracted color mapping logic into a reusable helper function.
- **`getRelativeTime`**: Added a helper to convert date strings into relative time formats (e.g., "2h ago", "3d ago") for cleaner metadata display.

## Summary of Behavior
| Feature | Previous Behavior | New Behavior |
|---------|-------------------|--------------|
| **Layout** | High padding, vertical list for tasks | Compact, horizontal task status row in footer |
| **Icons** | Text labels (To Do, Done) | Lucide Icons (Circle, CheckCircle) |
| **Colors** | Fixed semantic colors (Green=Done) | **Dynamic Board Theme**: Icons match board color (e.g., Red board = Red icons) |
| **Empty State** | Hidden or colored | Dimmed Grey (`text-gray-300`) |
| **Metadata** | Full date string | Relative time ("Updated 2h ago") |
