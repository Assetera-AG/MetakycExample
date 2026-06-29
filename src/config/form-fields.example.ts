/**
 * Example configuration for visible applicant form fields
 * 
 * Customize this file to control which fields appear in your
 * applicant creation form. Copy this to form-fields.ts and
 * import it in your App.tsx
 */

/**
 * EXAMPLE 1: Minimal form (only essential fields)
 */
export const MINIMAL_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
] as const;

/**
 * EXAMPLE 2: Standard form (common fields for most use cases)
 */
export const STANDARD_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
  'dateOfBirth',
  'street',
  'streetNumber',
  'zip',
  'city',
  'country',
  'nationality',
  'taxCountry',
  'taxNumber',
] as const;

/**
 * EXAMPLE 3: Extended form (includes additional details)
 */
export const EXTENDED_FIELDS = [
  'firstName',
  'lastName',
  'title',
  'salutation',
  'email',
  'phonenumber',
  'mobileCountryCode',
  'dateOfBirth',
  'placeOfBirth',
  'countryOfBirth',
  'street',
  'streetNumber',
  'zip',
  'city',
  'country',
  'nationality',
  'otherNationality',
  'taxCountry',
  'taxNumber',
  'occupation',
  'educationLevel',
] as const;

/**
 * EXAMPLE 4: Full form (all available fields)
 */
export const ALL_FIELDS = [
  'firstName',
  'lastName',
  'title',
  'salutation',
  'email',
  'phonenumber',
  'mobileCountryCode',
  'dateOfBirth',
  'placeOfBirth',
  'countryOfBirth',
  'street',
  'streetNumber',
  'zip',
  'city',
  'country',
  'nationality',
  'otherNationality',
  'defaultLanguage',
  'taxCountry',
  'taxNumber',
  'occupation',
  'educationLevel',
  'externalRefId',
] as const;

/**
 * EXAMPLE 5: Tax compliance focused
 */
export const TAX_FOCUSED_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
  'dateOfBirth',
  'country',
  'nationality',
  'otherNationality',
  'taxCountry',
  'taxNumber',
  'placeOfBirth',
  'countryOfBirth',
] as const;

/**
 * EXAMPLE 6: Business reference tracking
 */
export const BUSINESS_REFERENCE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phonenumber',
  'country',
  'externalRefId',
] as const;

/**
 * Usage in App.tsx:
 * 
 * import { STANDARD_FIELDS } from './config/form-fields';
 * 
 * const config = {
 *   // ... other config
 *   applicantForm: {
 *     visibleFields: STANDARD_FIELDS,
 *   },
 * };
 */
