from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from crew_ai_matcher import ProjectJobMatcher
from crew_ai_scraper import JobScraper
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key')
app.config['DATABASE'] = os.path.join(os.path.dirname(__file__), 'otic.db')

# Initialize the matchers
matcher = ProjectJobMatcher()
scraper = JobScraper()

# Database setup
def get_db_connection():
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with app.app_context():
        conn = get_db_connection()
        with open('schema.sql') as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()

# Authentication helper functions
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

def decode_token(token):
    try:
        payload = jwt.decode(token, app.config.get('SECRET_KEY'), algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'

def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            user_id = decode_token(token)
            if isinstance(user_id, str) and user_id.startswith('Token'):
                return jsonify({'message': user_id}), 401
            
            conn = get_db_connection()
            user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
            conn.close()
            
            if not user:
                return jsonify({'message': 'User not found!'}), 401
            
            # Convert user to dict
            current_user = dict(user)
            
        except Exception as e:
            return jsonify({'message': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password') or not data.get('role'):
        return jsonify({'message': 'Missing required fields!'}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    role = data['role']
    
    if role not in ['talent', 'company']:
        return jsonify({'message': 'Invalid role!'}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if user:
        conn.close()
        return jsonify({'message': 'User already exists!'}), 409
    
    hashed_password = generate_password_hash(password)
    
    conn.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        (username, email, hashed_password, role)
    )
    conn.commit()
    
    user_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    conn.close()
    
    token = generate_token(user_id)
    
    return jsonify({
        'message': 'User registered successfully!',
        'token': token,
        'user': {
            'id': user_id,
            'username': username,
            'email': email,
            'role': role
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password!'}), 400
    
    email = data['email']
    password = data['password']
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if not user or not check_password_hash(user['password'], password):
        conn.close()
        return jsonify({'message': 'Invalid email or password!'}), 401
    
    user_dict = dict(user)
    conn.close()
    
    token = generate_token(user_dict['id'])
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': user_dict['id'],
            'username': user_dict['username'],
            'email': user_dict['email'],
            'role': user_dict['role']
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({
        'id': current_user['id'],
        'username': current_user['username'],
        'email': current_user['email'],
        'role': current_user['role']
    }), 200

# GitHub Projects API
@app.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    if current_user['role'] != 'talent':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    conn = get_db_connection()
    projects = conn.execute('SELECT * FROM projects WHERE user_id = ?', (current_user['id'],)).fetchall()
    conn.close()
    
    return jsonify({
        'projects': [dict(project) for project in projects]
    }), 200

@app.route('/api/projects', methods=['POST'])
@token_required
def add_project(current_user):
    if current_user['role'] != 'talent':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('url'):
        return jsonify({'message': 'Missing project URL!'}), 400
    
    url = data['url']
    
    # In a real app, we would fetch repository data from GitHub API
    # For now, we'll extract the name from the URL
    repo_name = url.split('/')[-1]
    if not repo_name:
        repo_name = url.split('/')[-2]
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO projects (user_id, name, url, description, languages, last_analyzed) VALUES (?, ?, ?, ?, ?, ?)',
        (current_user['id'], repo_name, url, 'Repository description', json.dumps(['JavaScript', 'TypeScript']), datetime.now().isoformat())
    )
    conn.commit()
    
    project_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    project = conn.execute('SELECT * FROM projects WHERE id = ?', (project_id,)).fetchone()
    conn.close()
    
    return jsonify({
        'message': 'Project added successfully!',
        'project': dict(project)
    }), 201

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    if current_user['role'] != 'talent':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    conn = get_db_connection()
    project = conn.execute('SELECT * FROM projects WHERE id = ? AND user_id = ?', (project_id, current_user['id'])).fetchone()
    
    if not project:
        conn.close()
        return jsonify({'message': 'Project not found!'}), 404
    
    conn.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Project deleted successfully!'}), 200

# Jobs API
@app.route('/api/jobs', methods=['GET'])
@token_required
def get_jobs(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    conn = get_db_connection()
    jobs = conn.execute('SELECT * FROM jobs WHERE user_id = ?', (current_user['id'],)).fetchall()
    conn.close()
    
    return jsonify({
        'jobs': [dict(job) for job in jobs]
    }), 200

@app.route('/api/jobs', methods=['POST'])
@token_required
def add_job(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'message': 'Missing required fields!'}), 400
    
    title = data['title']
    company = data.get('company', current_user['username'])
    description = data['description']
    requirements = data.get('requirements', [])
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO jobs (user_id, title, company, description, requirements, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        (current_user['id'], title, company, description, json.dumps(requirements), datetime.now().isoformat())
    )
    conn.commit()
    
    job_id = conn.execute('SELECT last_insert_rowid()').fetchone()[0]
    job = conn.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    conn.close()
    
    return jsonify({
        'message': 'Job added successfully!',
        'job': dict(job)
    }), 201

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
@token_required
def delete_job(current_user, job_id):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    conn = get_db_connection()
    job = conn.execute('SELECT * FROM jobs WHERE id = ? AND user_id = ?', (job_id, current_user['id'])).fetchone()
    
    if not job:
        conn.close()
        return jsonify({'message': 'Job not found!'}), 404
    
    conn.execute('DELETE FROM jobs WHERE id = ?', (job_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Job deleted successfully!'}), 200

# Matching API
@app.route('/api/match/project-to-jobs', methods=['POST'])
@token_required
def match_project_to_jobs(current_user):
    if current_user['role'] != 'talent':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('project_id'):
        return jsonify({'message': 'Missing project ID!'}), 400
    
    project_id = data['project_id']
    
    conn = get_db_connection()
    project = conn.execute('SELECT * FROM projects WHERE id = ? AND user_id = ?', (project_id, current_user['id'])).fetchone()
    
    if not project:
        conn.close()
        return jsonify({'message': 'Project not found!'}), 404
    
    # Get all jobs from the database
    jobs = conn.execute('SELECT * FROM jobs').fetchall()
    conn.close()
    
    if not jobs:
        return jsonify({'message': 'No jobs found!'}), 404
    
    # Use the CrewAI matcher to analyze and match
    results = matcher.match_project_to_jobs(dict(project), [dict(job) for job in jobs])
    
    return jsonify(results), 200

@app.route('/api/match/job-to-projects', methods=['POST'])
@token_required
def match_job_to_projects(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('job_id'):
        return jsonify({'message': 'Missing job ID!'}), 400
    
    job_id = data['job_id']
    
    conn = get_db_connection()
    job = conn.execute('SELECT * FROM jobs WHERE id = ? AND user_id = ?', (job_id, current_user['id'])).fetchone()
    
    if not job:
        conn.close()
        return jsonify({'message': 'Job not found!'}), 404
    
    # Get all projects from the database
    projects = conn.execute('SELECT p.*, u.username FROM projects p JOIN users u ON p.user_id = u.id').fetchall()
    conn.close()
    
    if not projects:
        return jsonify({'message': 'No projects found!'}), 404
    
    # Use the CrewAI matcher to analyze and match
    results = matcher.match_job_to_projects(dict(job), [dict(project) for project in projects])
    
    return jsonify(results), 200

# Job Scraping API
@app.route('/api/scrape/url', methods=['POST'])
@token_required
def scrape_url(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('url'):
        return jsonify({'message': 'Missing URL!'}), 400
    
    url = data['url']
    
    # Use the CrewAI scraper to scrape job listings
    results = scraper.scrape_url(url)
    
    return jsonify(results), 200

@app.route('/api/scrape/batch', methods=['POST'])
@token_required
def scrape_batch(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('keywords'):
        return jsonify({'message': 'Missing keywords!'}), 400
    
    keywords = data['keywords']
    
    # Use the CrewAI scraper to scrape job listings
    results = scraper.scrape_batch(keywords)
    
    return jsonify(results), 200

@app.route('/api/scrape/save', methods=['POST'])
@token_required
def save_scraped_jobs(current_user):
    if current_user['role'] != 'company':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    data = request.json
    
    if not data or not data.get('jobs'):
        return jsonify({'message': 'Missing jobs!'}), 400
    
    jobs = data['jobs']
    
    conn = get_db_connection()
    
    for job in jobs:
        if job.get('status') == 'success':
            conn.execute(
                'INSERT INTO jobs (user_id, title, company, description, requirements, source_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (current_user['id'], job['title'], job['company'], job['description'], json.dumps([]), job['url'], datetime.now().isoformat())
            )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Jobs saved successfully!'}), 200

if __name__ == '__main__':
    # Check if database exists, if not create it
    if not os.path.exists(app.config['DATABASE']):
        init_db()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
