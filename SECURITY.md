# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability,
please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email us at **security@1nsharma-labs.dev** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment** within 48 hours
- **Assessment** within 1 week
- **Fix timeline** communicated within 2 weeks
- **Credit** given in release notes (unless you prefer anonymity)

### Scope

The following are in scope:
- Authentication/authorization bypasses
- Data exposure or leakage
- Remote code execution
- Cross-site scripting (XSS)
- SQL/NoSQL injection
- Server-side request forgery (SSRF)
- Dependency vulnerabilities (critical/high)

### Out of Scope

- Social engineering attacks
- Denial of service (DoS)
- Issues in third-party services
- Already reported vulnerabilities

## Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Keep dependencies updated
- Follow the principle of least privilege
- Validate and sanitize all user inputs
