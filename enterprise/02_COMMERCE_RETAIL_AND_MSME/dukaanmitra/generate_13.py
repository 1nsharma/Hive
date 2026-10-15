import os

docs = {
    "13. Finance": [
        "Accounting.md",
        "Budget.md",
        "Expenses.md",
        "Invoices.md",
        "Payroll.md",
        "Revenue.md",
        "Taxes.md"
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
    ordered_files = [
        "Budget.md",
        "Expenses.md",
        "Revenue.md",
        "Taxes.md",
        "Accounting.md",
        "Payroll.md",
        "Invoices.md"
    ]
    for f in ordered_files:
        title = f.replace('.md', '').replace('-', ' ')
        content += f"- [{title}](./{f})\n"
    return content

os.makedirs("13. Finance", exist_ok=True)

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

