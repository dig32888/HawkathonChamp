# Campus Meal Manager

A comprehensive meal plan and budget management web application designed for college students to track dining dollars, meal swipes, meal exchanges, debit card balances, and personal finances throughout the semester.

## Overview

Campus Meal Manager helps students:
- Track meal plan resources (dining dollars, meal swipes, meal exchanges, debit card)
- Set meal preferences and see daily allocations based on remaining semester days
- Create budget categories for housing, groceries, entertainment, and other expenses
- Log meals and track spending across categories
- View spending patterns on a calendar
- Monitor budget health with visual progress indicators

## Project Architecture

### Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query (data fetching)
- **Backend**: Express.js, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Storage**: In-memory storage (MemStorage) for development
- **Date Handling**: date-fns

### Design System
- **Theme**: Modern Productivity Design (Linear/Notion inspired)
- **Colors**: Professional blue primary (220 85% 55%), success green, warning orange, danger red
- **Typography**: Inter font family for excellent number readability
- **Dark Mode**: Full dark mode support with theme toggle
- **Layout**: Sidebar navigation (desktop), responsive design for mobile

## Data Models

### Semester
- Tracks semester details, start/end dates
- Stores initial and current balances for all meal plan components
- Meals per day preference
- Active status

### Budget Categories
- User-defined spending categories (Housing, Groceries, etc.)
- Allocated amount and spent amount tracking
- Custom colors and icons for visual distinction

### Transactions
- Expense records linked to budget categories
- Date, amount, description, type

### Meal Logs
- Individual meal records
- Payment method (swipe, dining dollars, exchange, debit)
- Date and meal type (breakfast, lunch, dinner, snack)

## Key Features Implemented

### Dashboard
- Hero stat cards showing remaining balances
- Daily budget calculations based on days remaining
- Budget overview with category breakdown
- Recent transactions list
- Empty state prompts for initial setup

### Meal Plan Setup
- 3-step wizard for semester setup
- Input fields for all meal plan components
- Meal preference configuration
- Validation and error handling

### Meal Plan Tracker
- Current balance display for all resources
- Meal logging form with payment method selection
- Conditional amount input for monetary payments

### Budget Planner
- Budget category creation with presets
- Color-coded category cards
- Progress bars showing spending vs. allocation
- Expense tracking by category
- Budget summary overview

### Calendar View
- Monthly calendar grid
- Color-coded days based on spending levels
- Meal count badges per day
- Navigation between months
- Visual spending indicators

## User Journey

1. **Initial Setup**: Create semester with dates and meal plan balances
2. **Budget Planning**: Add budget categories for spending tracking
3. **Daily Use**: Log meals and add expenses as they occur
4. **Monitoring**: Check dashboard for balance overview and budget health
5. **Calendar Review**: View spending patterns and meal usage over time

## Recent Changes

- 2025-10-17: Initial project setup with complete schema and frontend implementation
- Full MVP feature set implemented across all pages
- Theme provider with dark mode support
- Responsive sidebar navigation
- All CRUD operations stubbed in frontend, ready for backend integration

## Development Notes

- Follow design guidelines in `design_guidelines.md` for any UI changes
- All forms use react-hook-form with Zod validation
- TanStack Query for all data fetching with proper cache invalidation
- Shadcn UI components used throughout for consistency
- Data persists in memory (will be lost on server restart until database integration)
