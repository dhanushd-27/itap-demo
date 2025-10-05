# API Fields Used in the Frontend

## Overview
This document lists all the API fields that are used in the frontend when making requests to the backend.

## Backend API Endpoints Called by Frontend
The frontend in `backend/frontend.html` makes API requests to the backend at `http://localhost:8000/api/v1`:

### Scraping API Endpoint (`/scrape`)
The frontend calls this endpoint when submitting the manual scraping form:
- `page_ids`: Array of page IDs (comma-separated values from the textarea input)
- `country`: Country code (from the country input field)
- `ad_category`: Ad category (from the ad category input field)
- `max_pages`: Maximum number of pages (from the max pages input field)
- `include_page_name`: Boolean, whether to include page name (from the checkbox)
- `schedule`: Boolean, whether to schedule the job (from the schedule checkbox)
- `interval_days`: Interval in days if scheduling (from the interval days input field)

### Schedule API Endpoint (`/schedule`)
The frontend calls this endpoint when submitting the schedule form:
- `page_ids`: Array of page IDs (comma-separated values from the schedule textarea input)
- `country`: Country code (from the schedule country input field)
- `ad_category`: Ad category (from the schedule ad category input field)
- `max_pages`: Maximum number of pages (from the schedule max pages input field)
- `include_page_name`: Boolean, whether to include page name (from the schedule checkbox)
- `interval_days`: Interval in days (from the schedule interval input field)

### Jobs API Endpoints
The frontend calls these endpoints to manage scraping jobs:
- `GET /jobs`: Retrieves all jobs, returns an array of jobs with fields:
  - `job_id`: ID of the job
  - `status`: Status of the job
  - `page_ids`: Array of page IDs
  - `created_at`: When the job was created
- `GET /jobs/{job_id}`: Retrieves details of a specific job
- `DELETE /jobs/{job_id}`: Cancels a scheduled job

### Additional API Endpoints (defined in routes.py but not directly used in frontend.html)
- `GET /ads`: Gets paginated and filtered ads with query parameters:
  - `page`: Page number
  - `page_size`: Number of items per page
  - `last_active`: Filter by last active time
  - `running_since`: Filter by running duration
  - `company`: Filter by company name
  - `format_type`: Filter by ad format
  - `platform`: Filter by platform
  - `search`: Search term
- `GET /ads/companies`: Gets list of unique companies that have ads
- `GET /ads/filters`: Gets all available filter options