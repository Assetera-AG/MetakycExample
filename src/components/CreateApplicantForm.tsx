import { useState, useEffect } from 'react';
import { useApplicant, useMetaKYC, GenderType } from '@asseteragmbh/metakyc';
import { Card, CardHeader, CardContent, CardFooter, Input, Button, Select } from '@asseteragmbh/metakyc';

interface CreateApplicantFormProps {
  onSuccess: (applicantId: number) => void;
}

export default function CreateApplicantForm({ onSuccess }: CreateApplicantFormProps) {
  const { createApplicant, isLoading, error } = useApplicant();
  const { baseInformationService } = useMetaKYC();
  const [countries, setCountries] = useState<Array<{ value: string; label: string; id: number }>>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  
  const [formData, setFormData] = useState({
    workflowKey: '52284353-011e-448d-b00e-ae4e11f8a0f5',
    firstName: 'Sajjad',
    lastName: 'Ziyadloo',
    title: '',
    email: '',
    dateOfBirth: '',
    phonenumber: '',
    externalRefId: '',
    mobileCountryCode: '',
    street: '',
    streetNumber: '',
    zip: '',
    city: '',
    country: '',
    nationality: '',
    otherNationality: [] as string[],
    defaultLanguage: 'EN',
    taxCountry: '',
    placeOfBirth: '',
    countryOfBirth: '',
    salutation: null as GenderType | null,
    educationLevel: '',
    occupation: '',
    taxNumber: '',
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const data = await baseInformationService.getCountries('', 'en');
        
        // Create unique country options using 3-letter ISO code (abbreviation3)
        // Use a Set to track seen codes and avoid duplicates
        const seen = new Set<string>();
        const countryOptions = data
          .map((c) => {
            const code = c.abbreviation3 || c.abbreviation; // Prioritize 3-letter code
            return {
              value: code,
              label: c.name,
              id: c.id, // Keep ID for uniqueness
            };
          })
          .filter((c) => {
            // Filter out duplicates based on value
            if (!c.value || seen.has(c.value)) {
              return false;
            }
            seen.add(c.value);
            return true;
          });
        
        setCountries(countryOptions);
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, [baseInformationService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Build the request data - only include non-empty values
      const requestData: any = {
        workflowKey: formData.workflowKey,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phonenumber: formData.phonenumber,
      };

      // Add optional fields if they have values
      if (formData.title?.trim()) requestData.title = formData.title;
      if (formData.dateOfBirth?.trim()) requestData.dateOfBirth = formData.dateOfBirth;
      if (formData.externalRefId?.trim()) requestData.externalRefId = formData.externalRefId;
      if (formData.mobileCountryCode?.trim()) requestData.mobileCountryCode = formData.mobileCountryCode;
      if (formData.street?.trim()) requestData.street = formData.street;
      if (formData.streetNumber?.trim()) requestData.streetNumber = formData.streetNumber;
      if (formData.zip?.trim()) requestData.zip = formData.zip;
      if (formData.city?.trim()) requestData.city = formData.city;
      if (formData.country?.trim()) requestData.country = formData.country;
      if (formData.nationality?.trim()) requestData.nationality = formData.nationality;
      if (formData.otherNationality.length > 0) requestData.otherNationality = formData.otherNationality;
      if (formData.defaultLanguage?.trim()) requestData.defaultLanguage = formData.defaultLanguage;
      if (formData.taxCountry?.trim()) requestData.taxCountry = formData.taxCountry;
      if (formData.placeOfBirth?.trim()) requestData.placeOfBirth = formData.placeOfBirth;
      if (formData.countryOfBirth?.trim()) requestData.countryOfBirth = formData.countryOfBirth;
      if (formData.salutation !== null) requestData.salutation = formData.salutation;
      if (formData.educationLevel?.trim()) requestData.educationLevel = formData.educationLevel;
      if (formData.occupation?.trim()) requestData.occupation = formData.occupation;
      if (formData.taxNumber?.trim()) requestData.taxNumber = formData.taxNumber;

      console.log('Creating applicant with data:', requestData);
      const result = await createApplicant(requestData);
      console.log('Applicant created:', result);
      onSuccess(result.applicantId);
    } catch (err) {
      console.error('Error creating applicant:', err);
    }
  };

  const handleChange = (field: string, value: string | GenderType | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: GenderType.Male.toString(), label: 'Male' },
    { value: GenderType.Female.toString(), label: 'Female' },
    { value: GenderType.Other.toString(), label: 'Other' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Applicant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Fill out the form below to create an applicant and start the KYC verification process
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Workflow Configuration */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Workflow Configuration
              </h3>
              <Input
                label="Workflow Key"
                value={formData.workflowKey}
                onChange={(e) => handleChange('workflowKey', e.target.value)}
                required
                helperText="The workflow configuration key (e.g., INDIVIDUAL_KYC)"
              />
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="Salutation"
                    value={formData.salutation?.toString() || ''}
                    onChange={(e) => handleChange('salutation', e.target.value ? parseInt(e.target.value) as GenderType : null)}
                    options={genderOptions}
                  />
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Mr., Mrs., Dr., etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  helperText="Required for KYC verification"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Contact Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    label="Country Code"
                    value={formData.mobileCountryCode}
                    onChange={(e) => handleChange('mobileCountryCode', e.target.value)}
                    options={[
                      { value: '', label: 'Select' },
                      ...countries
                    ]}
                    disabled={isLoadingCountries}
                  />
                  <div className="md:col-span-3">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phonenumber}
                      onChange={(e) => handleChange('phonenumber', e.target.value)}
                      required
                      helperText="Include country code (e.g., +1234567890)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Address Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Street"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Street Number"
                    value={formData.streetNumber}
                    onChange={(e) => handleChange('streetNumber', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="ZIP / Postal Code"
                    value={formData.zip}
                    onChange={(e) => handleChange('zip', e.target.value)}
                  />
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                  <Select
                    label="Country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    options={[
                      { value: '', label: 'Select Country' },
                      ...countries
                    ]}
                    disabled={isLoadingCountries}
                  />
                </div>
              </div>
            </div>

            {/* Nationality & Birth Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Nationality & Birth Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Nationality"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    options={[
                      { value: '', label: 'Select Nationality' },
                      ...countries
                    ]}
                    disabled={isLoadingCountries}
                  />
                  <Select
                    label="Country of Birth"
                    value={formData.countryOfBirth}
                    onChange={(e) => handleChange('countryOfBirth', e.target.value)}
                    options={[
                      { value: '', label: 'Select Country' },
                      ...countries
                    ]}
                    disabled={isLoadingCountries}
                  />
                </div>

                <Input
                  label="Place of Birth"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                  placeholder="City or location"
                />
              </div>
            </div>

            {/* Tax & Financial Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tax & Financial Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Tax Country"
                    value={formData.taxCountry}
                    onChange={(e) => handleChange('taxCountry', e.target.value)}
                    options={[
                      { value: '', label: 'Select Country' },
                      ...countries
                    ]}
                    disabled={isLoadingCountries}
                  />
                  <Input
                    label="Tax Number"
                    value={formData.taxNumber}
                    onChange={(e) => handleChange('taxNumber', e.target.value)}
                    placeholder="Tax identification number"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Education Level"
                    value={formData.educationLevel}
                    onChange={(e) => handleChange('educationLevel', e.target.value)}
                    placeholder="e.g., Bachelor's, Master's, PhD"
                  />
                  <Input
                    label="Occupation"
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="Current profession"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Additional Settings
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Default Language"
                    value={formData.defaultLanguage}
                    onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                    helperText="2-letter language code (e.g., EN, DE, FR)"
                  />
                  <Input
                    label="External Reference ID"
                    value={formData.externalRefId}
                    onChange={(e) => handleChange('externalRefId', e.target.value)}
                    helperText="Your internal reference ID"
                  />
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  <strong>Error:</strong> {error.message}
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                <strong>Note:</strong> Fields marked with * are required. All other information is optional but may be required during the KYC verification process.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              className="w-full"
              size="lg"
            >
              Create Applicant & Start KYC
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* API Configuration Display */}
      <Card className="mt-6">
        <CardContent>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Current Configuration
          </h3>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p>API Key: {import.meta.env.VITE_METAKYC_API_KEY ? '✓ Configured' : '✗ Not set'}</p>
            <p>Tenant ID: {import.meta.env.VITE_TENANT_ID || '1'}</p>
            <p>Base URL: {import.meta.env.VITE_METAKYC_BASE_URL || 'Not configured'}</p>
            <p>Endpoint Pattern: {import.meta.env.VITE_ENDPOINT_PATTERN || 'host-controller'}</p>
            <p>Countries Loaded: {isLoadingCountries ? 'Loading...' : `${countries.length} available`}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Configure these values in your <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env</code> file
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
