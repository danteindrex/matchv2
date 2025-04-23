# Otic: AI-Driven GitHub-Job Matching Platform

A comprehensive platform that matches GitHub projects with job opportunities using CrewAI, Flask, Next.js, and SQLite.

## Overview

Otic is an AI-powered platform that facilitates the matching of GitHub projects with job opportunities. The system enables companies to match jobs to projects and talent accounts to view project-to-job matches, ensuring a secure and role-specific user experience.

## Features

- **AI-Powered Matching**: Uses CrewAI to analyze GitHub repositories and job descriptions, providing accurate matching scores and detailed explanations
- **Role-Based Access**: Different interfaces for talent (developers) and companies (employers)
- **GitHub Integration**: Connect GitHub repositories to find matching job opportunities
- **Job Management**: Add, edit, and delete job listings
- **Web Scraping**: AI agents capable of scraping job postings from various websites
- **Batch Processing**: Process multiple GitHub repositories or job descriptions at once
- **Authentication**: Secure user authentication with JWT tokens
- **Responsive UI**: Elegant user interface with light and dark mode support
- **Database Storage**: SQLite database for storing users, projects, jobs, and matches

## Architecture

The system consists of three main components:

1. **Next.js Frontend**: A responsive web interface with light/dark mode support
2. **Flask API**: A RESTful API that exposes the matching functionality
3. **CrewAI Engine**: The core matching and scraping logic using specialized AI agents

### CrewAI Agents

The system uses several specialized agents:

1. **GitHub Repository Analyzer**: Analyzes repositories to extract technologies, skills, and complexity
2. **Job Description Analyzer**: Extracts requirements, skills, and qualifications from job descriptions
3. **Project-Job Matcher**: Determines compatibility and generates matching scores
4. **Job Listing Scraper**: Extracts job listings from websites
5. **Job Listing Parser**: Parses and structures job listing data

## Getting Started

### Prerequisites

- Node.js 18+ for the frontend
- Python 3.9+ for the backend
- OpenAI API key for CrewAI

### Installation

#### Frontend (Next.js)

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/otic.git
cd otic

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Run the development server
npm run dev
\`\`\`

#### Backend (Flask)

\`\`\`bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set your OpenAI API key
export OPENAI_API_KEY=your_api_key_here  # On Windows: set OPENAI_API_KEY=your_api_key_here

# Run the Flask server
python app.py
\`\`\`

### Docker Deployment

You can also use Docker to deploy the backend:

\`\`\`bash
cd backend
docker build -t otic-backend .
docker run -p 5000:5000 -e OPENAI_API_KEY=your_api_key_here otic-backend
\`\`\`

## Database Schema

The system uses SQLite with the following schema:

### Users Table
- id (INTEGER, PRIMARY KEY)
- username (TEXT)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- role (TEXT, 'talent' or 'company')
- created_at (TIMESTAMP)

### Projects Table
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- name (TEXT)
- url (TEXT)
- description (TEXT)
- languages (TEXT, JSON array)
- last_analyzed (TIMESTAMP)
- created_at (TIMESTAMP)

### Jobs Table
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- title (TEXT)
- company (TEXT)
- description (TEXT)
- requirements (TEXT, JSON array)
- source_url (TEXT)
- created_at (TIMESTAMP)

### Matches Table
- id (INTEGER, PRIMARY KEY)
- project_id (INTEGER, FOREIGN KEY)
- job_id (INTEGER, FOREIGN KEY)
- score (INTEGER)
- factors (TEXT, JSON array)
- created_at (TIMESTAMP)

## API Documentation

### Authentication

#### Register
- **Endpoint**: `/api/auth/register`
- **Method**: POST
- **Request Body**:
\`\`\`json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "talent"  // or "company"
}
\`\`\`

#### Login
- **Endpoint**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Projects

#### Get Projects
- **Endpoint**: `/api/projects`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}

#### Add Project
- **Endpoint**: `/api/projects`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "url": "https://github.com/username/repository"
}
\`\`\`

### Jobs

#### Get Jobs
- **Endpoint**: `/api/jobs`
- **Method**: GET
- **Headers**: Authorization: Bearer {token}

#### Add Job
- **Endpoint**: `/api/jobs`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "title": "Senior Frontend Developer",
  "company": "TechCorp",
  "description": "We're looking for a senior frontend developer...",
  "requirements": ["React", "TypeScript", "CSS"]
}
\`\`\`

### Matching

#### Match Project to Jobs
- **Endpoint**: `/api/match/project-to-jobs`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "project_id": 1
}
\`\`\`

#### Match Job to Projects
- **Endpoint**: `/api/match/job-to-projects`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "job_id": 1
}
\`\`\`

### Job Scraping

#### Scrape URL
- **Endpoint**: `/api/scrape/url`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "url": "https://example.com/jobs"
}
\`\`\`

#### Batch Scraping
- **Endpoint**: `/api/scrape/batch`
- **Method**: POST
- **Headers**: Authorization: Bearer {token}
- **Request Body**:
\`\`\`json
{
  "keywords": "React Developer\nFrontend Engineer\nJavaScript Developer"
}
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
