# DevMatch - Master Project Context

## Project Name

DevMatch

---

# Project Vision

DevMatch is a full-stack SaaS web application that helps students build better software teams.

Unlike LinkedIn or traditional networking platforms, DevMatch focuses on project-based collaboration.

A project owner posts a project.

Developers create detailed profiles.

DevMatch intelligently recommends the most suitable teammates based on project requirements and customizable priorities.

The project is intended to become the flagship portfolio project on my resume.

---

# Core Idea

Project Owner creates a project.

↓

Selects required skills.

↓

Assigns weightage.

Example:

Technical Skills → 40%

Availability → 20%

Experience → 15%

Communication → 15%

Past Projects → 10%

↓

Developers apply.

↓

DevMatch calculates compatibility scores.

↓

Owner receives ranked candidates with AI explanations.

↓

Owner makes the final decision.

---

# Unique Selling Point (USP)

Unlike existing platforms, DevMatch uses an adaptive matching system.

The project owner decides what should be prioritized.

Different projects require different teammates.

The recommendation system changes dynamically based on these priorities.

The AI also explains WHY a candidate received a particular score.

This explainability is one of the major features of DevMatch.

---

# Tech Stack

Frontend

- React 19
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Lucide React

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

Authentication

- JWT
- bcrypt

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# UI Inspiration

Inspired by

- Vercel
- Linear
- Stripe
- GitHub
- Notion

Dark-first UI.

Minimal.

Professional.

Premium SaaS appearance.

Lots of whitespace.

Excellent typography.

---

# Coding Philosophy

Do NOT build this project like a YouTube tutorial.

Every feature should have a reason.

Every component should be reusable.

Always explain design decisions.

Explain architecture.

Explain trade-offs.

Teach software engineering rather than only giving code.

Act as a Senior Full Stack Engineer and mentor.

---

# Styling Rules

Use Tailwind CSS.

Avoid normal CSS unless absolutely necessary.

Prefer reusable Tailwind components.

Use semantic HTML.

---

# React Architecture

src/

components/

Hero/

Features/

HowItWorks/

Stats/

CTA/

Footer/

Navbar/

pages/

hooks/

services/

utils/

context/

styles/

---

# Hero Architecture

Hero/

Hero.jsx

HeroContent.jsx

HeroDashboard.jsx

CandidateCard.jsx

Hero is fully componentized.

Hero.jsx is only responsible for layout.

HeroContent handles the left side.

HeroDashboard handles the right side.

CandidateCard is reusable.

---

# Hero Features

Completed

✔ Premium Heading

✔ Description

✔ CTA Buttons

✔ Trust Pills

✔ AI Match Preview

✔ Project Card

✔ Candidate Cards

✔ AI Insights

✔ View Full Analysis Button

---

# Future Hero Improvements

Do NOT work on these now.

They belong to the Final Polish Sprint.

- Floating animation
- Glassmorphism improvements
- Better avatars
- Better hover effects
- Better shadows
- Better mobile polish
- Live counters
- Accessibility improvements

---

# Candidate Card

Current Candidate Card displays

- Avatar
- Name
- Rank
- Match Percentage
- Progress Bar
- Experience
- Availability
- Skills
- View Details

Later this component will receive backend data through props.

---

# Future Product Flow

Landing Page

↓

Authentication

↓

Dashboard

↓

Create Project

↓

Assign Skill Weights

↓

Developers Apply

↓

AI Match Results

↓

Candidate Details

↓

Invite Candidate

---

# Planned AI Match Results Page

The "View Full Analysis" button in the Hero will eventually navigate to

/projects/:projectId/matches

This page will display

- Ranked Candidates
- Compatibility Scores
- AI Explanations
- Skill Match Breakdown

---

# Planned Candidate Details Page

Route

/candidates/:candidateId

This page will contain

- Skills
- Experience
- Availability
- Communication Score
- Past Projects
- Portfolio
- GitHub
- AI Explanation
- Compatibility Breakdown
- Invite Button

---

# Matching Algorithm

Weight Based

Skills

Availability

Experience

Communication

Projects

Every project owner can assign custom priorities.

The score updates dynamically.

The AI also explains why the recommendation was generated.

---

# Current Sprint

Sprint 2

Landing Page

Status

Navbar ✅

Hero ✅

Features ⏳

How It Works

Statistics

CTA

Footer

---

# Development Workflow

For every section

1. Understand the purpose

2. Design the UI

3. Design component architecture

4. Build JSX

5. Build Tailwind UI

6. Make responsive

7. Refactor

8. Git Commit

Never skip directly to coding.

---

# Git Workflow

git status

git add .

git status

git commit -m "Meaningful message"

git push

---

# Resume Goal

DevMatch is the flagship resume project.

Every implemented feature should eventually become a resume bullet.

Never claim features that have not been implemented.

---

# Next Sprint Task

Continue Sprint 2.

Build the Features Section.

The Features section should communicate the major capabilities of DevMatch.

Suggested feature cards

- Adaptive AI Matching
- Explainable Recommendations
- Skill-based Team Formation
- Smart Candidate Ranking
- Project Collaboration
- Student-focused Platform

Use reusable React components.

Use Tailwind CSS.

Maintain the same premium SaaS design language established in the Hero.

---

# Mentoring Style

Continue exactly like previous sessions.

Explain important architectural decisions.

Explain industry best practices.

Move at a reasonably fast pace.

Avoid over-explaining basic HTML.

Provide production-quality React code.

Think like a Senior Frontend Engineer reviewing a pull request.

Whenever possible, suggest improvements that increase portfolio quality.

Always prioritize scalability and maintainability.