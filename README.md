# Workout Planner 💪

A personalized workout planning web application built with **Next.js, React, TypeScript, and Tailwind CSS**.

Workout Planner helps users create structured workout plans based on their goals, target muscle groups, available equipment, and training preferences. The application also includes workout tracking, favorites, progress monitoring, recommendations, and interactive feedback features.

---

## ✨ Features

- 🏋️ Personalized workout plan generation
- 🎯 Goal-based workout selection
- 💪 Muscle-group targeting
- 🧰 Equipment-based exercise selection
- 📚 Exercise database
- ⭐ Favorite workouts and exercises
- 📊 Workout progress and tracking
- 🔄 Workout recommendations
- 📝 Workout feedback
- ⭐ Exercise/workout ratings
- 📱 Responsive user interface
- 🌙 Theme support
- ⚡ Fast Next.js application architecture

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### UI & Components

- **Radix UI**
- **Lucide React**
- **Framer Motion**
- **Sonner**
- **Recharts**
- **Embla Carousel**
- **React Hook Form**
- **Zod**

### Backend / Data

- **Supabase**
- Local application data and workout logic

### Development

- **Node.js**
- **pnpm**
- **Git / GitHub**

---

## 📂 Project Structure

```text
workout-planner/
│
├── app/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── enhanced-dashboard.tsx
│   ├── enhanced-dashboard-with-realtime.tsx
│   ├── equipment-selection-grid.tsx
│   ├── favorites-view.tsx
│   ├── goal-selection.tsx
│   ├── loading-animation.tsx
│   ├── progress-dashboard.tsx
│   ├── similar-workouts.tsx
│   ├── workout-plan.tsx
│   ├── workout-plan-with-tracking.tsx
│   ├── workout-planner.tsx
│   ├── workout-recommendations.tsx
│   └── ui/
│
├── contexts/
│   └── workout-completion-context.tsx
│
├── hooks/
│
├── lib/
│   ├── collaborative-filtering.ts
│   ├── difficulty-adjuster.ts
│   ├── exercise-database.ts
│   ├── favorites-context.ts
│   ├── mock-user-data.ts
│   ├── recommendation-engine.ts
│   ├── supabase-client.ts
│   └── utils.ts
│
├── public/
│   └── images/
│
├── styles/
│
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
└── tsconfig.json
