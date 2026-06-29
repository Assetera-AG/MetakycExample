import { useState, useEffect, useCallback } from 'react';
import {
  MetaKYCProvider,
  MetaKYC,
  clearAllStorage,
  MetaKYCSession,
  type MetaKYCClientConfig,
  type WorkflowResultType,
} from '@asseteragmbh/metakyc';

declare const __SDK_VERSION__: string;

const STORAGE_KEY = 'metakyc-demo-settings';

interface InitialValueEntry {
  key: string;
  value: string;
}

interface DemoSettings {
  apiKey: string;
  secretKey: string;
  tenantId: string;
  clientId: string;
  authMode: 'tenantId' | 'clientId';
  baseUrl: string;
  endpointPattern: 'host-controller' | 'application-service';
  workflowKey: string;
  externalRefId: string;
  applicantType: 'individual' | 'company';
  locale: string;
  sumsubCustomization: string;
  sumsubTheme: 'light' | 'dark';
  sardineClientId: string;
  sardineEnv: 'sandbox' | 'production';
  initialValues: InitialValueEntry[];
  hiddenValues: InitialValueEntry[];
  fieldLabelMode: 'label' | 'placeholder';
  showVersion: boolean;
  configVersion: string;
  email: string;
  debug: boolean;
}

function generateRefId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultSettings: DemoSettings = {
  apiKey: '',
  secretKey: '',
  tenantId: '12',
  clientId: '',
  authMode: 'tenantId',
  baseUrl: 'http://localhost:44302',
  endpointPattern: 'host-controller',
  workflowKey: '',
  externalRefId: '',
  applicantType: 'individual',
  locale: 'en',
  sumsubCustomization: 'meta-sk',
  sumsubTheme: 'dark',
  sardineClientId: '',
  sardineEnv: 'sandbox',
  initialValues: [],
  hiddenValues: [{ key: 'country', value: 'AUT' }],
  fieldLabelMode: 'label',
  showVersion: true,
  configVersion: '',
  email: '',
  debug: false,
};

function loadSettings(): DemoSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings;
}

function saveSettings(s: DemoSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const saved = loadSettings();

  const [apiKey, setApiKey] = useState(urlParams.get('apiKey') || import.meta.env.VITE_METAKYC_API_KEY || saved.apiKey);
  const [secretKey, setSecretKey] = useState(import.meta.env.VITE_METAKYC_SECRET_KEY || saved.secretKey || '');
  const [tenantId, setTenantId] = useState(urlParams.get('tenantId') || import.meta.env.VITE_TENANT_ID || saved.tenantId);
  const [clientId, setClientId] = useState(urlParams.get('clientId') || import.meta.env.VITE_CLIENT_ID || saved.clientId || '');
  const [authMode, setAuthMode] = useState<'tenantId' | 'clientId'>(saved.authMode || 'tenantId');
  const [baseUrl, setBaseUrl] = useState(urlParams.get('apiBaseUrl') || import.meta.env.VITE_METAKYC_BASE_URL || saved.baseUrl);
  const [endpointPattern, setEndpointPattern] = useState<'host-controller' | 'application-service'>(
    (urlParams.get('endpointPattern') || import.meta.env.VITE_ENDPOINT_PATTERN || saved.endpointPattern) as any
  );
  const [workflowKey, setWorkflowKey] = useState(urlParams.get('workflowKey') || saved.workflowKey);
  const [externalRefId, setExternalRefId] = useState(urlParams.get('externalRefId') || saved.externalRefId || generateRefId());
  const [applicantType, setApplicantType] = useState<'individual' | 'company'>(saved.applicantType);
  const [locale, setLocale] = useState(saved.locale);
  const [email, setEmail] = useState(saved.email || '');

  const [sumsubCustomization, setSumsubCustomization] = useState(saved.sumsubCustomization);
  const [sumsubTheme, setSumsubTheme] = useState<'light' | 'dark'>(saved.sumsubTheme);

  const [sardineClientId, setSardineClientId] = useState(urlParams.get('sardineClientId') || import.meta.env.VITE_SARDINAI_CLIENT_ID || saved.sardineClientId);
  const [sardineEnv, setSardineEnv] = useState<'sandbox' | 'production'>(
    (urlParams.get('sardineEnvironment') || import.meta.env.VITE_SARDINAI_ENVIRONMENT || saved.sardineEnv) as any
  );

  const [initialValues, setInitialValues] = useState<InitialValueEntry[]>(saved.initialValues);
  const [hiddenValues, setHiddenValues] = useState<InitialValueEntry[]>(saved.hiddenValues);
  const [fieldLabelMode, setFieldLabelMode] = useState<'label' | 'placeholder'>(saved.fieldLabelMode);
  const [showVersion, setShowVersion] = useState<boolean>(saved.showVersion ?? true);
  const [configVersion, setConfigVersion] = useState(saved.configVersion || '');
  const [debugMode, setDebugMode] = useState<boolean>(saved.debug ?? false);

  const [applicantId, setApplicantId] = useState<number | null>(null);
  const [sdkInitialized, setSdkInitialized] = useState(false);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<ArrayBuffer | null>(null);
  const [encSessionId, setEncSessionId] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);

  useEffect(() => {
    saveSettings({
      apiKey, secretKey, tenantId, clientId, authMode, baseUrl, endpointPattern, workflowKey, externalRefId, applicantType, locale,
      sumsubCustomization, sumsubTheme, sardineClientId, sardineEnv,
      initialValues, hiddenValues, fieldLabelMode, showVersion, configVersion, email, debug: debugMode,
    });
  }, [apiKey, secretKey, tenantId, clientId, authMode, baseUrl, endpointPattern, workflowKey, externalRefId, applicantType, locale,
      sumsubCustomization, sumsubTheme, sardineClientId, sardineEnv,
      initialValues, hiddenValues, fieldLabelMode, showVersion, configVersion, email, debugMode]);

  const buildConfig = useCallback((): MetaKYCClientConfig => {
    const ivObj: Record<string, string> = {};
    initialValues.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) ivObj[key.trim()] = value.trim();
    });

    const hvObj: Record<string, string> = {};
    hiddenValues.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) hvObj[key.trim()] = value.trim();
    });

    const cfg: MetaKYCClientConfig = {
      ...(authMode === 'clientId' && clientId.trim()
        ? { clientId: clientId.trim() }
        : { tenantId: parseInt(tenantId) || 1 }),
      baseUrl: baseUrl || 'http://localhost:44302',
      endpoints: { pattern: endpointPattern },
      locale,
      showVersion,
      debug: debugMode,
      ...(configVersion.trim() ? { configVersion: configVersion.trim() } : {}),
      identityProviders: {
        sardinai: sardineClientId ? {
          clientId: sardineClientId,
          environment: sardineEnv,
          region: 'us',
          enableBiometrics: true,
          enablePortScanning: false,
          flow: 'kyc_verification',
        } : undefined,
        sumsub: sumsubCustomization ? {
          customizationName: sumsubCustomization,
          theme: sumsubTheme,
        } : { theme: sumsubTheme },
      },
      applicantForm: {
        applicantType,
        workflowKey: workflowKey || undefined,
        externalRefId: externalRefId.trim() || undefined,
        email: email.trim() || undefined,
        ...(Object.keys(ivObj).length > 0 ? { initialValues: ivObj } : {}),
        ...(Object.keys(hvObj).length > 0 ? { hiddenValues: hvObj } : {}),
        fieldLabelMode,
      },
    };

    if (sessionToken) {
      cfg.getAccessToken = () => sessionToken;
    } else {
      cfg.apiKey = apiKey || 'not-set';
    }

    if (encryptionKey && encSessionId) {
      cfg.encryptionKey = encryptionKey;
      cfg.encSessionId = encSessionId;
    }

    return cfg;
  }, [apiKey, tenantId, clientId, authMode, baseUrl, endpointPattern, locale, workflowKey, externalRefId, applicantType,
      sumsubCustomization, sumsubTheme, sardineClientId, sardineEnv,
      initialValues, hiddenValues, fieldLabelMode, showVersion, sessionToken, configVersion, email, debugMode,
      encryptionKey, encSessionId]);

  const handleCreateToken = async (): Promise<string | null> => {
    if (!externalRefId.trim() || !workflowKey.trim() || !email.trim()) {
      setTokenError('externalRefId, workflowKey, and email are required.');
      return null;
    }
    setTokenLoading(true);
    setTokenError(null);
    try {
      const result = await MetaKYCSession.createToken({
        baseUrl: baseUrl || 'http://localhost:44302',
        ...(authMode === 'clientId' && clientId.trim()
          ? { clientId: clientId.trim() }
          : { tenantId: parseInt(tenantId) || 1 }),
        apiKey,
        secretKey,
        externalRefId: externalRefId.trim(),
        workflowKey: workflowKey.trim(),
        email: email.trim(),
        isCompany: applicantType === 'company' ? true : undefined,
      });
      setSessionToken(result.accessToken);
      setEncryptionKey(result.encryptionKey ?? null);
      setEncSessionId(result.encSessionId ?? null);
      setTokenExpiry(result.expiresInSeconds);
      if (result.applicantId) {
        setApplicantId(result.applicantId);
      }
      return result.accessToken;
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to create session token';
      setTokenError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return null;
    } finally {
      setTokenLoading(false);
    }
  };

  const handleInitialize = async () => {
    if (secretKey.trim() && !sessionToken) {
      const token = await handleCreateToken();
      if (!token) return;
    }
    setSdkInitialized(true);
  };

  const handleReset = () => {
    clearAllStorage();
    setApplicantId(null);
    setSdkInitialized(false);
    setSessionToken(null);
    setEncryptionKey(null);
    setEncSessionId(null);
    setTokenError(null);
    setTokenExpiry(null);
    setExternalRefId(generateRefId());
  };

  const addInitialValue = () => setInitialValues([...initialValues, { key: '', value: '' }]);
  const removeInitialValue = (i: number) => setInitialValues(initialValues.filter((_, idx) => idx !== i));
  const updateInitialValue = (i: number, field: 'key' | 'value', val: string) => {
    const copy = [...initialValues];
    copy[i] = { ...copy[i], [field]: val };
    setInitialValues(copy);
  };

  const addHiddenValue = () => setHiddenValues([...hiddenValues, { key: '', value: '' }]);
  const removeHiddenValue = (i: number) => setHiddenValues(hiddenValues.filter((_, idx) => idx !== i));
  const updateHiddenValue = (i: number, field: 'key' | 'value', val: string) => {
    const copy = [...hiddenValues];
    copy[i] = { ...copy[i], [field]: val };
    setHiddenValues(copy);
  };

  const config = buildConfig();

  const hasTenant = authMode === 'clientId' ? !!clientId.trim() : !!tenantId.trim();
  const canStart = !!apiKey.trim() && !!externalRefId.trim() && !!workflowKey.trim() && !!email.trim() && hasTenant;

  return (
    <div className="demo-layout">
      {/* Sidebar */}
      <aside className="demo-sidebar">
        <div className="demo-sidebar-header">
          <h1>MetaKYC SDK Demo</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{
              fontSize: 11,
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: 12,
              fontWeight: 600,
            }}>
              SDK v{__SDK_VERSION__}
            </span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Unified Mode</span>
          </div>
        </div>

        <div className="demo-sidebar-body">
          {/* Connection */}
          <div className="demo-section">
            <div className="demo-section-title">Connection</div>
            <div className="demo-field">
              <label>API Base URL</label>
              <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="http://localhost:44302" />
            </div>
            <div className="demo-field">
              <label>API Key</label>
              <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="your-api-key" type="password" />
            </div>
            <div className="demo-field">
              <label>Secret Key <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>(required for session tokens)</span></label>
              <input value={secretKey} onChange={e => { setSecretKey(e.target.value); setSessionToken(null); setTokenError(null); }} placeholder="your-secret-key" type="password" />
            </div>
            <div className="demo-field-row">
              <div className="demo-field">
                <label>Tenant Identifier</label>
                <select value={authMode} onChange={e => setAuthMode(e.target.value as any)} style={{ marginBottom: 4 }}>
                  <option value="tenantId">Tenant ID (numeric)</option>
                  <option value="clientId">Client ID (string)</option>
                </select>
                {authMode === 'tenantId' ? (
                  <input value={tenantId} onChange={e => setTenantId(e.target.value)} placeholder="12" type="number" />
                ) : (
                  <input value={clientId} onChange={e => setClientId(e.target.value)} placeholder="your-client-id" />
                )}
              </div>
              <div className="demo-field">
                <label>Endpoint Pattern</label>
                <select value={endpointPattern} onChange={e => setEndpointPattern(e.target.value as any)}>
                  <option value="host-controller">host-controller</option>
                  <option value="application-service">application-service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Session (required) */}
          <div className="demo-section">
            <div className="demo-section-title">Session (Required)</div>
            <div className="demo-field">
              <label>External Ref ID <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>(required - your user ID)</span></label>
              <div style={{ display: 'flex', gap: 4 }}>
                <input value={externalRefId} onChange={e => { setExternalRefId(e.target.value); setSessionToken(null); }} placeholder="e.g. USER-12345" style={{ flex: 1 }} />
                <button
                  onClick={() => { setExternalRefId(generateRefId()); setSessionToken(null); }}
                  title="Generate new random ID"
                  style={{
                    padding: '4px 8px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6,
                    background: 'rgba(255,255,255,0.05)', color: 'inherit', cursor: 'pointer', fontSize: 14, lineHeight: 1,
                  }}
                >
                  ↻
                </button>
              </div>
            </div>
            <div className="demo-field">
              <label>Workflow Key <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>(required)</span></label>
              <input value={workflowKey} onChange={e => setWorkflowKey(e.target.value)} placeholder="workflow-key" />
            </div>
            <div className="demo-field">
              <label>Email <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400 }}>(required)</span></label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. user@example.com" />
            </div>
            {sessionToken && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>Token active</span>
                <span style={{ opacity: 0.5 }}>({tokenExpiry ? `${Math.round(tokenExpiry / 60)}min` : ''})</span>
                {applicantId && <span style={{ color: '#3b82f6', fontWeight: 600 }}>Applicant: {applicantId}</span>}
              </div>
            )}
            {tokenError && (
              <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{tokenError}</div>
            )}
          </div>

          {/* Applicant Form Options */}
          <div className="demo-section">
            <div className="demo-section-title">Form Options</div>
            <div className="demo-field-row">
              <div className="demo-field">
                <label>Applicant Type</label>
                <select value={applicantType} onChange={e => setApplicantType(e.target.value as any)}>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>
              <div className="demo-field">
                <label>Locale</label>
                <input value={locale} onChange={e => setLocale(e.target.value)} placeholder="en" />
              </div>
            </div>
            <div className="demo-field-row">
              <div className="demo-field">
                <label>Field Labels</label>
                <select value={fieldLabelMode} onChange={e => setFieldLabelMode(e.target.value as any)}>
                  <option value="label">Label above input</option>
                  <option value="placeholder">Placeholder only</option>
                </select>
              </div>
              <div className="demo-field">
                <label>Config Version</label>
                <input value={configVersion} onChange={e => setConfigVersion(e.target.value)} placeholder="e.g. v2-dark-theme" />
              </div>
            </div>
            <div className="demo-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showVersion}
                  onChange={e => setShowVersion(e.target.checked)}
                  style={{ width: 14, height: 14, cursor: 'pointer' }}
                />
                Show SDK version badge
              </label>
            </div>
            <div className="demo-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={debugMode}
                  onChange={e => setDebugMode(e.target.checked)}
                  style={{ width: 14, height: 14, cursor: 'pointer' }}
                />
                Debug mode (DevToolbar + API trace)
              </label>
            </div>
          </div>

          {/* Pre-filled Values */}
          <div className="demo-section">
            <div className="demo-section-title">Initial Values (read-only fields)</div>
            {initialValues.map((entry, i) => (
              <div className="demo-initial-value-row" key={i}>
                <input placeholder="field" value={entry.key} onChange={e => updateInitialValue(i, 'key', e.target.value)} />
                <input placeholder="value" value={entry.value} onChange={e => updateInitialValue(i, 'value', e.target.value)} />
                <button className="demo-remove-btn" onClick={() => removeInitialValue(i)} title="Remove">x</button>
              </div>
            ))}
            <button className="demo-add-btn" onClick={addInitialValue}>+ Add initial value</button>
          </div>

          {/* Hidden Values */}
          <div className="demo-section">
            <div className="demo-section-title">Hidden Values (submitted but not shown)</div>
            {hiddenValues.map((entry, i) => (
              <div className="demo-initial-value-row" key={i}>
                <input placeholder="field" value={entry.key} onChange={e => updateHiddenValue(i, 'key', e.target.value)} />
                <input placeholder="value" value={entry.value} onChange={e => updateHiddenValue(i, 'value', e.target.value)} />
                <button className="demo-remove-btn" onClick={() => removeHiddenValue(i)} title="Remove">x</button>
              </div>
            ))}
            <button className="demo-add-btn" onClick={addHiddenValue}>+ Add hidden value</button>
          </div>

          {/* Identity Providers */}
          <div className="demo-section">
            <div className="demo-section-title">Sumsub</div>
            <div className="demo-field-row">
              <div className="demo-field">
                <label>Customization Name</label>
                <input value={sumsubCustomization} onChange={e => setSumsubCustomization(e.target.value)} placeholder="meta-sk" />
              </div>
              <div className="demo-field">
                <label>Theme</label>
                <select value={sumsubTheme} onChange={e => setSumsubTheme(e.target.value as any)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <div className="demo-section-title">SardinAI (optional)</div>
            <div className="demo-field-row">
              <div className="demo-field">
                <label>Client ID</label>
                <input value={sardineClientId} onChange={e => setSardineClientId(e.target.value)} placeholder="optional" />
              </div>
              <div className="demo-field">
                <label>Environment</label>
                <select value={sardineEnv} onChange={e => setSardineEnv(e.target.value as any)}>
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="demo-sidebar-footer">
          {!sdkInitialized ? (
            <button
              className="demo-btn demo-btn-primary"
              onClick={handleInitialize}
              disabled={!canStart || tokenLoading}
            >
              {tokenLoading ? 'Creating token...' : 'Create Token & Initialize'}
            </button>
          ) : (
            <button className="demo-btn demo-btn-danger" onClick={handleReset} style={{ width: '100%' }}>
              Reset Everything
            </button>
          )}
          <div className="demo-field-hint">
            {!sdkInitialized
              ? (!canStart ? 'Fill in API Key, External Ref ID, Workflow Key, Email, and Tenant/Client ID to start' : 'Will create session token with applicant, then render SDK')
              : `SDK initialized - ${authMode === 'clientId' ? `Client ${clientId}` : `Tenant ${tenantId}`} - Session Token${applicantId ? ` - Applicant: ${applicantId}` : ''}`}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="demo-main">
        {sdkInitialized ? (
          <MetaKYCProvider key={`sdk-${configVersion}-${locale}-${sessionToken}-${debugMode}-${authMode}`} config={config}>
            <div className="demo-main-header">
              <div className="demo-status-bar">
                <span className="demo-badge demo-badge-success">SDK v{__SDK_VERSION__}</span>
                <span className="demo-badge demo-badge-info">
                  {authMode === 'clientId' ? `Client: ${clientId}` : `Tenant: ${tenantId}`}
                </span>
                {applicantId && <span className="demo-badge demo-badge-info">Applicant: {applicantId}</span>}
                <span className="demo-badge demo-badge-warning">{applicantType}</span>
                {configVersion.trim() && <span className="demo-badge demo-badge-info">Version: {configVersion.trim()}</span>}
                <span className="demo-badge demo-badge-success">Session Token</span>
                {externalRefId.trim() && (
                  <span className="demo-badge" style={{ background: '#f3e8ff', color: '#7e22ce', border: '1px solid #d8b4fe' }}>
                    Ref: {externalRefId.trim().length > 16 ? `${externalRefId.trim().slice(0, 16)}...` : externalRefId.trim()}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="demo-btn demo-btn-outline demo-btn-sm" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="demo-main-content">
              <MetaKYC
                isCompany={applicantType === 'company'}
                onComplete={(result: WorkflowResultType) => console.log('Workflow completed:', result)}
                onError={(error: Error) => console.error('SDK error:', error)}
                onApplicantCreated={(id: number) => {
                  console.log('Applicant created:', id);
                  setApplicantId(id);
                }}
              />
            </div>
          </MetaKYCProvider>
        ) : (
          <div className="demo-main-content">
            <div className="demo-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
              <h2>Configure & Initialize</h2>
              <p>
                Set your API credentials, External Ref ID, and Workflow Key in the sidebar,
                then click <strong>Create Token & Initialize</strong> to start.
              </p>
              <div style={{
                marginTop: 20,
                padding: '6px 14px',
                background: '#f1f5f9',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
              }}>
                SDK v{__SDK_VERSION__}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
