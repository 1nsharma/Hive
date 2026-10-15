import os

docs = {
    "01. Strategy": [
        "Business-Plan.md",
        "Target-Audience.md",
        "Competitor-Analysis.md",
        "Go-to-Market-Strategy.md"
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

for section, files in docs.items():
    for f in files:
        title = f.replace('.md', '').replace('-', ' ')
        
        path = os.path.join(section, f)
        with open(path, 'w') as fh:
            fh.write(generate_content(section, title))
