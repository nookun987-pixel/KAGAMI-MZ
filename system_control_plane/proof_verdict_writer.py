#!/usr/bin/env python3
"""
Proof Verdict Writer - MVP Control Plane
Handles task results, proof collection, and verdict writing
"""

import json
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any

class ProofVerdictWriter:
    def __init__(self, queue_path: str = "task_queue.json"):
        self.queue_path = queue_path
        self.allowed_verdicts = ["DONE", "FAILED", "PARTIAL"]
        
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
    
    def write_result(self, task_id: str, patched_files: List[str], proof: List[str], verdict: str) -> bool:
        """Write task result with proof and verdict"""
        if verdict not in self.allowed_verdicts:
            raise ValueError(f"Invalid verdict: {verdict}. Allowed: {self.allowed_verdicts}")
        
        queue_data = self.load_queue()
        
        for task in queue_data["tasks"]:
            if task["task_id"] == task_id:
                result = {
                    "task_id": task_id,
                    "status": "DONE" if verdict == "DONE" else "FAILED",
                    "patched_files": patched_files,
                    "proof": proof,
                    "verdict": verdict,
                    "completed_at": datetime.now(timezone.utc).isoformat()
                }
                
                task["result"] = result
                task["status"] = result["status"]
                
                self.save_queue(queue_data)
                return True
        
        return False
    
    def get_task_result(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task result by ID"""
        queue_data = self.load_queue()
        
        for task in queue_data["tasks"]:
            if task["task_id"] == task_id:
                return task.get("result")
        
        return None
    
    def get_completed_tasks(self) -> List[Dict[str, Any]]:
        """Get all completed tasks with results"""
        queue_data = self.load_queue()
        return [task for task in queue_data["tasks"] if task.get("result") is not None]
    
    def verify_task_completion(self, task_id: str) -> bool:
        """Verify if task has valid result and verdict"""
        result = self.get_task_result(task_id)
        
        if not result:
            return False
        
        required_fields = ["task_id", "status", "patched_files", "proof", "verdict"]
        return all(field in result for field in required_fields) and result["verdict"] in self.allowed_verdicts
