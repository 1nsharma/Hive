import os

docs = {
    "06. Data": [
        "Database-Design.md",
        "ER-Diagram.md",
        "Data-Dictionary.md",
        "Event-Schema.md",
        "Analytics.md",
        "Reports.md",
        "Data-Warehouse.md",
        "Data-Governance.md",
        "Backup-Policy.md"
    ]
}

def generate_content(section, title):
    return f"""# {title}

**Section:** {section}
**Status:** 🔲 Not started
**Owner:** _unassigned_
**Last updated:** 2026-07-07

---

## Purpose

_What this document is for and who should read it._

## Content

_Fill in._

## Open questions

- 

## Related documents

- 
"""

def generate_index(section, files):
    content = f"""# {section}

Status: 🔲 Not started
Owner: _unassigned_
Last updated: 2026-07-07

## Contents

"""
    for f in files:
        title = f.replace('.md', '').replace('-', ' ')
        content += f"- [{title}](./{f})\n"
    return content

os.makedirs("06. Data", exist_ok=True)

for section, files in docs.items():
    for f in files:
        title = f.replace('.md', '').replace('-', ' ')
        
        path = os.path.join(section, f)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(generate_content(section, title))
            
    # Write index
    index_name = "README.md"
    path = os.path.join(section, index_name)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(generate_index(section, files))

