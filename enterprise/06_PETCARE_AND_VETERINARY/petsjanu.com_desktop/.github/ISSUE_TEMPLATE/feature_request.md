---
name: ✨ Feature Request
description: Suggest an idea for PetJanu
title: "[Feature]: "
labels: ["enhancement", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to suggest a new feature! Please provide as much detail as possible.
        
  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: Is your feature request related to a problem? Please describe.
      placeholder: I'm always frustrated when...
    validations:
      required: true
      
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: A clear and concise description of what you want to happen.
      placeholder: I would like to see...
    validations:
      required: true
      
  - type: textarea
    id: alternatives
    attributes:
      label: Alternative Solutions
      description: A clear and concise description of any alternative solutions or features you've considered.
      placeholder: I've also thought about...
      
  - type: textarea
    id: use-cases
    attributes:
      label: Use Cases
      description: Who will benefit from this feature? What user scenarios does it address?
      placeholder: This feature will help pet owners who...
    validations:
      required: true
      
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How important is this feature to you?
      options:
        - Critical (Must have)
        - High (Should have)
        - Medium (Nice to have)
        - Low (Future consideration)
    validations:
      required: true
      
  - type: dropdown
    id: user-type
    attributes:
      label: User Type
      description: Which user persona does this primarily serve?
      options:
        - Pet Owner
        - Good Samaritan / Finder
        - Veterinary Professional
        - Pet Product Vendor
        - Administrator
        - All Users
    validations:
      required: true
      
  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Add any other context, mockups, or examples about the feature request here.
      
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](../CODE_OF_CONDUCT.md).
      options:
        - label: I agree to follow the Code of Conduct
          required: true
