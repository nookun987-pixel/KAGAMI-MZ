#!/usr/bin/env python3
"""
Example Usage - MVP Control Plane
Demonstrates creating tasks, assigning agents, and writing results
"""

import os
import sys
from task_router import TaskRouter
from proof_verdict_writer import ProofVerdictWriter

def main():
    print("=== MVP Control Plane Example Usage ===\n")
    
    # Initialize components
    router = TaskRouter()
    writer = ProofVerdictWriter()
    
    # 1. Create a task
    print("1. Creating task...")
    task_id = router.create_task(
        title="Add material lock to mask prompt builder",
        assigned_agent="windsurf",
        scope_files=[
            "pipeline/claude_spec.py",
            "pipeline/claude_spec_bridge.py"
        ]
    )
    print(f"   Created task: {task_id}")
    
    # 2. Assign task to agent
    print("\n2. Assigning task to agent...")
    assigned = router.assign_task(task_id)
    print(f"   Task assigned: {assigned}")
    
    # 3. Get task details
    print("\n3. Getting task details...")
    task = router.get_task(task_id)
    print(f"   Task: {task['title']}")
    print(f"   Status: {task['status']}")
    print(f"   Agent: {task['assigned_agent']}")
    
    # 4. Write result with proof and verdict
    print("\n4. Writing task result...")
    result_written = writer.write_result(
        task_id=task_id,
        patched_files=["pipeline/claude_spec.py"],
        proof=[
            "final prompt contains material lock",
            "negative prompt contains anti-fake-material lock"
        ],
        verdict="DONE"
    )
    print(f"   Result written: {result_written}")
    
    # 5. Verify task completion
    print("\n5. Verifying task completion...")
    is_complete = writer.verify_task_completion(task_id)
    print(f"   Task completed: {is_complete}")
    
    # 6. Show final task state
    print("\n6. Final task state:")
    final_task = router.get_task(task_id)
    print(f"   Status: {final_task['status']}")
    print(f"   Result: {final_task['result']}")
    
    # 7. List all tasks
    print("\n7. All tasks in queue:")
    all_tasks = router.list_tasks()
    for task in all_tasks:
        print(f"   - {task['task_id']}: {task['title']} ({task['status']})")
    
    print("\n=== Example Complete ===")

if __name__ == "__main__":
    main()
