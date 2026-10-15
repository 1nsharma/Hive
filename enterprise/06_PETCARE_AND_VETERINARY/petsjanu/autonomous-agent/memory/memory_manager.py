"""
Memory Management System.
Handles short-term context management and long-term vector storage.
"""

import asyncio
import hashlib
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime

agent_dir = Path(__file__).resolve().parent.parent
if str(agent_dir) not in sys.path:
    sys.path.insert(0, str(agent_dir))

from utils.compat import get_logger

logger = get_logger("memory_manager")



@dataclass
class MemoryEntry:
    """Represents a single memory entry."""
    content: str
    timestamp: float
    importance: float = 0.5
    metadata: Dict[str, Any] = field(default_factory=dict)
    embedding: Optional[List[float]] = None
    
    def __hash__(self):
        return hash(hashlib.md5(self.content.encode()).hexdigest())


class ShortTermMemory:
    """
    Short-term memory with sliding window and summarization.
    
    Features:
    - Configurable context length
    - Priority-based retention
    - Automatic summarization triggers
    - Thread-safe operations
    """
    
    def __init__(
        self,
        max_context_length: int = 8000,
        summary_threshold: float = 0.8,
        sliding_window_size: int = 50
    ):
        self.max_context_length = max_context_length
        self.summary_threshold = summary_threshold
        self.sliding_window_size = sliding_window_size
        
        self.entries: List[MemoryEntry] = []
        self.summary: str = ""
        self._lock = asyncio.Lock()
        
        # Token estimation (simplified: ~4 chars per token)
        self.chars_per_token = 4
    
    async def add(
        self,
        content: str,
        importance: float = 0.5,
        metadata: Optional[Dict[str, Any]] = None
    ) -> MemoryEntry:
        """Add a new memory entry."""
        async with self._lock:
            entry = MemoryEntry(
                content=content,
                timestamp=datetime.now().timestamp(),
                importance=importance,
                metadata=metadata or {}
            )
            
            self.entries.append(entry)
            
            # Apply sliding window if needed
            if len(self.entries) > self.sliding_window_size:
                await self._apply_sliding_window()
            
            # Check if summarization needed
            if self._estimate_tokens() > self.max_context_length * self.summary_threshold:
                await self._summarize()
            
            logger.debug("memory_added", entry_count=len(self.entries))
            return entry
    
    async def get_context(self) -> str:
        """Get current context as formatted string."""
        async with self._lock:
            context_parts = []
            
            # Add summary if exists
            if self.summary:
                context_parts.append(f"[SUMMARY]\n{self.summary}\n[/SUMMARY]\n")
            
            # Add recent entries
            for entry in self.entries[-self.sliding_window_size:]:
                context_parts.append(f"[{entry.timestamp:.0f}] {entry.content}")
            
            return "\n".join(context_parts)
    
    async def clear(self):
        """Clear all short-term memories."""
        async with self._lock:
            self.entries.clear()
            self.summary = ""
            logger.info("short_term_memory_cleared")
    
    def _estimate_tokens(self) -> int:
        """Estimate current token count."""
        total_chars = sum(len(e.content) for e in self.entries)
        total_chars += len(self.summary)
        return total_chars // self.chars_per_token
    
    async def _apply_sliding_window(self):
        """Apply sliding window to remove oldest entries."""
        # Keep most important entries even if old
        sorted_by_importance = sorted(
            self.entries,
            key=lambda e: e.importance,
            reverse=True
        )
        
        # Keep top important entries + recent ones
        important_entries = [
            e for e in sorted_by_importance 
            if e.importance >= 0.8
        ]
        
        recent_entries = self.entries[-(self.sliding_window_size // 2):]
        
        # Merge and deduplicate
        seen = set()
        merged = []
        for entry in important_entries + recent_entries:
            if hash(entry) not in seen:
                seen.add(hash(entry))
                merged.append(entry)
        
        self.entries = sorted(merged, key=lambda e: e.timestamp)
        
        logger.debug(
            "sliding_window_applied",
            old_count=self.sliding_window_size,
            new_count=len(self.entries)
        )
    
    async def _summarize(self):
        """
        Summarize older entries to save space.
        
        Note: In production, this would call an LLM to generate the summary.
        For now, we use a simple concatenation strategy.
        """
        if len(self.entries) < 10:
            return
        
        # Get older entries (not in recent window)
        older_entries = self.entries[:-(self.sliding_window_size // 2)]
        
        if not older_entries:
            return
        
        # Simple summarization (replace with LLM call in production)
        summary_text = f"Previous interactions ({len(older_entries)} entries): "
        key_points = []
        for entry in older_entries[:10]:  # Sample up to 10 entries
            key_points.append(entry.content[:100])
        
        summary_text += "; ".join(key_points)
        if len(older_entries) > 10:
            summary_text += f" ... and {len(older_entries) - 10} more entries."
        
        self.summary = summary_text
        
        # Remove summarized entries
        self.entries = self.entries[-(self.sliding_window_size // 2):]
        
        logger.info("memory_summarized", removed_count=len(older_entries))
    
    async def search(self, query: str, limit: int = 5) -> List[MemoryEntry]:
        """Simple keyword search in short-term memory."""
        async with self._lock:
            query_lower = query.lower()
            scored_entries = []
            
            for entry in self.entries:
                score = 0
                content_lower = entry.content.lower()
                
                # Simple scoring based on keyword presence
                if query_lower in content_lower:
                    score += 2.0
                elif any(word in content_lower for word in query_lower.split()):
                    score += 1.0
                
                # Boost by importance
                score *= entry.importance
                
                if score > 0:
                    scored_entries.append((score, entry))
            
            # Sort by score and return top results
            scored_entries.sort(reverse=True, key=lambda x: x[0])
            return [entry for _, entry in scored_entries[:limit]]


class LongTermMemory:
    """
    Long-term memory using vector database.
    
    Features:
    - Semantic search via embeddings
    - Persistent storage
    - Experience retrieval
    - RAG support
    """
    
    def __init__(
        self,
        backend: str = "qdrant",
        host: str = "localhost",
        port: int = 6333,
        collection_name: str = "agent_memory",
        vector_size: int = 384,
        embedding_model: str = "all-MiniLM-L6-v2"
    ):
        self.backend = backend
        self.host = host
        self.port = port
        self.collection_name = collection_name
        self.vector_size = vector_size
        self.embedding_model = embedding_model
        
        self._client = None
        self._initialized = False
        self._lock = asyncio.Lock()
        
        # Mock embedding function (replace with actual model in production)
        self._embedding_fn = self._mock_embedding
    
    async def initialize(self):
        """Initialize the vector database connection."""
        async with self._lock:
            if self._initialized:
                return
            
            try:
                if self.backend == "qdrant":
                    from qdrant_client import QdrantClient
                    from qdrant_client.http.models import Distance, VectorParams
                    
                    self._client = QdrantClient(host=self.host, port=self.port)
                    
                    # Create collection if not exists
                    collections = self._client.get_collections().collections
                    collection_names = [c.name for c in collections]
                    
                    if self.collection_name not in collection_names:
                        self._client.create_collection(
                            collection_name=self.collection_name,
                            vectors_config=VectorParams(
                                size=self.vector_size,
                                distance=Distance.COSINE
                            )
                        )
                        logger.info(
                            "vector_collection_created",
                            name=self.collection_name
                        )
                
                self._initialized = True
                logger.info("long_term_memory_initialized", backend=self.backend)
                
            except Exception as e:
                logger.error("long_term_memory_init_failed", error=str(e))
                # Fall back to in-memory storage
                self._client = {"memory": []}  # Mock client
                self._initialized = True
    
    def _mock_embedding(self, text: str) -> List[float]:
        """Generate mock embedding (replace with actual model)."""
        # Simple hash-based mock embedding
        import random
        random.seed(hash(text))
        return [random.gauss(0, 1) for _ in range(self.vector_size)]
    
    async def store(
        self,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Store a memory in long-term storage."""
        if not self._initialized:
            await self.initialize()
        
        # Generate embedding
        embedding = self._embedding_fn(content)
        
        memory_id = hashlib.md5(content.encode()).hexdigest()
        
        async with self._lock:
            if isinstance(self._client, dict):
                # In-memory fallback
                self._client["memory"].append({
                    "id": memory_id,
                    "content": content,
                    "embedding": embedding,
                    "metadata": metadata or {},
                    "timestamp": datetime.now().isoformat()
                })
            else:
                # Qdrant storage
                from qdrant_client.http.models import PointStruct
                
                self._client.upsert(
                    collection_name=self.collection_name,
                    points=[
                        PointStruct(
                            id=hash(memory_id) % (2**63),
                            vector=embedding,
                            payload={
                                "content": content,
                                "metadata": metadata or {},
                                "timestamp": datetime.now().isoformat()
                            }
                        )
                    ]
                )
        
        logger.debug("memory_stored", id=memory_id)
        return memory_id
    
    async def search(
        self,
        query: str,
        limit: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Search for similar memories."""
        if not self._initialized:
            await self.initialize()
        
        query_embedding = self._embedding_fn(query)
        
        async with self._lock:
            if isinstance(self._client, dict):
                # In-memory fallback: simple cosine similarity
                results = []
                for memory in self._client["memory"]:
                    similarity = self._cosine_similarity(
                        query_embedding, memory["embedding"]
                    )
                    results.append({
                        **memory,
                        "similarity": similarity
                    })
                
                results.sort(key=lambda x: x["similarity"], reverse=True)
                return results[:limit]
            else:
                # Qdrant search
                search_results = self._client.search(
                    collection_name=self.collection_name,
                    query_vector=query_embedding,
                    limit=limit,
                    query_filter=self._build_filter(filter_metadata) if filter_metadata else None
                )
                
                return [
                    {
                        "content": r.payload.get("content"),
                        "metadata": r.payload.get("metadata"),
                        "timestamp": r.payload.get("timestamp"),
                        "similarity": r.score
                    }
                    for r in search_results
                ]
    
    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        dot_product = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x * x for x in a) ** 0.5
        norm_b = sum(x * x for x in b) ** 0.5
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        
        return dot_product / (norm_a * norm_b)
    
    def _build_filter(self, metadata_filter: Dict[str, Any]):
        """Build Qdrant filter from metadata."""
        from qdrant_client.http.models import FieldCondition, MatchValue, Filter
        
        conditions = [
            FieldCondition(
                key=f"metadata.{key}",
                match=MatchValue(value=value)
            )
            for key, value in metadata_filter.items()
        ]
        
        return Filter(must=conditions)
    
    async def delete(self, memory_id: str) -> bool:
        """Delete a memory by ID."""
        async with self._lock:
            if isinstance(self._client, dict):
                original_count = len(self._client["memory"])
                self._client["memory"] = [
                    m for m in self._client["memory"] if m["id"] != memory_id
                ]
                deleted = len(self._client["memory"]) < original_count
            else:
                # Qdrant deletion
                self._client.delete(
                    collection_name=self.collection_name,
                    points_selector=[hash(memory_id) % (2**63)]
                )
                deleted = True
        
        if deleted:
            logger.debug("memory_deleted", id=memory_id)
        
        return deleted
    
    async def get_recent(
        self,
        limit: int = 10,
        metadata_filter: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Get most recent memories."""
        async with self._lock:
            if isinstance(self._client, dict):
                memories = self._client["memory"]
                if metadata_filter:
                    memories = [
                        m for m in memories
                        if all(
                            m.get("metadata", {}).get(k) == v
                            for k, v in metadata_filter.items()
                        )
                    ]
                
                memories.sort(
                    key=lambda x: x.get("timestamp", ""),
                    reverse=True
                )
                return memories[:limit]
            else:
                # For Qdrant, would need to implement scroll with ordering
                # Simplified version using search with zero vector
                return await self.search("", limit=limit)


class MemoryManager:
    """
    Unified memory manager coordinating short and long-term memory.
    """
    
    def __init__(self, stm_config: Dict[str, Any], ltm_config: Dict[str, Any]):
        self.stm = ShortTermMemory(**stm_config)
        self.ltm = LongTermMemory(**ltm_config)
        self._initialized = False
    
    async def initialize(self):
        """Initialize memory systems."""
        await self.ltm.initialize()
        self._initialized = True
        logger.info("memory_manager_initialized")
    
    async def add_experience(
        self,
        task: str,
        outcome: str,
        success: bool,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Store a complete experience in both memory systems."""
        experience = f"Task: {task}\nOutcome: {outcome}\nSuccess: {success}"
        
        # Add to short-term
        await self.stm.add(
            content=experience,
            importance=0.9 if success else 0.7,
            metadata={**(metadata or {}), "success": success}
        )
        
        # Add to long-term
        await self.ltm.store(
            content=experience,
            metadata={**(metadata or {}), "success": success, "type": "experience"}
        )
    
    async def retrieve_relevant(
        self,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant memories from both systems."""
        stm_results = await self.stm.search(query, limit=limit)
        ltm_results = await self.ltm.search(query, limit=limit)
        
        # Combine and deduplicate
        all_results = []
        seen_content = set()
        
        for entry in stm_results:
            if entry.content not in seen_content:
                seen_content.add(entry.content)
                all_results.append({
                    "content": entry.content,
                    "source": "short_term",
                    "importance": entry.importance
                })
        
        for result in ltm_results:
            if result["content"] not in seen_content:
                seen_content.add(result["content"])
                all_results.append({
                    "content": result["content"],
                    "source": "long_term",
                    "similarity": result.get("similarity", 0)
                })
        
        return all_results
    
    async def get_context(self) -> str:
        """Get full context for agent decision-making."""
        stm_context = await self.stm.get_context()
        return stm_context
