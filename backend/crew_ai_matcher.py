from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
import json
import re

class ProjectJobMatcher:
    def __init__(self):
        # Initialize the LLM
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0.2
        )
        
    def _create_github_analyzer_agent(self):
        return Agent(
            role="GitHub Repository Analyzer",
            goal="Thoroughly analyze GitHub repositories to extract key information about technologies, skills, and project complexity",
            backstory="You are an expert in code analysis and software development. You can quickly understand repositories and identify the key technologies, patterns, and skills demonstrated.",
            verbose=True,
            llm=self.llm,
            tools=[]  # We could add specific tools for GitHub API interaction
        )
    
    def _create_job_analyzer_agent(self):
        return Agent(
            role="Job Description Analyzer",
            goal="Extract key requirements, skills, and qualifications from job descriptions",
            backstory="You are an expert in human resources and technical recruiting. You can identify the explicit and implicit requirements in job descriptions.",
            verbose=True,
            llm=self.llm,
            tools=[]
        )
    
    def _create_matching_agent(self):
        return Agent(
            role="Project-Job Matcher",
            goal="Determine the compatibility between GitHub projects and job descriptions",
            backstory="You are an expert in both technical skills assessment and job market analysis. You can accurately match projects to jobs based on various factors.",
            verbose=True,
            llm=self.llm,
            tools=[]
        )
    
    def _parse_languages(self, languages_str):
        """Parse languages JSON string to list"""
        try:
            return json.loads(languages_str)
        except:
            return []
    
    def _parse_requirements(self, requirements_str):
        """Parse requirements JSON string to list"""
        try:
            return json.loads(requirements_str)
        except:
            return []
    
    def match_project_to_jobs(self, project, jobs):
        """Match a GitHub project to multiple jobs"""
        # Create agents
        github_analyzer = self._create_github_analyzer_agent()
        job_analyzer = self._create_job_analyzer_agent()
        matcher = self._create_matching_agent()
        
        # Parse project languages
        project_languages = self._parse_languages(project.get('languages', '[]'))
        
        # Create tasks
        analyze_repo_task = Task(
            description=f"Analyze the GitHub repository {project['name']} at {project['url']} with languages {', '.join(project_languages)} and extract key technologies, skills, and complexity indicators.",
            agent=github_analyzer,
            expected_output="A detailed analysis of the repository including technologies, skills demonstrated, and project complexity."
        )
        
        job_analysis_tasks = []
        for job in jobs:
            job_requirements = self._parse_requirements(job.get('requirements', '[]'))
            job_analysis_tasks.append(
                Task(
                    description=f"Analyze job '{job['title']}' at {job['company']} with requirements {', '.join(job_requirements)} and extract key requirements, skills, and qualifications.",
                    agent=job_analyzer,
                    expected_output="A detailed analysis of the job requirements and skills needed."
                )
            )
        
        matching_tasks = []
        for job in jobs:
            matching_tasks.append(
                Task(
                    description=f"Determine the compatibility between the GitHub repository {project['name']} and job '{job['title']}' at {job['company']}. Provide a matching score (0-100) and explain key factors.",
                    agent=matcher,
                    expected_output="A matching score and detailed explanation of compatibility factors."
                )
            )
        
        # Create and run the crew
        crew = Crew(
            agents=[github_analyzer, job_analyzer, matcher],
            tasks=[analyze_repo_task] + job_analysis_tasks + matching_tasks,
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Process and format the results
        # In a real implementation, we would parse the result from the crew
        # For this example, we'll return mock data
        
        matches = []
        for i, job in enumerate(jobs):
            # Generate a mock score and factors
            score = 85 - (i * 10)  # Just for demonstration
            
            matches.append({
                "job_id": job['id'],
                "job_title": job['title'],
                "company": job['company'],
                "match_score": score,
                "key_factors": [
                    "Strong React.js experience matches repository's React usage",
                    "TypeScript proficiency evident in project structure",
                    "UI/UX focus aligns with job requirements",
                    "Missing experience with GraphQL mentioned in job description"
                ]
            })
        
        return {"matches": matches}
    
    def match_job_to_projects(self, job, projects):
        """Match a job to multiple GitHub projects"""
        # Create agents
        github_analyzer = self._create_github_analyzer_agent()
        job_analyzer = self._create_job_analyzer_agent()
        matcher = self._create_matching_agent()
        
        # Parse job requirements
        job_requirements = self._parse_requirements(job.get('requirements', '[]'))
        
        # Create tasks
        analyze_job_task = Task(
            description=f"Analyze the job '{job['title']}' at {job['company']} with requirements {', '.join(job_requirements)} and extract key requirements, skills, and qualifications.",
            agent=job_analyzer,
            expected_output="A detailed analysis of the job requirements and skills needed."
        )
        
        repo_analysis_tasks = []
        for project in projects:
            project_languages = self._parse_languages(project.get('languages', '[]'))
            repo_analysis_tasks.append(
                Task(
                    description=f"Analyze the GitHub repository {project['name']} at {project['url']} with languages {', '.join(project_languages)} and extract key technologies, skills, and complexity indicators.",
                    agent=github_analyzer,
                    expected_output="A detailed analysis of the repository including technologies, skills demonstrated, and project complexity."
                )
            )
        
        matching_tasks = []
        for project in projects:
            matching_tasks.append(
                Task(
                    description=f"Determine the compatibility between the job '{job['title']}' at {job['company']} and GitHub repository {project['name']}. Provide a matching score (0-100) and explain key factors.",
                    agent=matcher,
                    expected_output="A matching score and detailed explanation of compatibility factors."
                )
            )
        
        # Create and run the crew
        crew = Crew(
            agents=[github_analyzer, job_analyzer, matcher],
            tasks=[analyze_job_task] + repo_analysis_tasks + matching_tasks,
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Process and format the results
        # In a real implementation, we would parse the result from the crew
        # For this example, we'll return mock data
        
        matches = []
        for i, project in enumerate(projects):
            # Generate a mock score and factors
            score = 90 - (i * 15)  # Just for demonstration
            
            matches.append({
                "project_id": project['id'],
                "username": project.get('username', 'Unknown User'),
                "repository_name": project['name'],
                "repository_url": project['url'],
                "match_score": score,
                "key_factors": [
                    "React.js expertise matches job requirements",
                    "State management implementation aligns with position needs",
                    "Responsive design demonstrates UI/UX skills mentioned in job",
                    "Testing coverage shows quality focus required by position"
                ]
            })
        
        return {"matches": matches}
