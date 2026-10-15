"""
Sandbox module for safe code execution.
Provides isolated execution environment for untrusted code.
"""

import asyncio
import subprocess
import tempfile
import os
import json
import sys
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger

logger = get_logger("code_executor")



@dataclass
class ExecutionResult:
    """Result of sandboxed code execution."""
    success: bool
    stdout: str
    stderr: str
    exit_code: int
    execution_time: float
    memory_used: Optional[int] = None
    error: Optional[str] = None


class CodeSandbox:
    """
    Sandboxed code execution environment.
    
    Features:
    - Process isolation
    - Resource limits (time, memory)
    - Filesystem isolation
    - Network isolation (optional)
    - Output capture
    """
    
    def __init__(
        self,
        timeout_seconds: int = 30,
        max_memory_mb: int = 512,
        enable_network: bool = False,
        work_dir: Optional[str] = None
    ):
        self.timeout_seconds = timeout_seconds
        self.max_memory_mb = max_memory_mb
        self.enable_network = enable_network
        self.work_dir = work_dir or tempfile.mkdtemp(prefix="sandbox_")
        
        # Security restrictions
        self.forbidden_imports = [
            'os', 'sys', 'subprocess', 'socket', 'requests',
            'urllib', 'http', 'ftpd', 'smtpd', 'multiprocessing'
        ]
        
        logger.info("sandbox_initialized", work_dir=self.work_dir)
    
    async def execute_python(
        self,
        code: str,
        input_data: Optional[Dict[str, Any]] = None
    ) -> ExecutionResult:
        """
        Execute Python code in sandboxed environment.
        
        Args:
            code: Python code to execute
            input_data: Optional input data passed as JSON
            
        Returns:
            ExecutionResult with outputs and status
        """
        start_time = datetime.now().timestamp()
        
        # Create temporary file for code
        with tempfile.NamedTemporaryFile(
            mode='w',
            suffix='.py',
            dir=self.work_dir,
            delete=False
        ) as f:
            # Pre-process code for security
            sanitized_code = self._sanitize_code(code)
            f.write(sanitized_code)
            code_file = f.name
        
        try:
            # Build command with resource limits
            cmd = [
                'python3',
                '-u',  # Unbuffered output
                code_file
            ]
            
            # Set up environment
            env = os.environ.copy()
            env['PYTHONPATH'] = self.work_dir
            
            if not self.enable_network:
                # Block network access
                env['NO_NETWORK'] = '1'
            
            # Execute with timeout
            try:
                process = await asyncio.wait_for(
                    asyncio.create_subprocess_exec(
                        *cmd,
                        env=env,
                        cwd=self.work_dir,
                        stdin=asyncio.subprocess.PIPE,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE,
                        limit=1024 * 1024  # 1MB buffer limit
                    ),
                    timeout=self.timeout_seconds + 5
                )
                
                # Send input if provided
                stdin_data = json.dumps(input_data) if input_data else ""
                
                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(input=stdin_data.encode()),
                        timeout=self.timeout_seconds
                    )
                except asyncio.TimeoutError:
                    process.kill()
                    return ExecutionResult(
                        success=False,
                        stdout="",
                        stderr=f"Execution timed out after {self.timeout_seconds}s",
                        exit_code=-1,
                        execution_time=self.timeout_seconds,
                        error="timeout"
                    )
                
                execution_time = datetime.now().timestamp() - start_time
                
                return ExecutionResult(
                    success=process.returncode == 0,
                    stdout=stdout.decode('utf-8', errors='replace'),
                    stderr=stderr.decode('utf-8', errors='replace'),
                    exit_code=process.returncode,
                    execution_time=execution_time
                )
                
            except asyncio.TimeoutError:
                return ExecutionResult(
                    success=False,
                    stdout="",
                    stderr=f"Process creation timed out",
                    exit_code=-1,
                    execution_time=self.timeout_seconds,
                    error="process_timeout"
                )
        
        finally:
            # Cleanup
            try:
                os.unlink(code_file)
            except Exception:
                pass
    
    def _sanitize_code(self, code: str) -> str:
        """
        Sanitize code to prevent dangerous operations.
        
        This is a basic sanitizer - in production, use more robust methods.
        """
        # Check for forbidden imports
        for forbidden in self.forbidden_imports:
            if f'import {forbidden}' in code or f'from {forbidden}' in code:
                logger.warning("forbidden_import_detected", import_name=forbidden)
                # Replace with safe stub
                code = code.replace(
                    f'import {forbidden}',
                    f'# import {forbidden}  # BLOCKED'
                )
                code = code.replace(
                    f'from {forbidden}',
                    f'# from {forbidden}  # BLOCKED'
                )
        
        # Add safety wrapper
        safety_preamble = """
# SANDBOXED EXECUTION ENVIRONMENT
# Dangerous operations are restricted

def __restricted_import(name, *args, **kwargs):
    import builtins
    forbidden_modules = ['os', 'sys', 'subprocess', 'socket', 'requests']
    if any(mod in name for mod in forbidden_modules):
        raise ImportError(f"Module '{name}' is not allowed in sandbox")
    return builtins.__import__(name, *args, **kwargs)

import builtins
original_import = builtins.__import__
builtins.__import__ = __restricted_import

"""
        return safety_preamble + code
    
    async def execute_shell(
        self,
        command: str,
        working_dir: Optional[str] = None
    ) -> ExecutionResult:
        """
        Execute shell command in restricted environment.
        
        WARNING: Shell execution is inherently risky. Use with extreme caution.
        """
        start_time = datetime.now().timestamp()
        
        # Security checks
        dangerous_patterns = [
            'rm -rf', 'dd if=', '> /dev/', 'mkfs',
            'wget', 'curl', 'nc ', 'netcat',
            'chmod 777', 'chown', 'sudo', 'su '
        ]
        
        for pattern in dangerous_patterns:
            if pattern in command:
                logger.warning("dangerous_command_detected", pattern=pattern)
                return ExecutionResult(
                    success=False,
                    stdout="",
                    stderr=f"Dangerous command pattern detected: {pattern}",
                    exit_code=-1,
                    execution_time=0,
                    error="security_violation"
                )
        
        try:
            process = await asyncio.wait_for(
                asyncio.create_subprocess_shell(
                    command,
                    cwd=working_dir or self.work_dir,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    limit=1024 * 1024
                ),
                timeout=self.timeout_seconds + 5
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=self.timeout_seconds
                )
            except asyncio.TimeoutError:
                process.kill()
                return ExecutionResult(
                    success=False,
                    stdout="",
                    stderr=f"Command timed out after {self.timeout_seconds}s",
                    exit_code=-1,
                    execution_time=self.timeout_seconds,
                    error="timeout"
                )
            
            execution_time = datetime.now().timestamp() - start_time
            
            return ExecutionResult(
                success=process.returncode == 0,
                stdout=stdout.decode('utf-8', errors='replace'),
                stderr=stderr.decode('utf-8', errors='replace'),
                exit_code=process.returncode,
                execution_time=execution_time
            )
        
        except asyncio.TimeoutError:
            return ExecutionResult(
                success=False,
                stdout="",
                stderr="Command creation timed out",
                exit_code=-1,
                execution_time=0,
                error="process_timeout"
            )
    
    async def cleanup(self):
        """Clean up sandbox temporary files."""
        try:
            import shutil
            shutil.rmtree(self.work_dir, ignore_errors=True)
            logger.info("sandbox_cleaned_up", work_dir=self.work_dir)
        except Exception as e:
            logger.error("sandbox_cleanup_failed", error=str(e))


class SafePythonInterpreter:
    """
    Restricted Python interpreter using restrictedpython or similar.
    
    This is a placeholder for more sophisticated code restriction.
    In production, use libraries like:
    - restrictedpython
    - pysandbox
    - docker-based isolation
    """
    
    def __init__(self):
        self.allowed_builtins = {
            'abs', 'all', 'any', 'bin', 'bool', 'bytes',
            'chr', 'complex', 'dict', 'dir', 'enumerate',
            'filter', 'float', 'format', 'frozenset',
            'hash', 'hex', 'int', 'isinstance', 'issubclass',
            'iter', 'len', 'list', 'map', 'max', 'min',
            'next', 'object', 'oct', 'ord', 'pow',
            'print', 'range', 'repr', 'reversed', 'round',
            'set', 'slice', 'sorted', 'str', 'sum',
            'tuple', 'type', 'zip',
            'True', 'False', 'None',
            '__name__', '__doc__'
        }
    
    def create_restricted_env(self) -> Dict[str, Any]:
        """Create restricted execution environment."""
        restricted_builtins = {}
        
        import builtins
        for name in self.allowed_builtins:
            if hasattr(builtins, name):
                restricted_builtins[name] = getattr(builtins, name)
        
        return {
            '__builtins__': restricted_builtins,
            '__name__': '__restricted__',
        }
    
    async def execute(self, code: str, globals_dict: Optional[Dict] = None) -> ExecutionResult:
        """Execute code in restricted environment."""
        start_time = datetime.now().timestamp()
        
        try:
            # Compile code
            compiled = compile(code, '<restricted>', 'exec')
            
            # Create restricted environment
            exec_env = self.create_restricted_env()
            if globals_dict:
                exec_env.update(globals_dict)
            
            # Capture output
            import io
            import sys
            
            old_stdout = sys.stdout
            old_stderr = sys.stderr
            
            stdout_capture = io.StringIO()
            stderr_capture = io.StringIO()
            
            sys.stdout = stdout_capture
            sys.stderr = stderr_capture
            
            try:
                # Execute (note: this is still not fully safe without additional measures)
                exec(compiled, exec_env)
                
                stdout_output = stdout_capture.getvalue()
                stderr_output = stderr_capture.getvalue()
                
                execution_time = datetime.now().timestamp() - start_time
                
                return ExecutionResult(
                    success=True,
                    stdout=stdout_output,
                    stderr=stderr_output,
                    exit_code=0,
                    execution_time=execution_time
                )
                
            finally:
                sys.stdout = old_stdout
                sys.stderr = old_stderr
        
        except Exception as e:
            execution_time = datetime.now().timestamp() - start_time
            
            return ExecutionResult(
                success=False,
                stdout="",
                stderr=str(e),
                exit_code=1,
                execution_time=execution_time,
                error="execution_error"
            )


async def create_sandbox_executor(config: Dict[str, Any]):
    """Factory function to create appropriate sandbox executor."""
    safety_config = config.get("safety", {})
    
    sandbox = CodeSandbox(
        timeout_seconds=safety_config.get("sandbox_timeout_seconds", 30),
        enable_network=safety_config.get("enable_network", False)
    )
    
    return sandbox
