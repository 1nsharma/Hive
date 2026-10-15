# PetJanu Runbook

**Version:** 1.0.0  
**Last Updated:** Phase 1 - Repository Setup  
**Document Owner:** DevOps Agent  
**Review Cycle:** Quarterly or after major incidents

---

## Table of Contents

1. [System Overview](#system-overview)
2. [On-Call Procedures](#on-call-procedures)
3. [Deployment Procedures](#deployment-procedures)
4. [Monitoring & Alerting](#monitoring--alerting)
5. [Incident Response](#incident-response)
6. [Database Operations](#database-operations)
7. [Backup & Recovery](#backup--recovery)
8. [Scaling Procedures](#scaling-procedures)
9. [Security Incidents](#security-incidents)
10. [Contact Information](#contact-information)

---

## System Overview

### Architecture Summary

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Vercel CDN    │────▶│  Express Server  │────▶│   Supabase DB   │
│   (Frontend)    │     │   (Node.js API)  │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   Firebase Auth  │
                        │   (Firestore)    │
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   Razorpay       │
                        │   (Payments)     │
                        └──────────────────┘
```

### Critical Services

| Service | Provider | Purpose | SLA Target |
|---------|----------|---------|------------|
| Frontend Hosting | Vercel | React app delivery | 99.99% |
| API Server | Cloud Run / Vercel | Business logic | 99.9% |
| Primary Database | Supabase | Structured data | 99.9% |
| Auth/Firestore | Firebase | User sessions | 99.9% |
| Payments | Razorpay | Transactions | 99.95% |
| AI Service | Google AI | Health triage | 99% |

### Environment URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Production | https://petsjanu.com | Live user traffic |
| Staging | https://staging.petsjanu.com | Pre-production testing |
| Development | http://localhost:3000 | Local development |

---

## On-Call Procedures

### Rotation Schedule

- **Primary On-Call:** Rotates weekly among backend engineers
- **Secondary On-Call:** Tech lead or senior engineer
- **Escalation:** CTO/Founder for P0 incidents

### On-Call Responsibilities

1. Monitor alerting dashboards
2. Respond to PagerDuty/Slack alerts within 15 minutes
3. Triage and escalate incidents as needed
4. Document incidents in post-mortem reports
5. Hand off to next on-call engineer

### Contact Escalation Matrix

| Severity | Response Time | Escalation Path |
|----------|---------------|-----------------|
| P0 (Critical) | 15 min | On-Call → Tech Lead → CTO |
| P1 (High) | 1 hour | On-Call → Tech Lead |
| P2 (Medium) | 4 hours | On-Call only |
| P3 (Low) | Next business day | Ticket queue |

---

## Deployment Procedures

### Pre-Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed and approved
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented
- [ ] Stakeholders notified (if major release)
- [ ] Monitoring dashboards accessible

### Production Deployment Steps

#### Automated Deployment (Vercel)

```bash
# 1. Merge PR to main branch
git checkout main
git pull origin main

# 2. Vercel automatically deploys on push to main
# Check deployment status at: https://vercel.com/petjanu/deployments

# 3. Verify deployment health
curl -f https://petsjanu.com/api/health || echo "DEPLOYMENT FAILED"
```

#### Manual Deployment (Cloud Run)

```bash
# 1. Build Docker image
docker build -t gcr.io/petjanu-app/petjanu:latest .

# 2. Push to Container Registry
docker push gcr.io/petjanu-app/petjanu:latest

# 3. Deploy to Cloud Run
gcloud run deploy petjanu \
  --image gcr.io/petjanu-app/petjanu:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 4. Verify deployment
gcloud run services describe petjanu --region us-central1
```

### Post-Deployment Verification

```bash
# Health check
curl https://petsjanu.com/api/health

# Smoke tests
curl https://petsjanu.com/api/pets/demo
curl https://petsjanu.com/api/auth/status

# Check error rates in monitoring dashboard
# Verify no increase in 5xx errors
```

### Rollback Procedure

#### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous stable deployment
3. Click "Promote to Production"

#### Cloud Run Rollback

```bash
# Rollback to previous revision
gcloud run services update-traffic petjanu \
  --to-revisions=petjanu-previous-revision=100 \
  --region us-central1
```

---

## Monitoring & Alerting

### Key Metrics to Monitor

| Metric | Threshold | Alert Channel |
|--------|-----------|---------------|
| API Error Rate | > 1% | Slack + PagerDuty |
| Response Time (p95) | > 500ms | Slack |
| Database Connection Errors | > 0 | PagerDuty |
| Payment Failures | > 5% | Slack + Email |
| Uptime | < 99.9% | PagerDuty |
| Disk Usage | > 80% | Slack |

### Monitoring Dashboards

- **Vercel Analytics:** https://vercel.com/petjanu/analytics
- **Supabase Dashboard:** https://app.supabase.com/project/_/database
- **Firebase Console:** https://console.firebase.google.com/project/petjanu-app
- **Razorpay Dashboard:** https://dashboard.razorpay.com/app

### Alert Configuration

```yaml
# Example Prometheus alert rules
groups:
  - name: petjanu-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        annotations:
          summary: "High error rate detected"
          
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 10m
        annotations:
          summary: "Slow API response times"
```

---

## Incident Response

### Incident Classification

| Severity | Description | Examples |
|----------|-------------|----------|
| P0 | Complete service outage | Site down, payments failing |
| P1 | Major feature broken | SOS mode not working, auth failures |
| P2 | Minor feature degraded | AI responses slow, images not loading |
| P3 | Cosmetic issues | Typos, minor UI glitches |

### Incident Response Workflow

1. **Detect:** Monitoring alerts or user reports
2. **Triage:** On-call engineer assesses severity
3. **Communicate:** Update status page and Slack channel
4. **Diagnose:** Identify root cause
5. **Mitigate:** Apply temporary fix if available
6. **Resolve:** Implement permanent fix
7. **Document:** Write post-mortem report
8. **Review:** Conduct blameless post-mortem meeting

### Incident Communication Template

```markdown
## INCIDENT UPDATE - [SEVERITY] - [Brief Description]

**Status:** [Investigating / Identified / Mitigated / Resolved]
**Impact:** [What users are experiencing]
**Start Time:** [YYYY-MM-DD HH:MM UTC]
**Last Updated:** [YYYY-MM-DD HH:MM UTC]

**Current Investigation:**
[Brief description of what's being investigated]

**Next Update:** [Expected time of next update]

**Contact:** [On-call engineer name/slack handle]
```

### Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date:** [Date of incident]
**Severity:** [P0-P3]
**Duration:** [Start time - End time]
**Author:** [Post-mortem author]

## Summary
[Brief description of what happened]

## Impact
- Users affected: [Number/percentage]
- Revenue impact: [Estimated amount]
- Duration: [X hours/minutes]

## Root Cause
[Detailed technical explanation]

## Timeline
- [HH:MM] Incident started
- [HH:MM] Alert triggered
- [HH:MM] On-call engaged
- [HH:MM] Root cause identified
- [HH:MM] Fix deployed
- [HH:MM] Incident resolved

## Contributing Factors
[List of factors that contributed to the incident]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Fix] | [Name] | [Date] | [ ] |

## Lessons Learned
- What went well
- What could be improved
- How to prevent recurrence
```

---

## Database Operations

### Supabase Operations

#### Running Migrations

```bash
# Connect to Supabase CLI
npx supabase login

# Link to project
npx supabase link --project-ref your-project-ref

# Apply pending migrations
npx supabase db push

# Create new migration
npx supabase migration new migration_name
```

#### Database Backup

```bash
# Export full database backup
pg_dump "postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres" \
  --file=backup_$(date +%Y%m%d_%H%M%S).sql \
  --format=custom
```

#### Emergency Database Access

```bash
# Connect via psql
psql "postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres"

# Common diagnostic queries
SELECT COUNT(*) FROM profiles;
SELECT * FROM bookings WHERE created_at > NOW() - INTERVAL '1 hour';
```

### Firestore Operations

#### Backup Collections

```bash
# Export Firestore data
firebase firestore:export gs://petjanu-backups/firestore-export-$(date +%Y%m%d)
```

#### Import Data

```bash
# Import from backup
firebase firestore:import gs://petjanu-backups/firestore-export-YYYYMMDD
```

---

## Backup & Recovery

### Backup Schedule

| Data Type | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| Supabase DB | Daily | 30 days | Supabase + S3 |
| Firestore | Daily | 30 days | GCS Bucket |
| Media Files | Continuous | 90 days | Firebase Storage |
| Logs | Real-time | 90 days | Cloud Logging |

### Recovery Procedures

#### Full Database Recovery

```bash
# 1. Stop application writes
# 2. Restore from latest backup
psql "connection-string" < backup_YYYYMMDD.sql

# 3. Verify data integrity
# 4. Restart application
# 5. Monitor for issues
```

#### Point-in-Time Recovery (Supabase)

1. Go to Supabase Dashboard → Database → Backups
2. Select desired restore point
3. Click "Restore to Point in Time"
4. Confirm restoration

### Disaster Recovery Plan

1. **Assess Damage:** Determine scope of data loss/corruption
2. **Activate DR Team:** Notify all stakeholders
3. **Restore from Backup:** Use most recent clean backup
4. **Verify Integrity:** Run data validation scripts
5. **Resume Operations:** Gradually restore traffic
6. **Post-Incident Review:** Document lessons learned

---

## Scaling Procedures

### Auto-Scaling Configuration

#### Vercel (Frontend)

- Automatic scaling based on traffic
- No manual intervention required
- Monitor via Vercel Analytics

#### Cloud Run (API)

```yaml
# Cloud Run scaling configuration
spec:
  template:
    spec:
      containers:
        - image: gcr.io/petjanu-app/petjanu:latest
      maxInstances: 100
      minInstances: 1
      concurrency: 80
```

### Database Scaling

#### Supabase

- Vertical scaling: Upgrade compute tier in dashboard
- Horizontal scaling: Read replicas (Enterprise plan)
- Connection pooling: Enable PgBouncer

#### Firestore

- Automatic scaling (serverless)
- Monitor read/write operations in Firebase Console
- Consider sharding for hot collections

### Load Testing

```bash
# Install k6 for load testing
npm install -g k6

# Run load test
k6 run load-test.js

# Example load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '5m',
};

export default function () {
  let res = http.get('https://petsjanu.com/api/health');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
```

---

## Security Incidents

### Security Incident Types

| Type | Severity | Response |
|------|----------|----------|
| Data Breach | P0 | Immediate containment, legal notification |
| Credential Leak | P0 | Rotate keys, audit access logs |
| DDoS Attack | P1 | Enable DDoS protection, rate limiting |
| Vulnerability Report | P2 | Assess, patch, disclose responsibly |

### Security Incident Response

1. **Contain:** Isolate affected systems
2. **Assess:** Determine scope and impact
3. **Eradicate:** Remove threat actor/vulnerability
4. **Recover:** Restore normal operations
5. **Notify:** Inform affected users/regulators if required
6. **Document:** Create detailed incident report

### Key Rotation Procedures

#### Firebase API Keys

1. Go to Firebase Console → Project Settings → General
2. Generate new API key
3. Update `.env.local` and deployment secrets
4. Revoke old key
5. Monitor for authentication failures

#### Supabase Keys

1. Go to Supabase Dashboard → Settings → API
2. Generate new anon/service key
3. Update environment variables
4. Revoke old key
5. Test all integrations

#### Razorpay Keys

1. Go to Razorpay Dashboard → Settings → API Keys
2. Generate new key pair
3. Update server environment variables
4. Test payment flow
5. Revoke old keys

---

## Contact Information

### Internal Contacts

| Role | Name | Slack | Phone | Email |
|------|------|-------|-------|-------|
| On-Call Engineer | [Rotation] | @oncall | [PagerDuty] | oncall@petsjanu.com |
| Tech Lead | [Name] | @techlead | [Phone] | tech@petsjanu.com |
| CTO | [Name] | @cto | [Phone] | cto@petsjanu.com |
| CEO | [Name] | @ceo | [Phone] | ceo@petsjanu.com |

### External Contacts

| Service | Support Email | Support Portal | SLA |
|---------|---------------|----------------|-----|
| Vercel | support@vercel.com | vercel.com/support | Business hours |
| Supabase | support@supabase.com | supabase.com/contact | 24/7 (Pro+) |
| Firebase | firebase-support@google.com | console.firebase.google.com | Community |
| Razorpay | support@razorpay.com | razorpay.com/support | 24/7 |
| Google AI | ai-platform-support@google.com | cloud.google.com/support | Business hours |

### Emergency Contacts

- **Security Emergencies:** security@petsjanu.com
- **Legal/Compliance:** legal@petsjanu.com
- **Press Inquiries:** press@petsjanu.com

---

## Appendix

### Useful Commands

```bash
# Check system status
curl https://petsjanu.com/api/health

# View recent logs (Vercel)
vercel logs petsjanu.com --since=1h

# View recent logs (Cloud Run)
gcloud run services logs petjanu --region us-central1 --limit=50

# Database connection test
psql "connection-string" -c "SELECT 1;"

# Trigger manual backup
firebase firestore:export gs://petjanu-backups/manual-backup-$(date +%Y%m%d_%H%M%S)
```

### Runbook Maintenance

This runbook should be reviewed and updated:
- Quarterly (minimum)
- After any P0/P1 incident
- When significant infrastructure changes occur
- When new team members join

**Last Review Date:** [Date]  
**Next Review Date:** [Date]  
**Runbook Owner:** DevOps Agent
