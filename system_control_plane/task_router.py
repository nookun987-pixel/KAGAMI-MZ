#!/usr/bin/env python3
"""
Task Router - MVP Control Plane
Handles task assignment and routing logic
"""

import json
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

class TaskRouter:
    def __init__(self, queue_path: str = "task_queue.json", registry_path: str = "agent_registry.json"):
        self.queue_path = queue_path
        self.registry_path = registry_path
        self.allowed_statuses = ["QUEUED", "ASSIGNED", "DONE", "FAILED"]
        
    def load_queue(self) -> Dict[str, Any]:
        """Load task queue from file"""
        try:
            with open(self.queue_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"tasks": [], "metadata": {"version": "1.0.0", "created_at": datetime.now(timezone.utc).isoformat()}}
    
    def save_queue(self, queue_data: Dict[str, Any]) -> None:
        """Save task queue to file"""
        queue_data["metadata"]["last_updated"] = datetime.now(timezone.utc).isoformat()
        with open(self.queue_path, 'w') as f:
            json.dump(queue_data, f, indent=2)
    
    def load_registry(self) -> Dict[str, Any]:
        """Load agent registry from file"""
        try:
            with open(self.registry_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"agents": [], "metadata": {"version": "1.0.0", "created_at": datetime.now(timezone.utc).isoformat()}}
    
    def create_task(self, title: str, assigned_agent: str, scope_files: List[str]) -> str:
        """Create a new task"""
        task_id = f"TASK_{uuid.uuid4().hex[:6].upper()}"
        
        task = {
            "task_id": task_id,
            "title": title,
            "assigned_agent": assigned_agent,
            "scope_files": scope_files,
            "status": "QUEUED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "result": None
        }
        
        queue_data = self.load_queue()
        queue_data["tasks"].append(task)
        self.save_queue(queue_data)
        
        return task_id
    
    def assign_task(self, task_id: str) -> bool:
        """Assign task to agent (change status to ASSIGNED)"""
        queue_data = self.load_queue()
        
        for task in queue_data["tasks"]:
            if task["task_id"] == task_id and task["status"] == "QUEUED":
                task["status"] = "ASSIGNED"
                self.save_queue(queue_data)
                return True
        
        return False
    
    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task by ID"""
        queue_data = self.load_queue()
        
        for task in queue_data["tasks"]:
            if task["task_id"] == task_id:
                return task
        
        return None
    
    def list_tasks(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all tasks, optionally filtered by status"""
        queue_data = self.load_queue()
        tasks = queue_data["tasks"]
        
        if status:
            tasks = [task for task in tasks if task["status"] == status]
        
        return tasks
    
    def get_available_agents(self) -> List[Dict[str, Any]]:
        """Get list of active agents"""
        registry_data = self.load_registry()
        return [agent for agent in registry_data["agents"] if agent.get("status") == "ACTIVE"]
