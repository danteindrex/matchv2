from crewai import Agent, Task, Crew, LLM
import re

class JobScraper:
    def __init__(self):
        # Initialize the LLM
        self.llm = LLM(
            model="gemini/gemini-2.0-flash",
            temperature=0.2
        )
        
    def _create_scraper_agent(self):
        return Agent(
            role="Job Listing Scraper",
            goal="Extract job listings from websites accurately and efficiently",
            backstory="You are an expert in web scraping and data extraction. You can navigate complex websites and extract structured information from job listings.",
            verbose=True,
            llm=self.llm,
            tools=[]  # We could add specific tools for web scraping
        )
    
    def _create_parser_agent(self):
        return Agent(
            role="Job Listing Parser",
            goal="Parse and structure job listing data into a consistent format",
            backstory="You are an expert in data processing and natural language understanding. You can extract key information from job descriptions and standardize it.",
            verbose=True,
            llm=self.llm,
            tools=[]
        )
    
    def scrape_url(self, url):
        """Scrape job listings from a specific URL"""
        # Create agents
        scraper = self._create_scraper_agent()
        parser = self._create_parser_agent()
        
        # Create tasks
        scrape_task = Task(
            description=f"Scrape job listings from the URL: {url}",
            agent=scraper,
            expected_output="Raw job listing data extracted from the website."
        )
        
        parse_task = Task(
            description="Parse the raw job listing data into a structured format with title, company, description, and URL.",
            agent=parser,
            expected_output="Structured job listing data in a consistent format."
        )
        
        # Create and run the crew
        crew = Crew(
            agents=[scraper, parser],
            tasks=[scrape_task, parse_task],
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Process and format the results
        # In a real implementation, we would parse the result from the crew
        # For this example, we'll return mock data
        
        return {
            "jobs": [
                {
                    "title": "Senior Frontend Developer",
                    "company": "TechCorp",
                    "url": "https://example.com/job/123",
                    "description": "We're looking for a senior frontend developer with experience in React and TypeScript.",
                    "status": "success"
                },
                {
                    "title": "Full Stack Engineer",
                    "company": "InnovateSoft",
                    "url": "https://example.com/job/456",
                    "description": "Join our team as a full stack engineer working on exciting projects.",
                    "status": "success"
                }
            ]
        }
    
    def scrape_batch(self, keywords):
        """Scrape job listings based on keywords from multiple sources"""
        # Create agents
        scraper = self._create_scraper_agent()
        parser = self._create_parser_agent()
        
        # Split keywords if multiple are provided
        keyword_list = [kw.strip() for kw in keywords.split('\n') if kw.strip()]
        
        # Create tasks
        scrape_tasks = []
        for keyword in keyword_list:
            scrape_tasks.append(
                Task(
                    description=f"Scrape job listings related to '{keyword}' from multiple job boards",
                    agent=scraper,
                    expected_output="Raw job listing data extracted from multiple websites."
                )
            )
        
        parse_tasks = []
        for keyword in keyword_list:
            parse_tasks.append(
                Task(
                    description=f"Parse the raw job listing data for '{keyword}' into a structured format with title, company, description, and URL.",
                    agent=parser,
                    expected_output="Structured job listing data in a consistent format."
                )
            )
        
        # Create and run the crew
        crew = Crew(
            agents=[scraper, parser],
            tasks=scrape_tasks + parse_tasks,
            verbose=True
        )
        
        result = crew.kickoff()
        
        # Process and format the results
        # In a real implementation, we would parse the result from the crew
        # For this example, we'll return mock data
        
        return {
            "jobs": [
                {
                    "title": "Senior Frontend Developer",
                    "company": "TechCorp",
                    "url": "https://example.com/job/123",
                    "description": "We're looking for a senior frontend developer with experience in React and TypeScript.",
                    "status": "success"
                },
                {
                    "title": "Full Stack Engineer",
                    "company": "InnovateSoft",
                    "url": "https://example.com/job/456",
                    "description": "Join our team as a full stack engineer working on exciting projects.",
                    "status": "success"
                },
                {
                    "title": "React Developer",
                    "company": "WebSolutions",
                    "url": "https://example.com/job/789",
                    "description": "Looking for a React developer to join our team.",
                    "status": "success"
                },
                {
                    "title": "Frontend Engineer",
                    "company": "TechStartup",
                    "url": "https://example.com/job/101",
                    "description": "Frontend engineer position at a fast-growing startup.",
                    "status": "error",
                    "error": "Failed to parse job details"
                }
            ]
        }
