"use strict";

const { JWT } = require("google-auth-library");

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const DEFAULT_ROOT_NAME = "mikage_runner";
const FOLDER_MIME = "application/vnd.google-apps.folder";

function escapeDriveQuery(value) {
  return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function parseServiceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8"));
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  throw new Error(
    "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON, " +
    "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
  );
}

let cachedAuth = null;
async function getAccessToken() {
  if (process.env.GOOGLE_DRIVE_ACCESS_TOKEN) {
    return process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  }

  if (!cachedAuth) {
    const credentials = parseServiceAccountCredentials();
    cachedAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [DRIVE_SCOPE],
    });
  }

  const token = await cachedAuth.getAccessToken();
  const accessToken = typeof token === "string" ? token : token && token.token;
  if (!accessToken) {
    throw new Error("Failed to obtain Google Drive access token");
  }
  return accessToken;
}

async function driveFetch(pathname, { method = "GET", query = {}, raw = false } = {}) {
  const accessToken = await getAccessToken();
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }

  const url = `${DRIVE_API_BASE}${pathname}${search.toString() ? `?${search.toString()}` : ""}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Google Drive API ${response.status}: ${detail}`);
  }

  if (raw) {
    return response.text();
  }

  return response.json();
}

async function findFolderByName(name, parentId = null) {
  const clauses = [
    `mimeType='${FOLDER_MIME}'`,
    "trashed=false",
    `name='${escapeDriveQuery(name)}'`,
  ];

  if (parentId) {
    clauses.push(`'${escapeDriveQuery(parentId)}' in parents`);
  }

  const response = await driveFetch("/files", {
    query: {
      q: clauses.join(" and "),
      fields: "files(id,name,mimeType,createdTime,modifiedTime,parents,driveId)",
      pageSize: 10,
      includeItemsFromAllDrives: "true",
      supportsAllDrives: "true",
      corpora: "allDrives",
    },
  });

  return Array.isArray(response.files) && response.files.length > 0 ? response.files[0] : null;
}

async function resolveRootFolder() {
  const explicitId = process.env.GOOGLE_DRIVE_SHARED_ROOT_ID;
  if (explicitId) {
    return driveFetch(`/files/${encodeURIComponent(explicitId)}`, {
      query: {
        fields: "id,name,mimeType,createdTime,modifiedTime,parents,driveId",
        supportsAllDrives: "true",
      },
    });
  }

  const rootName = process.env.GOOGLE_DRIVE_SHARED_ROOT_NAME || DEFAULT_ROOT_NAME;
  const folder = await findFolderByName(rootName);
  if (!folder) {
    throw new Error(
      `Unable to resolve shared Drive root "${rootName}". ` +
      "Share the folder with the service account or set GOOGLE_DRIVE_SHARED_ROOT_ID."
    );
  }
  return folder;
}

async function resolveContractFolders() {
  const root = await resolveRootFolder();
  const names = ["job_inbox", "claims", "outputs", "logs"];
  const entries = await Promise.all(names.map(async (name) => [name, await findFolderByName(name, root.id)]));
  const folders = Object.fromEntries(entries);
  return { root, folders };
}

async function listFolderChildren(folderId, options = {}) {
  if (!folderId) return [];

  const response = await driveFetch("/files", {
    query: {
      q: [
        `'${escapeDriveQuery(folderId)}' in parents`,
        "trashed=false",
      ].join(" and "),
      fields: "files(id,name,mimeType,createdTime,modifiedTime,size,parents,webViewLink,webContentLink)",
      pageSize: String(options.pageSize || 200),
      orderBy: options.orderBy || "modifiedTime desc",
      includeItemsFromAllDrives: "true",
      supportsAllDrives: "true",
    },
  });

  return Array.isArray(response.files) ? response.files : [];
}

async function readJsonFile(fileId) {
  if (!fileId) return null;
  const text = await driveFetch(`/files/${encodeURIComponent(fileId)}`, {
    query: {
      alt: "media",
      supportsAllDrives: "true",
    },
    raw: true,
  });
  return JSON.parse(text);
}

async function readTextFile(fileId) {
  if (!fileId) return "";
  return driveFetch(`/files/${encodeURIComponent(fileId)}`, {
    query: {
      alt: "media",
      supportsAllDrives: "true",
    },
    raw: true,
  });
}

function normalizeResultState(result = {}) {
  const status = String(result.status || result.final_status || result.state || "").toLowerCase();
  if (["success", "done", "completed", "complete", "ok"].includes(status)) {
    return "completed";
  }
  if (["fail", "failed", "error", "rejected"].includes(status)) {
    return "failed";
  }
  return null;
}

function summarizeArtifacts(files = [], resultFileId = null) {
  return files
    .filter((file) => file.id !== resultFileId)
    .map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      modifiedTime: file.modifiedTime,
      size: file.size ? Number(file.size) : null,
      webViewLink: file.webViewLink || null,
      webContentLink: file.webContentLink || null,
    }));
}

async function buildRuntimeSnapshot() {
  const startedAt = Date.now();
  const { root, folders } = await resolveContractFolders();

  const [inboxFiles, claimFiles, outputFolders, logFiles] = await Promise.all([
    listFolderChildren(folders.job_inbox && folders.job_inbox.id),
    listFolderChildren(folders.claims && folders.claims.id),
    listFolderChildren(folders.outputs && folders.outputs.id),
    listFolderChildren(folders.logs && folders.logs.id, { pageSize: 50 }),
  ]);

  const jobs = new Map();

  function getOrCreate(jobId) {
    if (!jobs.has(jobId)) {
      jobs.set(jobId, {
        job_id: jobId,
        status: "pending",
        state_anchor: "job_inbox",
        lane: null,
        idea: null,
        prompt: null,
        execution_target: null,
        created_at: null,
        claimed_at: null,
        completed_at: null,
        failed_at: null,
        claim: null,
        result: null,
        artifacts: [],
      });
    }
    return jobs.get(jobId);
  }

  await Promise.all(inboxFiles.filter((file) => file.name.endsWith(".json")).map(async (file) => {
    try {
      const payload = await readJsonFile(file.id);
      const jobId = String(payload.job_id || file.name.replace(/\.json$/i, ""));
      const job = getOrCreate(jobId);
      job.status = job.result ? job.status : "pending";
      job.state_anchor = job.result ? job.state_anchor : "job_inbox";
      job.lane = payload.lane || job.lane;
      job.idea = payload.idea || job.idea;
      job.prompt = payload.prompt || job.prompt;
      job.execution_target = payload.execution_target || job.execution_target;
      job.created_at = payload.created_at || file.createdTime || job.created_at;
      job.inbox_file = {
        id: file.id,
        name: file.name,
        modifiedTime: file.modifiedTime,
      };
    } catch (error) {
      const fallbackId = file.name.replace(/\.json$/i, "");
      const job = getOrCreate(fallbackId);
      job.inbox_error = error.message;
    }
  }));

  await Promise.all(claimFiles.filter((file) => file.name.endsWith(".json")).map(async (file) => {
    try {
      const payload = await readJsonFile(file.id);
      const jobId = String(payload.job_id || file.name.replace(/\.json$/i, ""));
      const job = getOrCreate(jobId);
      if (!job.result) {
        job.status = "running";
        job.state_anchor = "claims";
      }
      job.claimed_at = payload.claimed_at || payload.started_at || file.createdTime || job.claimed_at;
      job.claim = payload;
      job.lane = payload.lane || job.lane;
      job.idea = payload.idea || job.idea;
      job.prompt = payload.prompt || job.prompt;
      job.execution_target = payload.execution_target || job.execution_target;
    } catch (error) {
      const fallbackId = file.name.replace(/\.json$/i, "");
      const job = getOrCreate(fallbackId);
      job.claim_error = error.message;
    }
  }));

  await Promise.all(outputFolders
    .filter((file) => file.mimeType === FOLDER_MIME)
    .map(async (folder) => {
      const job = getOrCreate(folder.name);
      const files = await listFolderChildren(folder.id, { pageSize: 100 });
      const resultFile = files.find((file) => file.name === "result.json");
      let result = null;
      if (resultFile) {
        try {
          result = await readJsonFile(resultFile.id);
        } catch (error) {
          result = { status: "failed", error: `Unable to parse result.json: ${error.message}` };
        }
      }

      const mappedState = normalizeResultState(result || {});
      if (mappedState) {
        job.status = mappedState;
        job.state_anchor = "outputs/result.json";
        job.result = result;
        job.completed_at = result && (result.completed_at || result.finished_at || result.updated_at) || resultFile && resultFile.modifiedTime || folder.modifiedTime || job.completed_at;
        if (mappedState === "failed") {
          job.failed_at = job.completed_at;
        }
      } else if (!job.claim && !job.inbox_file) {
        job.status = "pending";
        job.state_anchor = "outputs";
      }

      job.artifacts = summarizeArtifacts(files, resultFile && resultFile.id);
      job.output_folder = {
        id: folder.id,
        name: folder.name,
        modifiedTime: folder.modifiedTime,
      };
    }));

  const recentLogs = await Promise.all(logFiles.slice(0, 10).map(async (file) => {
    const text = await readTextFile(file.id);
    return {
      id: file.id,
      name: file.name,
      modifiedTime: file.modifiedTime,
      lines: text.split(/\r?\n/).filter(Boolean).slice(-20),
    };
  }));

  const sortedJobs = Array.from(jobs.values()).sort((a, b) => {
    const left = a.completed_at || a.failed_at || a.claimed_at || a.created_at || "";
    const right = b.completed_at || b.failed_at || b.claimed_at || b.created_at || "";
    return String(right).localeCompare(String(left));
  });

  const counts = {
    pending: sortedJobs.filter((job) => job.status === "pending").length,
    running: sortedJobs.filter((job) => job.status === "running").length,
    completed: sortedJobs.filter((job) => job.status === "completed").length,
    failed: sortedJobs.filter((job) => job.status === "failed").length,
    total: sortedJobs.length,
  };

  return {
    generated_at: new Date().toISOString(),
    duration_ms: Date.now() - startedAt,
    root: {
      id: root.id,
      name: root.name,
      modifiedTime: root.modifiedTime || null,
    },
    folders: {
      job_inbox: folders.job_inbox ? { id: folders.job_inbox.id, name: folders.job_inbox.name } : null,
      claims: folders.claims ? { id: folders.claims.id, name: folders.claims.name } : null,
      outputs: folders.outputs ? { id: folders.outputs.id, name: folders.outputs.name } : null,
      logs: folders.logs ? { id: folders.logs.id, name: folders.logs.name } : null,
    },
    counts,
    jobs: sortedJobs,
    logs: recentLogs,
    proof: {
      dashboard_source: "google_drive_api",
      root_name: root.name,
      contract_folders: Object.keys(folders).filter((name) => !!folders[name]),
      final_state_anchor: "outputs/<job_id>/result.json",
    },
  };
}

module.exports = {
  buildRuntimeSnapshot,
  resolveRootFolder,
  resolveContractFolders,
  listFolderChildren,
  readJsonFile,
  readTextFile,
};
