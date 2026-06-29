import { KycWorkflow } from '@asseteragmbh/metakyc';
import { WorkflowResultType } from '@asseteragmbh/metakyc';

interface KYCWorkflowPageProps {
  applicantId: number;
  onReset: () => void;
}

export default function KYCWorkflowPage({ applicantId, onReset: _onReset }: KYCWorkflowPageProps) {
  const handleComplete = (workflowResult: WorkflowResultType) => {
    console.log('Workflow completed with result:', workflowResult);
    // Don't intercept - let the SDK's status display handle it
  };

  const handleError = (error: Error) => {
    console.error('Workflow error:', error);
    // Errors are now handled by the SDK's status display
  };

  return (
    <div>
      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Applicant ID {applicantId}</strong> - The workflow will automatically progress through each step. 
              Complete the required information for each step to continue.
            </p>
          </div>
        </div>
      </div>

      {/* KYC Workflow Component */}
      <KycWorkflow
        applicantId={applicantId}
        onComplete={handleComplete}
        onError={handleError}
     
        
      />
    </div>
  );
}
