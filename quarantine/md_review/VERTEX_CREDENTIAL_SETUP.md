# VERTEX CREDENTIAL SETUP

## Required Credentials

### Environment Variables
```bash
# Primary method - service account key file path
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account-key.json

# Alternative method - inline JSON (not recommended for production)
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"..."}

# Optional: explicit project override
GOOGLE_CLOUD_PROJECT=gen-lang-client-0440215253
```

### Service Account Key File
**File Location**: `C:\path\to\service-account-key.json`

**Required Permissions**:
- `discoveryengine.engines.get`
- `discoveryengine.servingConfigs.search`
- `discoveryengine.dataStores.get`

**Example Key Structure**:
```json
{
  "type": "service_account",
  "project_id": "gen-lang-client-0440215253",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...@gen-lang-client-0440215253.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### Vertex AI Search Configuration
```javascript
// Hardcoded in vertex_retriever_real.js
const PROJECT_ID = "gen-lang-client-0440215253";
const LOCATION = "global";
const DATA_STORE_ID = "mikage-brain_1774647243976";
```

## Setup Steps

### 1. Create Service Account
```bash
# In Google Cloud Console
# 1. Go to IAM & Admin > Service Accounts
# 2. Create service account with name "mikage-rag-retriever"
# 3. Grant permissions: Discovery Engine User
# 4. Create and download JSON key
```

### 2. Configure Environment
```bash
# Option A: Environment variable (recommended)
set GOOGLE_APPLICATION_CREDENTIALS=C:\mikage\service-account-key.json

# Option B: Place key in project root
# Copy service-account-key.json to D:\KAGAMI-MZ\
```

### 3. Verify Setup
```bash
# Test credentials
node -e "const {DiscoveryEngine} = require('@google-cloud/discoveryengine'); console.log('Vertex client available')"
```

## Troubleshooting

### Common Errors
- `DiscoveryEngine is not a constructor` → Install `@google-cloud/discoveryengine`
- `Permission denied` → Service account lacks Discovery Engine permissions
- `Data store not found` → Check DATA_STORE_ID value
- `Authentication failed` → Invalid or missing service account key

### Debug Commands
```bash
# Check if key file exists
dir service-account-key.json

# Check environment variable
echo %GOOGLE_APPLICATION_CREDENTIALS%

# Test Google Cloud auth
gcloud auth activate-service-account --key-file=service-account-key.json
gcloud discovery-engine data-stores list --location=global
```

## Security Notes
- Never commit service account keys to git
- Use environment variables in production
- Rotate keys regularly
- Limit service account permissions to minimum required
