import os

docs = {
    "02. Brand": [
        "Brand-Guidelines.md",
        "Color-Palette.md",
        "Design-Language.md",
        "Icon-System.md",
        "Logo.md",
        "Marketing-Assets.md",
        "Press-Kit.md",
        "Social-Media-Kit.md",
        "Typography.md"
    ],
    "03. Product": [
        "Changelog.md",
        "Design-System.md",
        "Feature-List.md",
        "Product-Requirements-Document-PRD.md",
        "Release-Notes.md",
        "Roadmap.md",
        "User-Journey.md",
        "User-Personas.md",
        "UX-Guidelines.md",
        "Wireframes.md"
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

for section, files in docs.items():
    for f in files:
        title = f.replace('.md', '').replace('-', ' ')
        if title == "Product Requirements Document PRD":
            title = "Product Requirements Document (PRD)"
        
        path = os.path.join(section, f)
        with open(path, 'w') as fh:
            fh.write(generate_content(section, title))
            
    # Write index
    index_name = "README.md"
    path = os.path.join(section, index_name)
    with open(path, 'w') as fh:
        fh.write(generate_index(section, files))

