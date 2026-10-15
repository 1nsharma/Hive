import os

docs = {
    "04. Engineering": [
        "API-Documentation.md",
        "Authentication.md",
        "Authorization.md",
        "Backend-Architecture.md",
        "Backup-and-Recovery.md",
        "Coding-Standards.md",
        "Database-Schema.md",
        "Deployment-Guide.md",
        "DevOps.md",
        "Environment-Variables.md",
        "Frontend-Architecture.md",
        "Git-Workflow.md",
        "Logging.md",
        "Monitoring.md",
        "Security-Policy.md",
        "System-Architecture.md"
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
    # Use exact list from user prompt
    ordered_files = [
        "System-Architecture.md",
        "Frontend-Architecture.md",
        "Backend-Architecture.md",
        "Database-Schema.md",
        "API-Documentation.md",
        "Authentication.md",
        "Authorization.md",
        "Security-Policy.md",
        "Coding-Standards.md",
        "Git-Workflow.md",
        "DevOps.md",
        "Deployment-Guide.md",
        "Environment-Variables.md",
        "Monitoring.md",
        "Logging.md",
        "Backup-and-Recovery.md"
    ]
    for f in ordered_files:
        title = f.replace('.md', '').replace('-', ' ')
        if title == "Backup and Recovery":
            title = "Backup & Recovery"
        content += f"- [{title}](./{f})\n"
    return content

os.makedirs("04. Engineering", exist_ok=True)

for section, files in docs.items():
    for f in files:
        title = f.replace('.md', '').replace('-', ' ')
        if title == "Backup and Recovery":
            title = "Backup & Recovery"
        
        path = os.path.join(section, f)
        with open(path, 'w') as fh:
            fh.write(generate_content(section, title))
            
    # Write index
    index_name = "README.md"
    path = os.path.join(section, index_name)
    with open(path, 'w') as fh:
        fh.write(generate_index(section, files))

