# Admin Access Guide

## Admin Dashboard Access

The admin dashboard is available at: `/admin`

### Admin Login Credentials

To access the admin dashboard, login with:
- **Email**: `admin@ezbillify.com`
- **Password**: Set during first registration

**Important**: When you login with the admin email, you will be automatically redirected to the Admin Dashboard instead of the regular user dashboard.

### First Time Setup

1. Go to `/register` and create an account with email: `admin@ezbillify.com`
2. The system will automatically mark this user as admin
3. Login with these credentials - you'll be redirected to `/admin`
4. The "Admin" link will appear in the header for admin users

### Admin Features

1. **Dashboard Tab**
   - Real-time statistics (users, documents, accuracy)
   - System uptime monitoring
   - Recent activity feed

2. **Users Tab**
   - View all registered users
   - See login activity and timestamps
   - Track documents uploaded per user
   - User status management (active/inactive)
   - Ability to view or disable users

3. **Documents Tab**
   - View all uploaded documents
   - Filter by status (processed, processing, failed)
   - See accuracy scores for each document
   - Retrain AI model on specific documents
   - Search functionality

4. **Form Database Tab**
   - Manage 30+ government forms
   - Manage 10+ bank forms
   - Add new forms to the database
   - Configure form detection keywords
   - Set expected fields for each form

5. **AI Training Tab**
   - View current model performance
   - Start new training sessions
   - Export training data
   - View training history
   - Monitor training samples count

6. **Analytics Tab**
   - Daily active users chart
   - Documents processed by form type
   - Model accuracy trends over time
   - Usage analytics

### Adding New Forms

1. Go to Admin Dashboard → Form Database tab
2. Click "Add New Form"
3. Fill in:
   - Form Name (e.g., "Aadhaar Update Form")
   - Category (Identity, Tax, Business, Banking, Transport)
   - Authority (e.g., "UIDAI")
   - Keywords (comma-separated for detection)
   - Expected Fields (comma-separated)
4. Click "Add Form"

### Training the AI System

1. Go to Admin Dashboard → AI Training tab
2. Click "Start New Training Session"
3. Confirm the training (note: this will use AWS Bedrock resources)
4. System will be temporarily unavailable during training (15-30 minutes)

### Security Notes

- Admin access is restricted to users with email `admin@sahayak.ai` or `isAdmin: true` flag
- All admin actions should be logged for audit purposes
- In production, implement proper role-based access control (RBAC)
- Use environment variables for admin credentials
- Enable 2FA for admin accounts

### API Endpoints for Admin

The following Lambda functions should be created for admin functionality:

- `GET /admin/users` - List all users
- `GET /admin/documents` - List all documents
- `POST /admin/forms` - Add new form to database
- `POST /admin/train` - Start AI training session
- `GET /admin/analytics` - Get analytics data
- `PUT /admin/users/{userId}/status` - Update user status
- `POST /admin/documents/{documentId}/retrain` - Retrain on specific document
