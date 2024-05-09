# JobBrowser Backend API Specifications

Backend for a jobs board website. All of the functionality below will be fully implemented in this project.

### Jobs

- List all Jobs in the database
  - Pagination
  - Select specific fields in result
  - Limit number of results
  - Filter by fields
- Search jobs by radius from postcode
  - Use a geocoder to get exact location and coords from a single address field
- Get single job post
- Create new job post
  - Authenticated users only
  - Must have the role "employer" or "admin"
  - Field validation via Mongoose
- Update job Posting
  - Owner only
  - Validation on update
- Delete job post
  - Owner only
- Link employers associated with the job post

### Job Applications

- Allow users to apply for a job posting by submitting/uploading their
  application details, such as a cover letter, resume/CV, and any additional information required by the employer.
  - Authenticated users only
- Implement validation to ensure that required fields are provided and that file uploads (e.g., resume/CV)
  meet size and format requirements.
- Send notifications to the employer when a new application is submitted.
- Update Application Status
  - Allow employers to update the status of job applications (e.g., shortlisted, interviewed, hired, rejected).
  - Send notifications to applicants when their application status changes.

### Reviews

- List all reviews for an employer
  - Pagination, filtering, etc
- Get a single review
- Create a review
  - Authenticated users only
  - Must have the role "user" or "admin" (not employer)
- Update review
  - Owner only
- Delete review
  - Owner only

### Users & Authentication

- Authentication will be using JWT/cookies
  - JWT and cookie should expire in 30 days
- User registration
  - Register as a "user" or "employer"
  - Once registered, a token will be sent along with a cookie (token = xxx)
  - Passwords must be hashed
- User login
  - User can login with email and password
  - Plain text password will compare with stored hashed password
  - Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  - Cookie will be sent to set token = none
- Get user
  - Route to get the currently logged in user (via token)
- Password reset (lost password)
  - User can request to reset password
  - A hashed token will be emailed to the users registered email address
  - A put request can be made to the generated url to reset password
  - The token will expire after 10 minutes
- Update user info
  - Authenticated user only
  - Separate route to update password
- User CRUD
  - Admin only
- Users can only be made admin by updating the database field manually
- Users can bookmark or save job listings that they are interested in for later viewing.
  - Authenticated user only
  - Must have the role "user" (not employer)
- Display a history of job listings that the user has applied for, along with the current status of their applications.
- Integrate a messaging system that allows users to communicate with each other, such as sending direct messages or inquiries about job opportunities.

## Security

- Encrypt passwords and reset tokens
- Prevent cross site scripting - XSS
- Prevent NoSQL injections
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param pollution
- Add headers for security (helmet)
- Use cors to make API public (for now)

## Documentation

- Use Postman to create documentation
- Use docgen to create HTML files from Postman
- Add html files as the / route for the api

## Deployment (Coolify - VPS)

- Push to Github
- Deploy from coolify on my current set up in the VPS using docker

## Code Related

- NPM scripts for dev and production env
- Config file for important constants
- Use controller methods with documented descriptions/routes
- Error handling middleware
- Authentication middleware for protecting routes and setting user roles
- Validation using Mongoose and no external libraries
- Use async/await (create middleware to clean up controller methods)
- Create a database seeder to import and destroy data
