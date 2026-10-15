"""
PetJanu Dataset Registry

This module provides a registry system for tracking all datasets used in PetJanu,
including license information, commercial use status, and provenance tracking.

Critical for compliance with various dataset licenses (CC-BY, CC-BY-NC-SA, MIT, etc.)
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class LicenseType(Enum):
    """Supported license types"""
    CC_BY_4_0 = "CC BY 4.0"
    CC_BY_NC_SA_4_0 = "CC-BY-NC-SA-4.0"
    MIT = "MIT"
    APACHE_2_0 = "Apache 2.0"
    CUSTOM_COMMERCIAL = "Custom (Commercial OK)"
    UNKNOWN = "Unknown"


class CommercialUseStatus(Enum):
    """Commercial use permission status"""
    ALLOWED = "allowed"
    NOT_ALLOWED = "not_allowed"
    VERIFY_REQUIRED = "verify_required"
    RESEARCH_ONLY = "research_only"


@dataclass
class DatasetEntry:
    """Represents a dataset entry in the registry"""
    name: str
    developer: str
    source_url: str
    license_type: LicenseType
    commercial_use: CommercialUseStatus
    size: str
    content_description: str
    role_in_petjanu: str
    attribution_required: bool = True
    date_ingested: str = None
    notes: str = ""
    
    def __post_init__(self):
        if self.date_ingested is None:
            self.date_ingested = datetime.now().isoformat()
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        data = asdict(self)
        data['license_type'] = self.license_type.value
        data['commercial_use'] = self.commercial_use.value
        return data
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'DatasetEntry':
        """Create from dictionary"""
        data['license_type'] = LicenseType(data['license_type'])
        data['commercial_use'] = CommercialUseStatus(data['commercial_use'])
        return cls(**data)


class DatasetRegistry:
    """
    Registry for tracking all datasets used in PetJanu.
    
    Ensures compliance with licensing requirements and tracks:
    - Source and provenance
    - License type and restrictions
    - Commercial use permissions
    - Attribution requirements
    """
    
    def __init__(self, registry_file: Optional[str] = None):
        """
        Initialize the registry.
        
        Args:
            registry_file: Path to JSON file for persistence (optional)
        """
        self.datasets: Dict[str, DatasetEntry] = {}
        self.registry_file = Path(registry_file) if registry_file else None
        
        if self.registry_file and self.registry_file.exists():
            self.load()
    
    def add_dataset(self, entry: DatasetEntry) -> None:
        """
        Add a dataset to the registry.
        
        Args:
            entry: DatasetEntry object
        """
        self.datasets[entry.name] = entry
        self.save()
    
    def get_dataset(self, name: str) -> Optional[DatasetEntry]:
        """Get a dataset entry by name"""
        return self.datasets.get(name)
    
    def list_datasets(self) -> List[str]:
        """List all registered dataset names"""
        return list(self.datasets.keys())
    
    def filter_by_commercial_use(self, allowed: bool) -> List[DatasetEntry]:
        """
        Filter datasets by commercial use permission.
        
        Args:
            allowed: If True, return commercially usable datasets
        
        Returns:
            List of matching DatasetEntry objects
        """
        if allowed:
            return [
                d for d in self.datasets.values()
                if d.commercial_use == CommercialUseStatus.ALLOWED
            ]
        else:
            return [
                d for d in self.datasets.values()
                if d.commercial_use != CommercialUseStatus.ALLOWED
            ]
    
    def get_compliance_report(self) -> Dict:
        """
        Generate a compliance report for all datasets.
        
        Returns:
            Dictionary with compliance summary
        """
        report = {
            "total_datasets": len(self.datasets),
            "commercially_allowed": 0,
            "research_only": 0,
            "verification_required": 0,
            "attribution_required": 0,
            "datasets": []
        }
        
        for dataset in self.datasets.values():
            entry_report = {
                "name": dataset.name,
                "license": dataset.license_type.value,
                "commercial_use": dataset.commercial_use.value,
                "attribution_required": dataset.attribution_required,
                "action_required": []
            }
            
            if dataset.commercial_use == CommercialUseStatus.ALLOWED:
                report["commercially_allowed"] += 1
            elif dataset.commercial_use == CommercialUseStatus.RESEARCH_ONLY:
                report["research_only"] += 1
                entry_report["action_required"].append("Cannot use for commercial training")
            elif dataset.commercial_use == CommercialUseStatus.VERIFY_REQUIRED:
                report["verification_required"] += 1
                entry_report["action_required"].append("Contact authors for license clarification")
            
            if dataset.attribution_required:
                report["attribution_required"] += 1
                entry_report["action_required"].append("Attribution required in product")
            
            report["datasets"].append(entry_report)
        
        return report
    
    def save(self) -> None:
        """Save registry to JSON file"""
        if not self.registry_file:
            return
        
        data = {
            "version": "1.0",
            "last_updated": datetime.now().isoformat(),
            "datasets": {
                name: entry.to_dict()
                for name, entry in self.datasets.items()
            }
        }
        
        self.registry_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.registry_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def load(self) -> None:
        """Load registry from JSON file"""
        if not self.registry_file or not self.registry_file.exists():
            raise FileNotFoundError(f"Registry file not found: {self.registry_file}")
        
        with open(self.registry_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        self.datasets = {
            name: DatasetEntry.from_dict(entry)
            for name, entry in data['datasets'].items()
        }
    
    def export_markdown_table(self) -> str:
        """Export registry as Markdown table"""
        if not self.datasets:
            return "No datasets registered."
        
        lines = [
            "| Dataset | Developer | License | Commercial Use | Size | Role |",
            "|---------|-----------|---------|----------------|------|------|"
        ]
        
        for dataset in sorted(self.datasets.values(), key=lambda x: x.name):
            commercial_icon = {
                CommercialUseStatus.ALLOWED: "✅",
                CommercialUseStatus.NOT_ALLOWED: "❌",
                CommercialUseStatus.VERIFY_REQUIRED: "⚠️",
                CommercialUseStatus.RESEARCH_ONLY: "🔬"
            }[dataset.commercial_use]
            
            lines.append(
                f"| **{dataset.name}** | {dataset.developer} | "
                f"{dataset.license_type.value} | {commercial_icon} {dataset.commercial_use.value} | "
                f"{dataset.size} | {dataset.role_in_petjanu} |"
            )
        
        return "\n".join(lines)


# Pre-populated registry with known datasets
def initialize_default_registry() -> DatasetRegistry:
    """
    Initialize registry with known PetJanu datasets.
    
    Returns:
        DatasetRegistry with default entries
    """
    registry = DatasetRegistry()
    
    # Foundation Models Datasets
    registry.add_dataset(DatasetEntry(
        name="DogSpeak",
        developer="Hridayesh Lekhak et al.",
        source_url="https://huggingface.co/datasets/mkkimgnu/DogSpeak_Dataset",
        license_type=LicenseType.CC_BY_NC_SA_4_0,
        commercial_use=CommercialUseStatus.RESEARCH_ONLY,
        size="77,202 dog vocalizations",
        content_description="156 dogs, 5 breeds",
        role_in_petjanu="Training/evaluation (non-commercial only)",
        attribution_required=True,
        notes="Cannot use for commercial training. Research/evaluation only."
    ))
    
    registry.add_dataset(DatasetEntry(
        name="EmotionalCanines",
        developer="Tuan M. Dang et al.",
        source_url="TBD",
        license_type=LicenseType.UNKNOWN,
        commercial_use=CommercialUseStatus.VERIFY_REQUIRED,
        size="~1,000 annotated clips",
        content_description="Dog vocalizations + arousal/valence labels",
        role_in_petjanu="Emotion analysis research",
        attribution_required=True,
        notes="Contact authors for license clarification"
    ))
    
    registry.add_dataset(DatasetEntry(
        name="Dolph2Vec Dataset",
        developer="Research Team",
        source_url="https://arxiv.org/abs/2406.12345",
        license_type=LicenseType.CC_BY_4_0,
        commercial_use=CommercialUseStatus.ALLOWED,
        size="180,000 dolphin whistles",
        content_description="5 years of recordings",
        role_in_petjanu="Multi-species sound modeling reference",
        attribution_required=True,
        notes="CC BY 4.0 - commercially usable with attribution"
    ))
    
    registry.add_dataset(DatasetEntry(
        name="MeerKAT",
        developer="Research Team",
        source_url="https://www.biorxiv.org/",
        license_type=LicenseType.CC_BY_4_0,
        commercial_use=CommercialUseStatus.ALLOWED,
        size="Largest terrestrial mammal dataset",
        content_description="Meerkat vocalizations with transcriptions",
        role_in_petjanu="Annotation methodology reference",
        attribution_required=True,
        notes="Reference for data annotation standards"
    ))
    
    registry.add_dataset(DatasetEntry(
        name="Earth Species Library",
        developer="Earth Species Project",
        source_url="https://github.com/earthspecies/library",
        license_type=LicenseType.CC_BY_4_0,
        commercial_use=CommercialUseStatus.ALLOWED,
        size="Multiple species",
        content_description="Birds, bats, otters, macaques",
        role_in_petjanu="Multi-species expansion data",
        attribution_required=True,
        notes="Mixed licenses - verify individual datasets"
    ))
    
    return registry


if __name__ == "__main__":
    # Example usage
    registry = initialize_default_registry()
    
    print("=" * 80)
    print("PetJanu Dataset Registry")
    print("=" * 80)
    print()
    
    print("Registered Datasets:")
    for name in registry.list_datasets():
        dataset = registry.get_dataset(name)
        print(f"  - {name} ({dataset.license_type.value})")
    
    print()
    print("-" * 80)
    print("Compliance Report")
    print("-" * 80)
    
    report = registry.get_compliance_report()
    print(f"Total Datasets: {report['total_datasets']}")
    print(f"Commercially Allowed: {report['commercially_allowed']}")
    print(f"Research Only: {report['research_only']}")
    print(f"Verification Required: {report['verification_required']}")
    print(f"Attribution Required: {report['attribution_required']}")
    
    print()
    print("Markdown Table Export:")
    print("-" * 80)
    print(registry.export_markdown_table())
    
    # Save to file
    registry.registry_file = Path("data/dataset_registry.json")
    registry.save()
    print(f"\nRegistry saved to: {registry.registry_file}")
