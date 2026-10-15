---
name: 🐛 Bug Report
description: File a bug report to help us improve PetJanu
title: "[Bug]: "
labels: ["bug", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.
        
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear and concise description of what the bug is.
      placeholder: When I click on X, Y happens instead of Z...
    validations:
      required: true
      
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Detailed steps to reproduce the behavior.
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: A clear and concise description of what you expected to happen.
      placeholder: I expected to see...
    validations:
      required: true
      
  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: A clear and concise description of what actually happened.
      placeholder: Instead, I saw...
    validations:
      required: true
      
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: How severe is this bug?
      options:
        - Critical (App completely broken)
        - High (Major feature broken)
        - Medium (Minor feature broken)
        - Low (Cosmetic issue)
    validations:
      required: true
      
  - type: dropdown
    id: environment
    attributes:
      label: Environment
      description: Where did you encounter this bug?
      options:
        - Production (petsjanu.com)
        - Staging
        - Local Development
        - All Environments
    validations:
      required: true
      
  - type: input
    id: browser
    attributes:
      label: Browser/Device
      description: Which browser and device are you using?
      placeholder: Chrome 120 on MacBook Pro / Safari on iPhone 15
      
  - type: input
    id: user-agent
    attributes:
      label: User Agent (if known)
      description: You can find this by searching "what is my user agent" in Google
      
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots/Recordings
      description: If applicable, add screenshots or screen recordings to help explain your problem.
      
  - type: textarea
    id: logs
    attributes:
      label: Console Logs
      description: If applicable, please share any relevant console logs or error messages.
      render: shell
      
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our [Code of Conduct](../CODE_OF_CONDUCT.md).
      options:
        - label: I agree to follow the Code of Conduct
          required: true
