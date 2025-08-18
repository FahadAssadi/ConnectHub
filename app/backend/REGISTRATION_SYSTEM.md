# ConnectHub Multi-Stage Registration System

## Overview

This is a comprehensive multi-stage registration system for ConnectHub that handles different user types with varying registration requirements and access controls.

## User Types

1. **Company** - Businesses that want to post products/services and find BD partners
2. **BD Partner Individual** - Individual business development professionals
3. **BD Partner Company** - Companies specializing in business development services

## Database Schema Structure

### Core Tables

#### `user_profile`

- Extends the auth user with registration tracking
- Tracks registration status, current stage, and marketplace access
- Links to the better-auth user table

#### `registration_stage`

- Tracks completion status of each registration stage
- Stores stage-specific data as JSON
- Enables granular progress tracking

### User-Specific Tables

#### Company Tables

- `company_details` - Basic company information (Stage 1)
- `primary_contact` - Contact person details (Stage 2)
- `company_overview` - Company description, logo, etc. (Stage 3)

#### BD Partner Tables

- `bd_partner_individual` - Individual BD partner details
- `bd_partner_company` - Company BD partner details
- `professional_background` - Experience, expertise, certifications
- `engagement_preferences` - Preferred engagement types and capacity

#### Shared Tables

- `user_document` - File uploads (resumes, licenses, etc.)
- `product_document` - Sales materials for products
- `legal_agreement` - NDAs, partnership agreements
- `product` - Products/services posted by companies
- `bd_partner_application` - Applications from BD partners to products

## Registration Flow

### Company Registration (4 Stages)

1. **Company Details** - Name, registration, industry, location
2. **Primary Contact** - Contact person information
3. **Company Overview** - Description, logo, website
4. **Legal & Agreement** - NDA acceptance

### BD Partner Individual (4 Stages)

1. **Personal Details** - Name, contact, location
2. **Professional Background** - Experience, expertise, certifications
3. **Engagement Preferences** - Types of engagement, availability
4. **Documents & Declarations** - Resume, ID proof, agreements

### BD Partner Company (4 Stages)

1. **Company Details** - Company information
2. **Contact Person & Professional Background** - Combined stage
3. **Engagement Preferences** - Engagement types, capacity
4. **Documents & Declarations** - Company profile, business license

## Access Control Logic

### Marketplace Access

- **Companies**: Must complete full registration and be approved
- **BD Partners**: Can browse with incomplete profile, but need completion to apply

### Application Access

- Only BD Partners can apply to products
- Must have completed registration and be approved

### Registration Redirects

- Incomplete users redirected to current stage
- Pending users see pending approval page
- Rejected users see rejection notice

## API Endpoints

### Registration APIs

- `POST /api/registration/initialize` - Start registration with user type
- `GET /api/registration/status` - Get current registration status
- `POST /api/registration/stage/:stageNumber` - Complete a stage
- `GET /api/registration/stage/:stageNumber/config` - Get stage configuration
- `GET /api/registration/marketplace-access` - Check marketplace access
- `GET /api/registration/application-access` - Check application access

### Product APIs

- `GET /api/products` - List all products (marketplace)
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/apply` - Apply to product (BD Partners only)
- `GET /api/products/my-applications` - Get BD Partner's applications

### Auth APIs

- Handled by better-auth at `/api/auth/**`

## Key Features

### Modular Schema Design

- Separate files for different concerns (auth, company, BD partners, products, documents)
- Enums for consistent data types
- Proper foreign key relationships

### Flexible Stage System

- Configurable stages per user type
- JSON storage for stage-specific data
- Validation rules per stage

### Access Control Middleware

- Authentication verification
- Registration status checking
- Role-based access control
- Proper error responses with redirect guidance

### Registration Manager

- Centralized business logic
- Stage progression tracking
- Validation and completion handling
- Access permission checking

## Implementation Benefits

1. **Scalable**: Easy to add new user types or modify stages
2. **Secure**: Proper access controls and validation
3. **User-Friendly**: Clear progression tracking and redirects
4. **Maintainable**: Modular code structure with separation of concerns
5. **Type-Safe**: Full TypeScript support with proper types

## Database Relationships

```
user (better-auth)
├── user_profile (1:1)
    ├── registration_stage (1:many)
    ├── user_document (1:many)
    ├── legal_agreement (1:many)
    ├── company_details (1:1, if company)
    │   ├── primary_contact (1:1)
    │   └── company_overview (1:1)
    ├── bd_partner_individual (1:1, if individual)
    ├── bd_partner_company (1:1, if BD partner company)
    ├── professional_background (1:1, if BD partner)
    ├── engagement_preferences (1:1, if BD partner)
    ├── product (1:many, if company)
    │   ├── product_document (1:many)
    │   └── bd_partner_application (1:many)
    └── bd_partner_application (1:many, if BD partner)
```

This design provides a robust, scalable foundation for the ConnectHub platform's multi-stage registration system.
