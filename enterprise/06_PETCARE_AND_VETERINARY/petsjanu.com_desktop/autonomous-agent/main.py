#!/usr/bin/env python3
"""
Main entry point for the Autonomous AI Agent System.

Usage:
    python main.py --config config/default_config.yaml --goal "Your goal here"
    
Or run as a module:
    python -m autonomous_agent.main --config ...
"""

import asyncio
import argparse
import sys
from pathlib import Path
from typing import Optional

# Ensure autonomous-agent directory is in sys.path
agent_dir = Path(__file__).resolve().parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger, yaml_load, yaml_dump

logger = get_logger("main")



async def run_single_goal(
    config_path: str,
    goal: str,
    verbose: bool = False
) -> dict:
    """
    Run a single goal through the multi-agent system.
    
    Args:
        config_path: Path to YAML configuration file
        goal: Goal description
        verbose: Enable verbose output
        
    Returns:
        Execution result dictionary
    """
    # Load configuration
    with open(config_path, 'r') as f:
        config = yaml_load(f)
    
    if verbose:
        logger.info("configuration_loaded", path=config_path)
    
    # Initialize multi-agent system
    from agents.multi_agent import MultiAgentSystem
    
    system = MultiAgentSystem(config)
    
    try:
        await system.initialize()
        
        if verbose:
            logger.info("system_initialized")
            status = system.orchestrator.get_orchestration_status()
            logger.info("orchestration_status", **status)
        
        # Execute goal
        logger.info("executing_goal", goal=goal)
        result = await system.execute_goal(goal)
        
        return result
        
    finally:
        await system.shutdown()


async def run_interactive_mode(config_path: str):
    """
    Run in interactive mode, accepting multiple goals.
    """
    from agents.multi_agent import MultiAgentSystem
    
    # Load configuration
    with open(config_path, 'r') as f:
        config = yaml_load(f)
    
    system = MultiAgentSystem(config)
    
    try:
        await system.initialize()
        print("\n=== Autonomous Agent System (Interactive Mode) ===")
        print("Type 'quit' or 'exit' to stop\n")
        
        while True:
            try:
                goal = input("> Enter your goal: ").strip()
                
                if goal.lower() in ['quit', 'exit', 'q']:
                    print("Shutting down...")
                    break
                
                if not goal:
                    continue
                
                print("\n[Processing...]")
                result = await system.execute_goal(goal)
                
                print("\n=== Result ===")
                print(f"Status: {result.get('status', 'unknown')}")
                
                if result.get('aggregated_result'):
                    print(f"\n{result['aggregated_result']}")
                
                if result.get('task_details'):
                    print("\n=== Task Breakdown ===")
                    for task in result['task_details']:
                        status_icon = "✓" if task['status'] == 'completed' else "✗"
                        print(f"{status_icon} [{task['agent']}] {task['description']}")
                
                print()
                
            except KeyboardInterrupt:
                print("\n[Interrupted]")
                continue
            except Exception as e:
                print(f"\n[Error] {e}")
                continue
    
    finally:
        await system.shutdown()


async def run_demo_mode():
    """
    Run a demonstration with mock components.
    """
    print("\n=== Autonomous Agent System Demo ===\n")
    
    # Create minimal config for demo
    config = {
        "model": {
            "base_url": "http://localhost:11434/v1",
            "model_name": "llama3.1:8b",
            "temperature": 0.7
        },
        "safety": {
            "max_iterations": 10,
            "tool_timeout_seconds": 10
        },
        "memory": {
            "short_term": {"max_context_length": 4000},
            "long_term": {"backend": "qdrant"}
        },
        "agents": [
            {
                "name": "researcher",
                "role": "Information gathering specialist",
                "system_prompt": "You are a research assistant.",
                "specialized_tools": []
            }
        ],
        "orchestrator": {
            "max_parallel_tasks": 2
        }
    }
    
    print("Configuration:")
    print(f"  Model: {config['model']['model_name']}")
    print(f"  Max Iterations: {config['safety']['max_iterations']}")
    print(f"  Agents: {[a['name'] for a in config['agents']]}")
    print()
    
    # Show system architecture
    print("\n=== System Architecture ===")
    print("""
┌─────────────────────────────────────────┐
│         ORCHESTRATOR AGENT              │
│  (Goal Parser & Task Coordinator)       │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Research│ │ Code   │ │Analysis│
│ Agent  │ │ Agent  │ │ Agent  │
└────────┘ └────────┘ └────────┘
    │          │          │
    └──────────┼──────────┘
               ▼
    ┌──────────────────────┐
    │   COGNITIVE LOOP     │
    │  PLAN → ACT → OBSERVE│
    │      → REFLECT       │
    └──────────┬───────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│  STM   │ │  LTM   │ │  MCP   │
│Memory  │ │VectorDB│ │ Tools  │
└────────┘ └────────┘ └────────┘
    """)
    
    print("\n=== Cognitive Loop Phases ===")
    print("""
1. PLAN:   Generate strategic plan with sub-tasks
2. ACT:    Select and execute appropriate tools
3. OBSERVE: Analyze tool outputs and outcomes
4. REFLECT: Evaluate progress and self-correct
    
Repeats until goal achieved or limits reached.
    """)
    
    print("\n=== Safety Mechanisms ===")
    print("""
✓ Maximum iteration limits (prevents infinite loops)
✓ Timeout controls (per-tool and per-task)
✓ Human-in-the-loop approval for high-risk actions
✓ Sandboxed code execution
✓ Complete audit logging
✓ Token budget tracking
    """)
    
    print("\n=== Example Usage ===")
    print("""
# Run a single goal:
python main.py --config config/default_config.yaml \\
    --goal "Research and summarize recent AI developments"

# Run interactive mode:
python main.py --config config/default_config.yaml --interactive

# Run this demo:
python main.py --demo
    """)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Autonomous AI Agent System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --config config.yaml --goal "Analyze sales data"
  %(prog)s --config config.yaml --interactive
  %(prog)s --demo
        """
    )
    
    parser.add_argument(
        '--config', '-c',
        type=str,
        default='config/default_config.yaml',
        help='Path to configuration YAML file'
    )
    
    parser.add_argument(
        '--goal', '-g',
        type=str,
        help='Single goal to execute'
    )
    
    parser.add_argument(
        '--interactive', '-i',
        action='store_true',
        help='Run in interactive mode'
    )
    
    parser.add_argument(
        '--demo', '-d',
        action='store_true',
        help='Run demonstration mode'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    # Handle demo mode
    if args.demo:
        asyncio.run(run_demo_mode())
        return 0
    
    # Validate config path
    config_path = Path(args.config)
    if not config_path.exists():
        print(f"Error: Configuration file not found: {config_path}")
        return 1
    
    # Run interactive mode
    if args.interactive:
        asyncio.run(run_interactive_mode(str(config_path)))
        return 0
    
    # Run single goal
    if args.goal:
        result = asyncio.run(run_single_goal(
            str(config_path),
            args.goal,
            verbose=args.verbose
        ))
        
        # Print result
        print("\n=== Execution Result ===")
        print(f"Status: {result.get('status', 'unknown')}")
        print(f"Goal: {result.get('goal', '')}")
        print(f"Iterations: {result.get('iterations', 0)}")
        print(f"Actions Taken: {result.get('actions_taken', 0)}")
        
        if result.get('aggregated_result'):
            print(f"\nResult:\n{result['aggregated_result']}")
        
        if result.get('error'):
            print(f"\nError: {result['error']}")
        
        return 0 if result.get('status') == 'completed' else 1
    
    # No action specified - show help
    parser.print_help()
    return 0


if __name__ == '__main__':
    sys.exit(main())
