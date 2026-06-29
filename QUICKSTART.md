# MetaKYC SDK Demo - Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Configure Your API

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_METAKYC_API_KEY=your-api-key-here
VITE_TENANT_ID=1
VITE_METAKYC_BASE_URL=https://your-api-url.com
VITE_ENDPOINT_PATTERN=host-controller
```

### 2️⃣ Start the Application

```bash
npm run dev
```

### 3️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

---

## 📋 What You'll See

### Page 1: Create Applicant
- **Pre-filled form** with demo data (John Doe)
- Click **"Create Applicant & Start KYC"**
- The SDK calls the API and creates an applicant ✅

### Page 2: KYC Workflow
- **Progress tracker** shows all workflow steps
- **Current step** displays the active form
- Complete each step to progress
- **Automatic navigation** to next step

### Page 3: Completion
- **Success message** when workflow is complete
- **Workflow result** and applicant ID displayed
- **Start over** button to test again

---

## 🎯 Key Features Demonstrated

✅ **SDK Integration** - MetaKYCProvider setup
✅ **Applicant Creation** - useApplicant hook
✅ **Workflow Management** - KycWorkflow component
✅ **Dynamic Forms** - Auto-generated from API schema
✅ **Form Validation** - Zod validation from backend rules
✅ **Error Handling** - Comprehensive error display
✅ **Styling** - Pre-built components with Tailwind CSS

---

## 🛠️ Customization Quick Tips

### Change Pre-filled Data
Edit `src/components/CreateApplicantForm.tsx`:
```tsx
const [formData, setFormData] = useState({
  firstName: 'Your Name Here',  // Change this
  // ...
});
```

### Change Workflow Key
```tsx
workflowKey: 'YOUR_WORKFLOW_KEY',  // Change this
```

### Enable Dark Mode
Edit `src/components/KYCWorkflowPage.tsx`:
```tsx
<KycWorkflow theme="dark" />  // Change to "dark"
```

---

## 🔍 Testing the Workflow

### Test Scenario 1: Complete Flow
1. Create applicant with default data
2. Complete all workflow steps
3. View completion screen

### Test Scenario 2: Error Handling
1. Use invalid API key in `.env`
2. See error handling in action
3. Fix and retry

### Test Scenario 3: Different Workflows
1. Change `workflowKey` to test different configurations
2. Observe different step sequences

---

## 📱 What Each Component Does

### `App.tsx`
- Sets up MetaKYCProvider
- Manages applicant ID state
- Routes between create/workflow pages

### `CreateApplicantForm.tsx`
- Uses `useApplicant()` hook
- Calls `createApplicant()` API
- Handles form validation and errors

### `KYCWorkflowPage.tsx`
- Displays `<KycWorkflow>` component
- Handles workflow completion
- Shows success/error states

---

## 🐛 Troubleshooting

### Can't connect to API?
1. Check `.env` file exists
2. Verify `VITE_METAKYC_BASE_URL` is correct
3. Test API URL in browser/Postman
4. Check API key is valid

### Workflow not progressing?
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Verify all required fields are filled

### Build errors?
```bash
# Rebuild the SDK first
cd ../metakyc-sdk
npm run build

# Then reinstall demo dependencies
cd ../metakyc-sdk-demo
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learn More

- **Full README**: See `README.md` for detailed documentation
- **SDK Documentation**: Check `../metakyc-sdk/docs/`
- **API Reference**: Available in SDK docs
- **Examples**: More examples in `../metakyc-sdk/examples/`

---

## 💡 Next Steps

1. ✅ Run the demo and test the workflow
2. 📖 Read the full README for customization options
3. 🎨 Customize the UI to match your brand
4. 🚀 Integrate into your actual application
5. 📊 Add analytics and tracking
6. 🌐 Deploy to production

---

**Need Help?** Check the full README.md or SDK documentation!
