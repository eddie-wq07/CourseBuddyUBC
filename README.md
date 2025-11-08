# CourseBuddy

**Your AI Course Assistant** - AI-powered course scheduling built by students, for students.

## 🎯 About

CourseBuddy is an intelligent course scheduling application designed to help university students create optimized class schedules. Using AI-powered optimization and an intuitive drag-and-drop interface, CourseBuddy takes the stress out of course planning by considering factors like class timing, location, instructor preferences, and schedule conflicts.

## ✨ Features

### 🤖 AI Schedule Assistant
- **Conversational Interface**: Chat naturally with the AI about your scheduling needs
- **Smart Course Discovery**: Find courses by department, level, or specific requirements
- **Intelligent Optimization**: AI suggests optimal schedules based on your preferences
- **Location & Timing Awareness**: Considers campus locations and travel time between classes

### 📅 Schedule Management
- **Drag & Drop Interface**: Easily rearrange courses on your weekly schedule grid
- **Visual Schedule Builder**: See your week at a glance with color-coded courses
- **Save & Load Schedules**: Store multiple schedule versions and switch between them
- **Undo/Redo Support**: Experiment freely with full history tracking

### 📊 Course Insights
- **Enrollment Statistics**: View historical enrollment rates and trends
- **Instructor Ratings**: Access top-rated instructors for each course
- **Grade Distributions**: See average grades and course difficulty metrics
- **Textbook Requirements**: Check required materials before registering

### 🗺️ Prerequisite Visualization
- **Interactive Course Maps**: Visualize prerequisite chains and course dependencies
- **Progress Tracking**: See which courses you've completed and what they unlock
- **Graduation Planning**: Plan your path to graduation with clear visual guides

### 🔐 User Authentication
- **Secure Login**: CWL credential-based authentication
- **Personal Schedules**: Save and manage your schedules privately
- **Session Management**: Seamless authentication across devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **React Flow** - Interactive prerequisite maps
- **@dnd-kit** - Drag and drop functionality

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Real-time subscriptions
  - Authentication

### AI Integration
- **OpenAI GPT** - Schedule optimization and conversational AI
- **Custom AI Functions** - Intelligent course recommendations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd coursebuddy
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
coursebuddy/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Page footer
│   │   ├── ScheduleGrid.tsx    # Weekly schedule display
│   │   ├── AiOptimizerPanel.tsx # AI chat interface
│   │   └── ...
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Main dashboard
│   │   ├── Auth.tsx        # Login page
│   │   ├── About.tsx       # About page
│   │   ├── CourseInsights.tsx  # Course statistics
│   │   └── PrerequisiteMap.tsx # Dependency visualization
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── integrations/       # Supabase client
│   └── main.tsx            # App entry point
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── fetch-courses/  # Course data fetching
│   │   ├── optimize-schedule-ai/ # AI optimization
│   │   └── report-issue/   # Issue reporting
│   └── config.toml         # Supabase configuration
└── public/                 # Static assets
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier-compatible formatting

## 🚢 Deployment

The application can be deployed to any static hosting service:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider of choice:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Or any other static hosting service

### Backend Deployment

Supabase Edge Functions are deployed automatically when you push to your repository if you have the Supabase CLI configured.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Created by Edward Jung - A student developer passionate about improving the university experience through technology.

## ⚠️ Disclaimer

**Prototype Status**: This is a functional prototype demonstrating AI-powered schedule optimization. Some features may be buggy or incomplete as development continues.

**Data Accuracy**: While we strive for accuracy, course information should be verified with official university sources before making registration decisions.

**AI Development**: The AI assistant is continuously learning and improving. Future updates will include comprehensive course data including times, patterns, locations, and instructor information for more accurate recommendations.

## 📧 Support

For issues, questions, or suggestions, please use the in-app "Report an Issue" feature or open an issue on GitHub.

---

Built with ❤️ for students, by students
