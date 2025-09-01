# Google Drive Integration Setup

To integrate with Google Drive API for saving uploaded dossiers to naresh.artillery@gmail.com:

## Backend API Setup Required

1. **Create Google Cloud Project**
   - Go to Google Cloud Console
   - Create new project or select existing
   - Enable Google Drive API

2. **Service Account Setup**
   - Create service account in Google Cloud Console
   - Download service account key (JSON file)
   - Share target Google Drive folder with service account email

3. **Backend API Endpoint** (`/api/upload-dossier`)
   \`\`\`javascript
   // Example Node.js/Next.js API route
   import { google } from 'googleapis';
   import formidable from 'formidable';
   
   export default async function handler(req, res) {
     if (req.method !== 'POST') return res.status(405).end();
     
     // Parse uploaded file
     const form = formidable();
     const [fields, files] = await form.parse(req);
     
     // Initialize Google Drive API
     const auth = new google.auth.GoogleAuth({
       keyFile: 'path/to/service-account-key.json',
       scopes: ['https://www.googleapis.com/auth/drive.file'],
     });
     
     const drive = google.drive({ version: 'v3', auth });
     
     // Upload to specific folder in naresh.artillery@gmail.com drive
     const response = await drive.files.create({
       requestBody: {
         name: `dossier_${Date.now()}.pdf`,
         parents: ['FOLDER_ID'], // Replace with actual folder ID
       },
       media: {
         mimeType: 'application/pdf',
         body: fs.createReadStream(files.file.filepath),
       },
     });
     
     res.json({ success: true, fileId: response.data.id });
   }
   \`\`\`

4. **Environment Variables**
   \`\`\`
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY=your-private-key
   GOOGLE_DRIVE_FOLDER_ID=target-folder-id
   \`\`\`

5. **Folder Permissions**
   - Share target Google Drive folder with service account email
   - Grant "Editor" permissions

## Security Considerations
- Store service account credentials securely
- Validate file types and sizes on backend
- Implement rate limiting
- Add authentication for API endpoints
