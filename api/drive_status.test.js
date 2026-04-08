"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

function resetRuntimeModuleCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes("\\lib\\google_drive_runtime.js")) {
      delete require.cache[key];
    }
  }
}

test("google drive runtime snapshot maps shared folder state to completed job", async () => {
  process.env.GOOGLE_DRIVE_ACCESS_TOKEN = "test-token";
  process.env.GOOGLE_DRIVE_SHARED_ROOT_NAME = "mikage_runner";

  const responses = new Map();
  const addJson = (url, payload) => responses.set(url, { json: payload });
  const addText = (url, payload) => responses.set(url, { text: payload });

  addJson(
    "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.folder%27+and+trashed%3Dfalse+and+name%3D%27mikage_runner%27&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Cparents%2CdriveId%29&pageSize=10&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives",
    { files: [{ id: "root-1", name: "mikage_runner", mimeType: "application/vnd.google-apps.folder" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.folder%27+and+trashed%3Dfalse+and+name%3D%27job_inbox%27+and+%27root-1%27+in+parents&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Cparents%2CdriveId%29&pageSize=10&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives",
    { files: [{ id: "job-inbox", name: "job_inbox", mimeType: "application/vnd.google-apps.folder" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.folder%27+and+trashed%3Dfalse+and+name%3D%27claims%27+and+%27root-1%27+in+parents&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Cparents%2CdriveId%29&pageSize=10&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives",
    { files: [{ id: "claims-1", name: "claims", mimeType: "application/vnd.google-apps.folder" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.folder%27+and+trashed%3Dfalse+and+name%3D%27outputs%27+and+%27root-1%27+in+parents&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Cparents%2CdriveId%29&pageSize=10&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives",
    { files: [{ id: "outputs-1", name: "outputs", mimeType: "application/vnd.google-apps.folder" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application%2Fvnd.google-apps.folder%27+and+trashed%3Dfalse+and+name%3D%27logs%27+and+%27root-1%27+in+parents&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Cparents%2CdriveId%29&pageSize=10&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives",
    { files: [{ id: "logs-1", name: "logs", mimeType: "application/vnd.google-apps.folder" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=%27job-inbox%27+in+parents+and+trashed%3Dfalse&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Csize%2Cparents%2CwebViewLink%2CwebContentLink%29&pageSize=200&orderBy=modifiedTime+desc&includeItemsFromAllDrives=true&supportsAllDrives=true",
    { files: [{ id: "job-file", name: "JOB-1.json", mimeType: "application/json", createdTime: "2026-04-06T00:00:00.000Z", modifiedTime: "2026-04-06T00:00:00.000Z" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=%27claims-1%27+in+parents+and+trashed%3Dfalse&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Csize%2Cparents%2CwebViewLink%2CwebContentLink%29&pageSize=200&orderBy=modifiedTime+desc&includeItemsFromAllDrives=true&supportsAllDrives=true",
    { files: [{ id: "claim-file", name: "JOB-1.json", mimeType: "application/json", createdTime: "2026-04-06T00:01:00.000Z", modifiedTime: "2026-04-06T00:01:00.000Z" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=%27outputs-1%27+in+parents+and+trashed%3Dfalse&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Csize%2Cparents%2CwebViewLink%2CwebContentLink%29&pageSize=200&orderBy=modifiedTime+desc&includeItemsFromAllDrives=true&supportsAllDrives=true",
    { files: [{ id: "output-folder", name: "JOB-1", mimeType: "application/vnd.google-apps.folder", modifiedTime: "2026-04-06T00:02:00.000Z" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=%27logs-1%27+in+parents+and+trashed%3Dfalse&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Csize%2Cparents%2CwebViewLink%2CwebContentLink%29&pageSize=50&orderBy=modifiedTime+desc&includeItemsFromAllDrives=true&supportsAllDrives=true",
    { files: [{ id: "log-file", name: "JOB-1.log", mimeType: "text/plain", modifiedTime: "2026-04-06T00:03:00.000Z" }] }
  );
  addJson(
    "https://www.googleapis.com/drive/v3/files?q=%27output-folder%27+in+parents+and+trashed%3Dfalse&fields=files%28id%2Cname%2CmimeType%2CcreatedTime%2CmodifiedTime%2Csize%2Cparents%2CwebViewLink%2CwebContentLink%29&pageSize=100&orderBy=modifiedTime+desc&includeItemsFromAllDrives=true&supportsAllDrives=true",
    {
      files: [
        { id: "result-file", name: "result.json", mimeType: "application/json", modifiedTime: "2026-04-06T00:02:00.000Z" },
        { id: "png-file", name: "output.png", mimeType: "image/png", modifiedTime: "2026-04-06T00:02:00.000Z", webViewLink: "https://drive.google.com/file/d/png-file/view" },
      ],
    }
  );
  addText(
    "https://www.googleapis.com/drive/v3/files/job-file?alt=media&supportsAllDrives=true",
    JSON.stringify({
      job_id: "JOB-1",
      lane: "mask_macro",
      idea: "real shared render",
      prompt: "real shared render",
      execution_target: "colab_runner",
      created_at: "2026-04-06T00:00:00.000Z",
    })
  );
  addText(
    "https://www.googleapis.com/drive/v3/files/claim-file?alt=media&supportsAllDrives=true",
    JSON.stringify({
      job_id: "JOB-1",
      claimed_at: "2026-04-06T00:01:00.000Z",
      worker_id: "colab-a",
    })
  );
  addText(
    "https://www.googleapis.com/drive/v3/files/result-file?alt=media&supportsAllDrives=true",
    JSON.stringify({
      job_id: "JOB-1",
      status: "SUCCESS",
      completed_at: "2026-04-06T00:02:00.000Z",
    })
  );
  addText(
    "https://www.googleapis.com/drive/v3/files/log-file?alt=media&supportsAllDrives=true",
    "claimed JOB-1\ncompleted JOB-1\n"
  );

  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    const entry = responses.get(String(url));
    if (!entry) {
      throw new Error(`Unexpected fetch: ${url}`);
    }
    return {
      ok: true,
      json: async () => entry.json,
      text: async () => entry.text,
    };
  };

  resetRuntimeModuleCache();
  const { buildRuntimeSnapshot } = require("../lib/google_drive_runtime");
  const snapshot = await buildRuntimeSnapshot();

  global.fetch = originalFetch;
  delete process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  delete process.env.GOOGLE_DRIVE_SHARED_ROOT_NAME;

  assert.equal(snapshot.root.name, "mikage_runner");
  assert.equal(snapshot.counts.completed, 1);
  assert.equal(snapshot.counts.running, 0);
  assert.equal(snapshot.jobs[0].job_id, "JOB-1");
  assert.equal(snapshot.jobs[0].status, "completed");
  assert.equal(snapshot.jobs[0].state_anchor, "outputs/result.json");
  assert.equal(snapshot.jobs[0].execution_target, "colab_runner");
  assert.equal(snapshot.jobs[0].artifacts[0].name, "output.png");
  assert.equal(snapshot.logs[0].lines[1], "completed JOB-1");
});
