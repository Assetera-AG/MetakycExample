# 🚀 START HERE - MetaKYC SDK Demo

## ⚡ Quick Start (Copy & Paste)

```bash
cd /Users/sajjadziyadloo/repos/metakyc-sdk-demo

# 1. Configure your API credentials
nano .env

# 2. Start the application
npm run dev

# 3. Open browser at http://localhost:3000
```

---

## 🔧 Configure `.env` File

Edit the `.env` file with your actual credentials:

```env
VITE_METAKYC_API_KEY=your-actual-api-key
VITE_TENANT_ID=your-tenant-id
VITE_METAKYC_BASE_URL=https://localhost:44311
VITE_ENDPOINT_PATTERN=host-controller
```

**Important:** Replace `your-actual-api-key` and other placeholders with real values!

---

## 📖 What The Demo Shows

### Page 1: Create Applicant ✅
- Form with pre-filled demo data (John Doe)
- Uses SDK's `useApplicant()` hook
- Creates applicant and gets **applicant ID**

### Page 2: KYC Workflow ✅
- Complete workflow with progress tracker
- Uses SDK's `<KycWorkflow>` component
- Automatically progresses through steps:
  - Identity Verification
  - Questionnaires
  - Document Upload
  - Risk Scoring
  - Appropriateness Test
  - Overview
  - etc.

### Page 3: Success ✅
- Shows completion status
- Displays applicant ID and result
- Option to start over

---

## 🎯 Key SDK Features

### 1. Applicant Creation (Built-in)
```tsx
const { createApplicant } = useApplicant();
const result = await createApplicant({...});
// result.applicantId - Use this for workflow
```

### 2. Complete Workflow
```tsx
<KycWorkflow 
  applicantId={result.applicantId}
  onComplete={(result) => {...}}
/>
```

---

## 📁 Files Delivered

### SDK Package
```
/Users/sajjadziyadloo/repos/metakyc-sdk/
└── dist/                    # Built package (ready to use)
    ├── index.js            # ESM (102 KB)
    ├── index.cjs           # CJS (68 KB)
    ├── index.d.ts          # Types
    └── styles.css          # Styles (15 KB)
```

### Demo Application
```
/Users/sajjadziyadloo/repos/metakyc-sdk-demo/
├── src/
│   ├── App.tsx                          # Main app
│   └── components/
│       ├── CreateApplicantForm.tsx     # Applicant creation
│       └── KYCWorkflowPage.tsx         # Workflow display
├── .env                                 # Your config
└── START_HERE.md                        # This file!
```

---

## ✅ Everything is Ready!

- ✅ SDK built and compiled
- ✅ Demo app installed and ready
- ✅ Documentation complete
- ✅ All features implemented

**Just configure `.env` and run `npm run dev`!** 🎉
