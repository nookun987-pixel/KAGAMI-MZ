"use strict";

const { ensureServicesReady } = require("./service_manager");
const { enqueueJob, readQueue } = require("./worker");

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function tryHandleRuntimeRoute(req, res, helpers) {
  const pathname = helpers.pathname;
  if (req.method === "GET" && pathname === "/api/runtime/health") {
    const health = await ensureServicesReady();
    helpers.sendJsonResponse(res, 200, health);
    return true;
  }

  if (req.method === "GET" && pathname === "/api/runtime/queue") {
    helpers.sendJsonResponse(res, 200, readQueue());
    return true;
  }

  if (req.method === "POST" && pathname === "/api/runtime/jobs") {
    try {
      const body = await readBody(req);
      if (!body.job_id) {
        helpers.sendJsonResponse(res, 400, { error: "Missing job_id" });
        return true;
      }
      const job = enqueueJob(body);
      helpers.sendJsonResponse(res, 200, {
        status: "QUEUED",
        job,
      });
      return true;
    } catch (error) {
      helpers.sendJsonResponse(res, 400, { error: "Invalid JSON payload" });
      return true;
    }
  }

  return false;
}

module.exports = {
  tryHandleRuntimeRoute,
};
