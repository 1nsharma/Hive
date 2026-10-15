---
name: 📋 Task
description: Create a development task for the team
title: "[Task]: "
labels: ["task", "triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for creating this task! Please provide clear details to help the team understand what needs to be done.
        
  - type: textarea
    id: description
    attributes:
      label: Task Description
      description: A clear and concise description of what needs to be done.
      placeholder: Implement X feature / Fix Y bug / Refactor Z module...
    validations:
      required: true
      
  - type: textarea
    id: acceptance-criteria
    attributes:
      label: Acceptance Criteria
      description: What conditions must be met for this task to be considered complete?
      placeholder: |
        - [ ] Feature X works as expected
        - [ ] Tests pass with >80% coverage
        - [ ] Documentation updated
        - [ ] Code review approved
    validations:
      required: true
      
  - type: dropdown
    id: sprint
    attributes:
      label: Sprint
      description: Which sprint does this task belong to?
      options:
        - Sprint 0: Foundation
        - Sprint 1: Runnable Core App
        - Sprint 2: Core Features
        - Sprint 3: Testing and Security
        - Sprint 4: Deployment
        - Sprint 5: Launch
        - Backlog
    validations:
      required: true
      
  - type: dropdown
    id: complexity
    attributes:
      label: Complexity/Story Points
      description: Estimate the complexity of this task (Fibonacci scale).
      options:
        - 1 (Trivial)
        - 2 (Simple)
        - 3 (Moderate)
        - 5 (Complex)
        - 8 (Very Complex)
        - 13 (Extremely Complex - Consider breaking down)
    validations:
      required: true
      
  - type: dropdown
    id: agent
    attributes:
      label: Primary Agent/Role
      description: Which team role should own this task?
      options:
        - Backend Agent
        - Frontend Agent
        - Data Agent
        - DevOps Agent
        - QA Agent
        - Security Agent
        - Docs Agent
        - PM Agent
        - Architect Agent
        - Multiple Roles
    validations:
      required: true
      
  - type: input
    id: dependencies
    attributes:
      label: Dependencies
      description: List any tasks/issues that must be completed before this one can start.
      placeholder: "#123, #456"
      
  - type: textarea
    id: technical-notes
    attributes:
      label: Technical Notes
      description: Any technical implementation details, file paths, or code references.
      render: shell
      
  - type: textarea
    id: resources
    attributes:
      label: Resources & References
      description: Links to documentation, designs, or other relevant resources.
      placeholder: |
        - Design mockup: [link]
        - API docs: [link]
        - Related issue: [link]
      
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this task, you agree to follow our [Code of Conduct](../CODE_OF_CONDUCT.md).
      options:
        - label: I agree to follow the Code of Conduct
          required: true
