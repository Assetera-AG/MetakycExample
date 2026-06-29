# MetaKYC SDK Demo Application

This is a demo application showcasing the MetaKYC SDK for due diligence workflows.

## Features

- Dynamic applicant creation with configurable form fields
- Complete KYC workflow with multiple steps
- Identity verification integration (Sumsub, Onfido, SardinAI)
- Questionnaire and risk scoring
- Document upload
- Appropriateness testing
- Investor categorization
- Overview and results display

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Update `.env` with your API credentials:

```env
VITE_METAKYC_API_KEY=your-api-key
VITE_TENANT_ID=1
VITE_METAKYC_BASE_URL=http://localhost:44302
VITE_ENDPOINT_PATTERN=host-controller

# Optional: SardinAI Configuration
VITE_SARDINAI_CLIENT_ID=your-client-id
VITE_SARDINAI_ENVIRONMENT=sandbox
VITE_SARDINAI_REGION=us
```

### 3. Customize Applicant Form (Optional)

The applicant creation form is configurable in `src/App.tsx`:

```typescript
const config = {
  // ... other config
  applicantForm: {
    workflowKey: 'INDIVIDUAL_KYC', // Required: default workflow for applicants
    visibleFields: [
      'firstName',
      'lastName',
      'email',
      'phonenumber',
      'dateOfBirth',
      'country',
      // Add or remove fields as needed
    ],
  },
};
```

**Workflow Key**: Determines which due diligence workflow applicants follow. Can be overridden per form instance. The workflow can also change dynamically during the process based on risk assessment or user responses.

See `src/config/form-fields.example.ts` for pre-configured field sets:
- `MINIMAL_FIELDS`: Only essential fields
- `STANDARD_FIELDS`: Common fields for most use cases
- `EXTENDED_FIELDS`: Includes additional details
- `ALL_FIELDS`: All available fields
- `TAX_FOCUSED_FIELDS`: Tax compliance focused
- `BUSINESS_REFERENCE_FIELDS`: Business reference tracking

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Form Fields

You can configure which fields appear in the applicant creation form:

- `firstName` - First Name (required)
- `lastName` - Last Name (required)
- `title` - Title
- `salutation` - Salutation (Male/Female/Other)
- `email` - Email Address (required)
- `phonenumber` - Phone Number (required)
- `mobileCountryCode` - Mobile Country Code
- `dateOfBirth` - Date of Birth
- `placeOfBirth` - Place of Birth
- `countryOfBirth` - Country of Birth
- `street` - Street Address
- `streetNumber` - Street Number
- `zip` - ZIP/Postal Code
- `city` - City
- `country` - Country
- `nationality` - Nationality
- `otherNationality` - Other Nationalities
- `defaultLanguage` - Default Language
- `taxCountry` - Tax Country
- `taxNumber` - Tax Number
- `occupation` - Occupation
- `educationLevel` - Education Level
- `externalRefId` - External Reference ID

## Usage

### Creating a New Applicant

1. Click "Create New Applicant"
2. Fill in the visible form fields
3. Submit to create the applicant and start the KYC workflow

### Continuing an Existing Application

1. Enter the applicant ID
2. Click "Continue Verification"
3. Resume where you left off

### Configuring Visible Fields

Edit `src/App.tsx` and modify the `applicantForm.visibleFields` array:

```typescript
const config = {
  applicantForm: {
    visibleFields: [
      'firstName',
      'lastName',
      'email',
      'phonenumber',
      // Add more fields here
    ],
  },
};
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Endpoint Patterns

The SDK supports two endpoint patterns:

1. **host-controller** (default): `/api/[Controller]/[Action]`
2. **application-service**: `/services/app/[Service]/[Method]`

Configure this in the `.env` file or in `App.tsx`.

## Identity Providers

### SardinAI

Configure SardinAI in your environment variables:

```env
VITE_SARDINAI_CLIENT_ID=your-client-id
VITE_SARDINAI_ENVIRONMENT=sandbox
VITE_SARDINAI_REGION=us
```

### Sumsub

Sumsub integration is configured on the API side. No additional client configuration needed.

### Onfido

Onfido integration is configured on the API side. No additional client configuration needed.

## Troubleshooting

### Form Fields Not Showing

Make sure the field names in `visibleFields` match the exact field names listed above (case-sensitive).

### API Connection Issues

Check that:
- `VITE_METAKYC_BASE_URL` is correct
- `VITE_METAKYC_API_KEY` is valid
- `VITE_TENANT_ID` is correct
- The API server is running

### Identity Verification Errors

If you see expired session errors:
1. Click "Restart Verification" 
2. The SDK will automatically request a new session

## Documentation

For complete SDK documentation, see the [SDK repository](../metakyc-sdk/README.md).

For form configuration details, see [DYNAMIC_FORM_CONFIG.md](../metakyc-sdk/DYNAMIC_FORM_CONFIG.md).
