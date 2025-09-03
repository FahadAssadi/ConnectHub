# ConnectHub API Registration Routes

This document outlines the comprehensive registration API routes for the ConnectHub B2B marketplace platform.

## Overview

The registration system supports multi-stage registration flows with progress saving for both BD Partners and Companies. The system is dynamic and allows users to complete registration in multiple sessions while tracking their progress.

## Base URL
```
http://localhost:5000/api/registration
```

## Authentication
All routes require user authentication via the `X-User-ID` header (Better Auth user ID).

## Registration Flow Types

### BD Partner Registration Stages
1. **basic_info** - Personal and contact details
2. **professional** - Experience and availability
3. **expertise** - Industries and expertise areas
4. **verification** - Documents and verification

### Company Registration Stages
1. **company_info** - Basic company details
2. **contact_info** - Primary contact and address
3. **business_details** - Target markets and business model
4. **partnership_goals** - Partnership objectives and expectations
5. **verification** - Documents and verification

## API Endpoints

### 1. Get Registration Progress
```
GET /progress/:userId
```

**Description**: Retrieves the current registration progress for a user.

**Parameters**:
- `userId` (path): Better Auth user ID

**Response**:
```json
{
  "success": true,
  "data": {
    "userProfile": { /* user profile data */ },
    "registrationData": { /* BD partner or company data */ },
    "completedStages": ["basic_info", "professional"],
    "profileCompleteness": 50,
    "isComplete": false,
    "nextStage": "expertise"
  }
}
```

### 2. Save Registration Stage
```
POST /stage
```

**Description**: Saves data for a specific registration stage.

**Request Body**:
```json
{
  "userId": "user-uuid",
  "userType": "bd_partner", // or "company"
  "stage": "basic_info",
  "data": {
    // Stage-specific data (see schemas below)
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Stage basic_info completed successfully",
  "stage": "basic_info"
}
```

### 3. Get Registration Stages
```
GET /stages/:userType
```

**Description**: Gets the list of registration stages for a user type.

**Parameters**:
- `userType` (path): "bd_partner" or "company"

**Response**:
```json
{
  "success": true,
  "data": {
    "userType": "bd_partner",
    "stages": [
      {
        "id": "basic_info",
        "title": "Basic Information",
        "description": "Personal and contact details",
        "fields": ["fullName", "email", "phone", "country", "city"]
      }
      // ... more stages
    ],
    "totalStages": 4
  }
}
```

### 4. Reset Registration
```
DELETE /reset/:userId
```

**Description**: Resets all registration data for a user.

**Parameters**:
- `userId` (path): Better Auth user ID

**Response**:
```json
{
  "success": true,
  "message": "Registration data reset successfully"
}
```

## Stage Data Schemas

### BD Partner Stages

#### Stage 1: basic_info
```json
{
  "fullName": "John Doe",
  "displayName": "John D.",
  "title": "Senior Business Development Manager",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "United States",
  "city": "New York",
  "state": "NY",
  "timezone": "America/New_York"
}
```

#### Stage 2: professional
```json
{
  "bio": "Experienced BD professional with 10+ years...",
  "professionalBackground": "Previously worked at...",
  "availability": "full_time", // part_time, full_time, flexible, project_based
  "availabilityHours": 40,
  "hourlyRate": "150",
  "languages": ["English", "Spanish", "French"]
}
```

#### Stage 3: expertise
```json
{
  "industries": ["technology", "healthcare"],
  "expertiseAreas": [
    {
      "industry": "technology",
      "level": "expert", // beginner, intermediate, advanced, expert
      "yearsOfExperience": 8,
      "description": "Enterprise software sales"
    }
  ],
  "regions": ["north_america", "europe"]
}
```

#### Stage 4: verification
```json
{
  "documents": [
    {
      "type": "cv", // cv, portfolio, profile, certification, reference
      "fileName": "john_doe_cv.pdf",
      "filePath": "/uploads/docs/john_doe_cv.pdf",
      "fileSize": 1024576,
      "description": "Updated CV"
    }
  ],
  "backgroundCheckConsent": true,
  "termsAccepted": true,
  "privacyAccepted": true
}
```

### Company Stages

#### Stage 1: company_info
```json
{
  "companyName": "TechCorp Inc.",
  "registrationNumber": "REG123456",
  "taxId": "TAX789012",
  "industry": "technology",
  "businessType": "enterprise", // startup, sme, enterprise, corporation, non_profit, government
  "companySize": "large", // micro, small, medium, large, enterprise
  "foundedYear": 2010,
  "website": "https://techcorp.com",
  "description": "Leading software company specializing in..."
}
```

#### Stage 2: contact_info
```json
{
  "primaryContactName": "Jane Smith",
  "primaryContactTitle": "VP of Business Development",
  "primaryContactEmail": "jane@techcorp.com",
  "primaryContactPhone": "+1234567890",
  "country": "United States",
  "city": "San Francisco",
  "state": "CA",
  "address": "123 Market Street, Suite 100",
  "postalCode": "94105"
}
```

#### Stage 3: business_details
```json
{
  "targetMarkets": ["north_america", "europe"],
  "customerTypes": ["enterprise", "sme"],
  "businessModel": "SaaS platform with enterprise licensing...",
  "revenueRange": "10M-50M",
  "employeeCount": 250,
  "mainProducts": ["CRM Software", "Analytics Platform", "API Services"]
}
```

#### Stage 4: partnership_goals
```json
{
  "partnershipObjectives": ["market_expansion", "lead_generation"],
  "expectedPartnerTypes": ["industry_experts", "regional_specialists"],
  "commissionStructure": {
    "type": "percentage", // percentage, fixed, tiered, custom
    "value": "15%",
    "details": "15% commission on first year revenue"
  },
  "dealSizeExpectations": "100k_500k",
  "timelineExpectations": "3-6 months",
  "exclusivityPreferences": false
}
```

#### Stage 5: verification
```json
{
  "documents": [
    {
      "type": "logo", // logo, profile, deck, brochure, certification, agreement, financial, legal
      "fileName": "company_logo.png",
      "filePath": "/uploads/docs/company_logo.png",
      "fileSize": 512000,
      "description": "Official company logo"
    }
  ],
  "businessLicenseNumber": "BL123456",
  "taxCertification": true,
  "termsAccepted": true,
  "privacyAccepted": true
}
```

## Progress Tracking

The system automatically tracks:
- **Profile Completeness**: Percentage based on completed stages
- **Completed Stages**: Array of stage IDs that have been completed
- **Next Stage**: The next stage to complete (null if all completed)
- **Onboarding Status**: Whether the full registration is complete

## Validation

Each stage has comprehensive validation using Zod schemas:
- **Required fields**: Enforced at the API level
- **Data types**: String, number, boolean, array validation
- **Format validation**: Email, phone, URL validation
- **Business rules**: Minimum lengths, value ranges, enum constraints

## Error Handling

The API returns detailed error information for validation failures:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "bio",
      "message": "Bio must be at least 50 characters"
    }
  ]
}
```

## Activity Logging

All registration activities are logged to the `user_activity_log` table:
- Stage completions
- Registration resets
- Profile updates

## Usage Examples

### Frontend Integration

```javascript
// Get registration progress
const getProgress = async (userId) => {
  const response = await fetch(`/api/registration/progress/${userId}`, {
    headers: { 'X-User-ID': userId }
  });
  return response.json();
};

// Save stage data
const saveStage = async (userId, userType, stage, data) => {
  const response = await fetch('/api/registration/stage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId
    },
    body: JSON.stringify({ userId, userType, stage, data })
  });
  return response.json();
};

// Get available stages
const getStages = async (userType) => {
  const response = await fetch(`/api/registration/stages/${userType}`);
  return response.json();
};
```

### Multi-Stage Form Flow

1. **Initialize**: Get user's current progress
2. **Display**: Show appropriate stage form based on progress
3. **Validate**: Client-side validation before submission
4. **Save**: Submit stage data via API
5. **Navigate**: Move to next stage or show completion
6. **Track**: Update progress indicators

## Database Schema

The registration system uses these primary tables:
- `user_profiles`: Core user profile information
- `bd_partners`: BD Partner specific data
- `companies`: Company specific data
- `user_activity_log`: Activity tracking

All tables include proper indexing for performance and audit timestamps for tracking changes.

## Security Considerations

- **Authentication**: All routes require valid user authentication
- **Authorization**: Users can only modify their own registration data
- **Data Validation**: Comprehensive server-side validation
- **File Uploads**: Secure file handling with type and size validation
- **Audit Trail**: Complete activity logging for compliance

## Future Enhancements

- **Auto-save**: Automatic saving of form data as user types
- **Resume Links**: Email links to resume registration process
- **Bulk Upload**: CSV/Excel import for company data
- **API Webhooks**: Integration with external systems
- **Mobile Optimization**: Mobile-specific registration flows
