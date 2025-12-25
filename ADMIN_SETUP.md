# Quick Admin Creation Guide

Since the seed script is having issues with tsx, you can create the admin account using the protected admin registration endpoint:

## Method 1: Using the Browser Console

1. Open your browser and navigate to: `http://localhost:9002`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Paste and run this code:

```javascript
fetch('http://localhost:9002/api/auth/admin-register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@hiigsi.com',
    password: 'Admin@123456',
    firstName: 'Super',
    lastName: 'Admin',
    secretKey: 'your-super-secret-admin-key-change-in-production'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

## Method 2: Using PowerShell

Run this command in PowerShell:

```powershell
$body = @{
    email = "admin@hiigsi.com"
    password = "Admin@123456"
    firstName = "Super"
    lastName = "Admin"
    secretKey = "your-super-secret-admin-key-change-in-production"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:9002/api/auth/admin-register" -Method POST -Body $body -ContentType "application/json"
```

## Method 3: Using Postman or Thunder Client

1. Create a new POST request
2. URL: `http://localhost:9002/api/auth/admin-register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "admin@hiigsi.com",
  "password": "Admin@123456",
  "firstName": "Super",
  "lastName": "Admin",
  "secretKey": "your-super-secret-admin-key-change-in-production"
}
```

## After Creating Admin

Once the admin is created, you can login at:
- URL: `http://localhost:9002/sign-in`
- Email: `admin@hiigsi.com`
- Password: `Admin@123456`

You should be redirected to `/dashboard/admin` after successful login.
