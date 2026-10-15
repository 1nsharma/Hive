"""
Compatibility layer providing fallbacks for third-party libraries when running in standard Python 3.10+ environments.
"""

import sys
import os
import json
import logging
import re
from typing import Any, Dict, List, Optional, Callable
from dataclasses import dataclass, field, is_dataclass, asdict

# -----------------------------------------------------------------------------
# Structured Logger Fallback
# -----------------------------------------------------------------------------
try:
    import structlog
    get_logger = structlog.get_logger
except ImportError:
    class StructuredLogger:
        def __init__(self, name: str = "agent"):
            self.name = name
            logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
            self._logger = logging.getLogger(name)

        def _format_event(self, event: str, **kwargs) -> str:
            if not kwargs:
                return event
            try:
                formatted_kwargs = " ".join(f"{k}={v!r}" for k, v in kwargs.items())
                return f"{event} | {formatted_kwargs}"
            except Exception:
                return f"{event} {kwargs}"

        def info(self, event: str, *args, **kwargs):
            self._logger.info(self._format_event(event, **kwargs))

        def debug(self, event: str, *args, **kwargs):
            self._logger.debug(self._format_event(event, **kwargs))

        def warning(self, event: str, *args, **kwargs):
            self._logger.warning(self._format_event(event, **kwargs))

        def error(self, event: str, *args, **kwargs):
            self._logger.error(self._format_event(event, **kwargs))

        def exception(self, event: str, *args, **kwargs):
            self._logger.exception(self._format_event(event, **kwargs))

        def bind(self, **kwargs):
            return self

    def get_logger(name: str = "agent"):
        return StructuredLogger(name)


# -----------------------------------------------------------------------------
# YAML Parser Fallback
# -----------------------------------------------------------------------------
try:
    import yaml
    yaml_load = yaml.safe_load
    yaml_dump = yaml.dump
except ImportError:
    def _parse_yaml_scalar(val: str) -> Any:
        val = val.strip()
        if val == "" or val == "null" or val == "~":
            return None
        if val.lower() == "true":
            return True
        if val.lower() == "false":
            return False
        # Try integer
        if re.match(r'^-?\d+$', val):
            return int(val)
        # Try float
        if re.match(r'^-?\d+\.\d+$', val):
            return float(val)
        # Quoted strings
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            return val[1:-1]
        # Bracket list
        if val.startswith('[') and val.endswith(']'):
            items = [item.strip() for item in val[1:-1].split(',') if item.strip()]
            return [_parse_yaml_scalar(item) for item in items]
        return val

    def yaml_load(stream_or_str: Any) -> Any:
        """Lightweight YAML parser for structured configs."""
        text = stream_or_str.read() if hasattr(stream_or_str, 'read') else str(stream_or_str)
        lines = text.splitlines()
        
        # Simple recursive line parser
        def parse_lines(lines_subset, current_indent=0):
            result = {}
            current_key = None
            multiline_str = []
            multiline_pipe = False
            
            i = 0
            while i < len(lines_subset):
                line = lines_subset[i]
                stripped = line.strip()
                
                # Skip comments and empty lines
                if not stripped or stripped.startswith('#'):
                    i += 1
                    continue
                
                indent = len(line) - len(line.lstrip())
                
                # Check for pipe multiline string
                if multiline_pipe:
                    if indent > current_indent:
                        multiline_str.append(stripped)
                        i += 1
                        continue
                    else:
                        result[current_key] = "\n".join(multiline_str)
                        multiline_pipe = False
                        multiline_str = []
                
                if ':' in stripped:
                    parts = stripped.split(':', 1)
                    key = parts[0].strip()
                    val = parts[1].strip()
                    
                    if key.startswith('- '):
                        # List of objects
                        pass
                    
                    if val == '|' or val == '>':
                        current_key = key
                        multiline_pipe = True
                        multiline_str = []
                        current_indent = indent
                        i += 1
                        continue
                    elif val == '':
                        # Sub-dictionary or list follows
                        sub_lines = []
                        j = i + 1
                        while j < len(lines_subset):
                            next_line = lines_subset[j]
                            next_stripped = next_line.strip()
                            if next_stripped and not next_stripped.startswith('#'):
                                next_indent = len(next_line) - len(next_line.lstrip())
                                if next_indent <= indent:
                                    break
                            sub_lines.append(next_line)
                            j += 1
                        
                        # Check if it is a list
                        first_non_empty = next((l.strip() for l in sub_lines if l.strip() and not l.strip().startswith('#')), '')
                        if first_non_empty.startswith('- '):
                            list_items = []
                            curr_obj_lines = []
                            for sl in sub_lines:
                                sl_strip = sl.strip()
                                if sl_strip.startswith('- '):
                                    if curr_obj_lines:
                                        list_items.append(parse_lines(curr_obj_lines, indent + 2))
                                        curr_obj_lines = []
                                    item_val = sl_strip[2:].strip()
                                    if ':' in item_val:
                                        curr_obj_lines.append("  " + item_val)
                                    else:
                                        list_items.append(_parse_yaml_scalar(item_val))
                                else:
                                    if curr_obj_lines:
                                        curr_obj_lines.append(sl)
                            if curr_obj_lines:
                                list_items.append(parse_lines(curr_obj_lines, indent + 2))
                            result[key] = list_items
                        else:
                            result[key] = parse_lines(sub_lines, indent + 2)
                        i = j
                        continue
                    else:
                        result[key] = _parse_yaml_scalar(val)
                i += 1
                
            if multiline_pipe and current_key:
                result[current_key] = "\n".join(multiline_str)
            return result

        try:
            # First try json in case it is json-compatible
            return json.loads(text)
        except Exception:
            try:
                return parse_lines(lines, 0)
            except Exception:
                return {}

    def yaml_dump(data: Any, default_flow_style: bool = False) -> str:
        return json.dumps(data, indent=2)


# -----------------------------------------------------------------------------
# Pydantic Fallback
# -----------------------------------------------------------------------------
try:
    import pydantic
    BaseModel = pydantic.BaseModel
    Field = pydantic.Field
    HttpUrl = str
    ValidationError = pydantic.ValidationError
except ImportError:
    class ValidationError(Exception):
        pass

    def Field(default=None, default_factory=None, **kwargs):
        if default_factory is not None:
            return default_factory()
        return default

    HttpUrl = str

    class BaseModel:
        def __init__(self, **kwargs):
            # Assign attributes based on defaults and provided values
            annotations = getattr(self.__class__, '__annotations__', {})
            for key, val in self.__class__.__dict__.items():
                if not key.startswith('_') and not callable(val):
                    setattr(self, key, val)
            for k, v in kwargs.items():
                setattr(self, k, v)

        def model_dump(self) -> Dict[str, Any]:
            res = {}
            for k, v in self.__dict__.items():
                if k.startswith('_'):
                    continue
                if isinstance(v, BaseModel):
                    res[k] = v.model_dump()
                elif isinstance(v, list):
                    res[k] = [item.model_dump() if isinstance(item, BaseModel) else item for item in v]
                else:
                    res[k] = v
            return res

        def dict(self) -> Dict[str, Any]:
            return self.model_dump()


# -----------------------------------------------------------------------------
# Tenacity Retry Fallback
# -----------------------------------------------------------------------------
try:
    import tenacity
    retry = tenacity.retry
    stop_after_attempt = tenacity.stop_after_attempt
    wait_exponential = tenacity.wait_exponential
except ImportError:
    def retry(*args, **kwargs):
        def decorator(func):
            async def async_wrapper(*f_args, **f_kwargs):
                attempts = 3
                last_exc = None
                for _ in range(attempts):
                    try:
                        return await func(*f_args, **f_kwargs)
                    except Exception as e:
                        last_exc = e
                raise last_exc

            def sync_wrapper(*f_args, **f_kwargs):
                attempts = 3
                last_exc = None
                for _ in range(attempts):
                    try:
                        return func(*f_args, **f_kwargs)
                    except Exception as e:
                        last_exc = e
                raise last_exc

            import inspect
            return async_wrapper if inspect.iscoroutinefunction(func) else sync_wrapper
        return decorator

    def stop_after_attempt(n):
        return n

    def wait_exponential(**kwargs):
        return None


# -----------------------------------------------------------------------------
# HTTPX Fallback
# -----------------------------------------------------------------------------
try:
    import httpx
except ImportError:
    class MockResponse:
        def __init__(self, status_code: int = 200, json_data: Any = None, text: str = ""):
            self.status_code = status_code
            self._json_data = json_data or {}
            self.text = text or json.dumps(self._json_data)

        def json(self):
            return self._json_data

        def raise_for_status(self):
            if self.status_code >= 400:
                raise RuntimeError(f"HTTP error {self.status_code}: {self.text}")

    class Timeout:
        def __init__(self, timeout: float = 30.0):
            self.timeout = timeout

    class Limits:
        def __init__(self, max_keepalive_connections: int = 10):
            pass

    class AsyncClient:
        def __init__(self, timeout: Any = None, limits: Any = None):
            self.timeout = timeout

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            pass

        async def aclose(self):
            pass

        async def get(self, url: str, headers: Any = None, timeout: Any = None):
            return MockResponse(200, {"status": "ok", "tools": []})

        async def post(self, url: str, json: Any = None, headers: Any = None, timeout: Any = None):
            return MockResponse(200, {"status": "completed", "output": "Execution finished successfully."})

    class HttpxModule:
        AsyncClient = AsyncClient
        Timeout = Timeout
        Limits = Limits

    httpx = HttpxModule()

