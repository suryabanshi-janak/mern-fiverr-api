# FiverClone Node.js Backend

Welcome to FiverClone Node.js Backend, a simplified backend of a freelancing platform built using Node.js. This project is focused on showcasing fundamental backend features of a freelancing platform, providing a foundation for developers interested in building similar applications.

## Features

- **User Authentication:** Allow users to sign up, log in, and manage their profiles securely.
- **Job Listings:** Users can post jobs, browse available jobs, and apply for them.
- **Payment Integration:** Implement a basic payment system for transactions between clients and freelancers.
- **Messaging System:** Enable communication between clients and freelancers through a messaging system.
- **Review and Rating:** Allow clients and freelancers to leave reviews and ratings for each other.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/suryabanshi-janak/mern-fiverr-api.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd mern-fiverr-api
   ```

3. **Install dependencies:**

   ```bash
   yarn
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the root directory and add the following:
     ```env
     PORT=8000
     MONGODB_URI=your_mongodb_uri
     SESSION_SECRET=your_session_secret
     ```
   - Replace `your_mongodb_uri` and `your_session_secret` with your MongoDB URI and a secret key for session management.

5. **Start the application:**
   ```bash
   yarn start
   ```
   The application will be accessible at [http://localhost:8000](http://localhost:8000).
