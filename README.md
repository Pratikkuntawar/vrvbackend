### **Core Requirements**

- Implement an authentication system where users can register, log in, and log out securely.
- Implement authorization based on roles (e.g., Admin, User, Moderator). Ensure that each role has specific permissions to access certain resources or endpoints.
- Use secure methods such as JWT or OAuth for managing sessions and user authentication.
- Implement **Role-Based Access Control (RBAC)**, where the access to resources is determined based on the user's assigned role.

This backend project implements all above functionalities.

Backend Url: https://vrvbackend.onrender.com
you can access backend with the help of given url
**You must make use of postman while testing backend as it accepts authorisation token through postman in backend to check whether user is valid or not**.You can download postman from this url: https://www.postman.com/downloads/

**---------------------------------------------------------------------------------------------------**

**Steps**

Open Postman
Launch Postman on your system.

**To Test Register Route**
Create a New Request
Click the "New" button or on three dots and select " Add Request".
Choose the request type as POST.
Enter the endpoint URL:  https://vrvbackend.onrender.com/api/auth/register
Set the Request Body
Go to the "Body" tab in Postman.
Select "raw" and change the format to JSON.
Input the required data in JSON format. For example:


{
  "name": "Johny Doe",
  "email": "johny.doe@example.com",
  "password": "securepassword",
  "role": "User"
}


Note: The "role" field should be one of the following: "Admin", "User", or "Moderator".

Send the Request
Click "Send" to submit the request. The backend will process it and return a response.

Check the Response
**Successful Registration (201):**
{
  "message": "User registered successfully!"
}

**Email Already Registered (400):**
{
  "message": "User is already registered with the name: John Doe"
}

**Missing Fields (400):**
{
  "message": "Invalid credentials. All fields are required."
}

**---------------------------------------------------------------------------------------------------**

**To Test Login Route**

Create a new request in Postman.
Set the request method to POST.
Enter the endpoint URL: https://vrvbackend.onrender.com/api/auth/login
Set the Request Body
Navigate to the Body tab in Postman.
Select raw and set the format to JSON.
Provide valid login details in JSON format. Example:

{
  "email": "johny.doe@example.com",
  "password": "securepassword"
}
Send the Request
Click Send to make the POST request.

**After a successful login, copy the "token" value from the response. You will need this token to access protected routes.**

Check the Response
**Successful Login (200):**

{
  "message": "Login successful!",
  "token": "<JWT token>",
  "user": {
    "id": "<user ID>",
    "name": "John Doe",
    "role": "user"
  }
}

**User Not Found (404):**

{
  "message": "User not found!"
}

**Invalid Credentials (400):**

{
  "message": "Invalid credentials!"
}

**Missing Fields (400):**

{
  "message": "Please provide both email and password!"
}

**Server Error (500):**

{
  "error": "Internal server error"
}

**---------------------------------------------------------------------------------------------------**

**To Test Logout Route**
Create a New Request
Create a new request in Postman.
Set the request method to POST.
Enter the endpoint URL: https://vrvbackend.onrender.com/api/auth/logout

Add an Authorization Header
Go to the Headers tab in Postman.
Select Auth Type as **Bearer Token**
Bearer <your JWT token>
Replace <your JWT token> with a valid token you received after logging in ,in right hand side.

Send the Request
Click Send to submit the request.
**Note: The token used for logout is added to a blacklist, preventing further use of the token for authentication**

Check the Response
**Successful Logout (200):**

{
  "message": "Logged out successfully!"
}

**No Token Provided (400):**

{
  "message": "No token provided. You need to log in first."
}

**Invalid Token (400):**

{
  "message": "Invalid token. Please log in again."
}

**Expired Token (400):**

{
  "message": "Token expired. Please log in again."
}

**Server Error (500):**

{
  "error": "Failed to log out. Please try again later."
}

**---------------------------------------------------------------------------------------------------**

**Authorization**
Authentication Middleware (auth.js)
The auth middleware ensures that routes are protected by verifying JSON Web Tokens (JWTs) and checking for blacklisted tokens.

Functionality Overview
Token Validation: Ensures that the incoming request contains a valid JWT token in the Authorization header.
Token Blacklist Check: Verifies if the token is blacklisted (e.g., after logout) by querying the TokenBlacklist database.
Error Handling: Handles errors such as missing, invalid, or blacklisted tokens.
User Verification: Decodes the token and attaches the user information to req.user for use in subsequent route handlers.
**Enhancement: Mention that the auth.js middleware verifies the token first, and then roleAuth.js checks the role.**

**---------------------------------------------------------------------------------------------------**

**Role Based Authorisation Middleware**
Role-Based Authorization Middleware (roleAuth.js)
The roleAuth middleware restricts access to specific routes based on the user's role. It ensures that only users with the required roles can access certain endpoints.

Functionality Overview
Role-Based Access Control (RBAC): Validates whether the logged-in user's role matches the required roles for accessing the route.
Admin Privileges: Grants all-access permissions to users with the "Admin" role.
Customizable Roles: Accepts a list of roles that are allowed to access a particular route.
**Admin can access all routes including "public route,user route,admin route,moderator route"**
**User can access only user route and public route can't access admin and moderator route**
**moderator can access only moderator and public route cant access admin and user route**


**Admin Route**:
- **Accessible by**: Admin only

**User Route**:
- **Accessible by**: User and Admin

**Moderator Route**:
- **Accessible by**: Moderator and Admin
**Admin can access all routes**
**---------------------------------------------------------------------------------------------------**
  
**Public Route:Accesed to All**
Method:GET
URL: https://vrvbackend.onrender.com/api/protected/public
No token is required for this route.
Response:

{
  "message": "Public route!"
}

**---------------------------------------------------------------------------------------------------**

**Admin Route:Accessed By Only Admin**

URL: https://vrvbackend.onrender.com/api/protected/admin
Method:Get
Go to Authorisation in postman in given request
Authorization:Select Bearer token and exter valid token in right hand side
**Expected Response (if token is valid and role is Admin):**

{
  "message": "Welcome to Admin Route!"
}
**If no token or incorrect role:**
{
  "message": "Access Forbidden: Insufficient Permissions!"
}

**---------------------------------------------------------------------------------------------------**

**User Route:Accessed by Only User and Admin**

URL: https://vrvbackend.onrender.com/api/protected/user
Method:Get
Go to Authorisation in postman in given request
Authorization:Select Bearer token and exter valid token in right hand side
**Expected Response (if token is valid and role is Admin):**

{
  "message": "Welcome to User Route!"
}
**If no token or incorrect role:**

{
  "message": "Access Forbidden: Insufficient Permissions!"
}

**---------------------------------------------------------------------------------------------------**

**User Route:Accessed by Only moderator and Admin**

URL: https://vrvbackend.onrender.com/api/protected/moderator
Method:Get
Go to Authorisation in postman in given request
Authorization:Select Bearer token and exter valid token in right hand side

**Expected Response (if token is valid and role is Admin):**

{
  "message": "Welcome to Moderator Route!"
}

**If no token or incorrect role:**

{
  "message": "Access Forbidden: Insufficient Permissions!"
}
