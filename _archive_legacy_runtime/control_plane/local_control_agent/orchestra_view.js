"use strict";

(function bootstrap(root) {
  const FIXED_NODES = [
    { id: "conductor", label: "USER", kind: "conductor" },
    { id: "commander_api_server", label: "COMMANDER API", kind: "control" },
    { id: "commander_service", label: "COMMANDER SERVICE", kind: "control" },
    { id: "session_manager", label: "SESSION", kind: "control" },
    { id: "workflow_registry", label: "WORKFLOW REGISTRY", kind: "control" },
    { id: "agent_process_manager", label: "AGENT PROCESS", kind: "control" },
    { id: "commander_bridge", label: "BRIDGE", kind: "bridge" },
    { id: "local_control_agent", label: "LOCAL AGENT", kind: "bridge" },
    { id: "drive_queue", label: "DRIVE QUEUE", kind: "runtime" },
    { id: "colab_worker", label: "COLAB WORKER", kind: "runtime" },
    { id: "validation", label: "VALIDATION", kind: "runtime" },
    { id: "decision", label: "DECISION", kind: "runtime" },
    { id: "memory", label: "MEMORY", kind: "runtime" },
  ];

  const EDGE_LIST = [
    ["conductor", "commander_api_server"],
    ["commander_api_server", "commander_service"],
    ["commander_service", "session_manager"],
    ["commander_service", "workflow_registry"],
    ["commander_service", "agent_process_manager"],
    ["commander_service", "commander_bridge"],
    ["commander_bridge", "local_control_agent"],
    ["local_control_agent", "drive_queue"],
    ["drive_queue", "colab_worker"],
    ["colab_worker", "validation"],
    ["validation", "decision"],
    ["decision", "memory"],
  ];

  function statusOr(fallback, value, needle, result) {
    return String(value || "").toLowerCase().includes(needle) ? result : fallback;
  }

  function buildTimeline(statusPayload) {
    const runs = (((statusPayload || {}).workflow_history || {}).runs) || [];
    return runs.slice(0, 8).map((run) => ({
      id: run.id,
      workflow: run.workflow,
      verdict: run.final_verdict,
      blocker: run.blocker_reason || null,
      requested_by: run.requested_by || null,
      ended_at: run.ended_at || run.generated_at || null,
    }));
  }

  function buildLatestBlocker(statusPayload) {
    const snapshot = (statusPayload || {}).snapshot || {};
    const latestBlocked = ((statusPayload || {}).workflow_history || {}).latest_blocked_workflow || null;
    return {
      blockers: snapshot.blockers || [],
      latest_blocked_workflow: latestBlocked ? {
        workflow: latestBlocked.workflow,
        blocker_reason: latestBlocked.blocker_reason,
        requested_by: latestBlocked.requested_by || null,
      } : null,
    };
  }

  function activeRouteIds(statusPayload) {
    const latestWorkflow = (statusPayload || {}).latest_workflow || {};
    const queue = ((statusPayload || {}).approval_queue || {}).pending || [];
    const route = [
      "conductor",
      "commander_api_server",
      "commander_service",
      "session_manager",
      "workflow_registry",
      "commander_bridge",
      "local_control_agent",
    ];
    if (queue.length) {
      route.push("agent_process_manager");
      return route;
    }
    if (latestWorkflow.workflow) {
      route.push("drive_queue", "colab_worker", "validation", "decision", "memory");
    }
    return route;
  }

  function mapNodeStates(statusPayload) {
    const snapshot = (statusPayload || {}).snapshot || {};
    const agent = (statusPayload || {}).agent || {};
    const sessions = (statusPayload || {}).sessions || {};
    const latestWorkflow = (statusPayload || {}).latest_workflow || {};
    const latestReport = (statusPayload || {}).latest_report || {};
    const queue = ((statusPayload || {}).approval_queue || {}).pending || [];
    const blockers = snapshot.blockers || [];

    const stateMap = {};
    for (const node of FIXED_NODES) stateMap[node.id] = "idle";

    stateMap.conductor = "listening";
    stateMap.commander_api_server = "listening";
    stateMap.commander_service = latestWorkflow.workflow ? "active" : "listening";
    stateMap.session_manager = sessions.user_session ? "active" : "idle";
    stateMap.workflow_registry = (((statusPayload || {}).workflow_history || {}).runs || []).length ? "active" : "idle";
    stateMap.agent_process_manager = agent.live ? "listening" : "blocked";
    stateMap.commander_bridge = snapshot.bridge_status === "ready" ? "listening" : "error";
    stateMap.local_control_agent = agent.live ? statusOr("listening", snapshot.agent_status, "watch", "listening") : "blocked";
    stateMap.drive_queue = latestWorkflow.workflow ? "active" : "idle";
    stateMap.colab_worker = latestWorkflow.workflow ? "active" : "idle";
    stateMap.validation = latestReport.status === "FAIL" ? "error" : (latestWorkflow.workflow ? "active" : "idle");
    stateMap.decision = latestWorkflow.final_verdict === "BLOCKED" ? "blocked" : (latestWorkflow.workflow ? "active" : "idle");
    stateMap.memory = latestWorkflow.final_verdict === "PASS" ? "active" : "idle";

    if (queue.length) {
      stateMap.workflow_registry = "blocked";
      stateMap.commander_service = "blocked";
    }
    if (blockers.length) {
      stateMap.decision = "blocked";
    }
    if (String(snapshot.agent_status || "").toLowerCase() === "error") {
      stateMap.local_control_agent = "error";
      stateMap.agent_process_manager = "error";
    }
    return stateMap;
  }

  function mapOrchestraState(statusPayload) {
    const stateMap = mapNodeStates(statusPayload);
    const latestWorkflow = (statusPayload || {}).latest_workflow || {};
    const verdictBoard = {
      workflow: latestWorkflow.workflow || null,
      verdict: latestWorkflow.final_verdict || latestWorkflow.status || null,
      approval_state: latestWorkflow.approval_state || null,
      execution_state: latestWorkflow.execution_state || null,
    };
    return {
      nodes: FIXED_NODES.map((node) => ({
        ...node,
        state: stateMap[node.id] || "idle",
      })),
      edges: EDGE_LIST.map(([from, to]) => ({
        from,
        to,
        active: activeRouteIds(statusPayload).includes(from) && activeRouteIds(statusPayload).includes(to),
      })),
      current_workflow: latestWorkflow.workflow || null,
      verdict_board: verdictBoard,
      timeline_feed: buildTimeline(statusPayload),
      latest_blocker: buildLatestBlocker(statusPayload),
    };
  }

  const exported = {
    FIXED_NODES,
    EDGE_LIST,
    mapOrchestraState,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
  if (root) {
    root.MikageOrchestraView = exported;
  }
})(typeof window !== "undefined" ? window : globalThis);
