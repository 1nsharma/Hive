# Identity & Access Management (IAM) Blueprint (v1.0)

This blueprint documents the Identity and Access Management policies, service account credentials, resource permissions, and credential rotation boundaries of DukaanMitra (BazaarSync) on Google Cloud.

---

## 1. Cloud Infrastructure IAM Policy

DukaanMitra enforces the **Principle of Least Privilege** across all Google Cloud Platform integrations. Under no circumstances do application resources execute with administrative or global owner roles.

```
+------------------------------------+
| Google Cloud Run Execution Service |
+------------------+-----------------+
                   |
                   v [Binds Runtime Identity]
+------------------+-----------------+
|   `dukaanmitra-cloud-run@`         |  <--- Custom Service Account
|   `[PROJECT_ID].iam.gserviceaccount`|
+------------------+-----------------+
                   |
        +----------+----------+
        |                     |
        v                     v
+-------+--------+   +--------+--------+
|  Cloud SQL     |   | Secret Manager  |
|  Client Role   |   | Accessor Role   |
| (Cloud SQL DB) |   | (Secrets/Keys)  |
+----------------+   +-----------------+
```

---

## 2. Service Account Resource Access Grid

To isolate the production application container, we bind a dedicated, user-managed Service Account named `dukaanmitra-cloud-run` with specific IAM roles:

| Targeted Resource | Required IAM Role | Policy Scope / Purpose |
| :--- | :--- | :--- |
| **`Cloud SQL`** | `roles/cloudsql.client` | Allows the container to establish secure VPC proxy connections to PostgreSQL. |
| **`Secret Manager`**| `roles/secretmanager.secretAccessor` | Grants permissions to read connection tokens and private keys at runtime. |
| **`Cloud Logging`** | `roles/logging.logWriter` | Authorizes the Node process to route stdout/stderr logging streams. |
| **`Cloud Storage`** | `roles/storage.objectAdmin` | Restricted to target user image and PDF backup buckets. |

---

## 3. Firebase Auth and Admin SDK Alignment

End-user identity verification is handled using Firebase Authentication and validated server-side:

### 3.1 Verification Loop
1. **Token Ingress**: The client browser sends an ID token inside the `Authorization: Bearer [TOKEN]` header.
2. **SDK Handshake**: The middleware calls `verifyIdToken(token)` using the server's `firebase-admin` instance.
3. **Identity Sync**: The unique token UID is checked against the database. If it is a new user, a corresponding record is safely written to the PostgreSQL `users` table.

### 3.2 Secure Multi-Admin Verification
To authorize platform administrators without exposing manual credential keys, the middleware checks authenticated emails against an `ADMIN_EMAILS` environment variable.
```ts
const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com'];
const adminEmails = [...envEmails, ...defaultAdmins];
req.isAdmin = adminEmails.includes(email.toLowerCase());
```

---

## 4. Credential & Key Rotation Policy

- **No Repository Key Policy**: No private JSON files, SSH keys, or API tokens are checked into the source control system. All variables are loaded via Cloud Run environments.
- **Rotation Frequency**: API Keys stored inside Google Secret Manager are rotated every **90 days**.
- **Service Account Keys**: The Cloud Run service uses IAM-based token authorization, eliminating the need to download or store long-lived service account key files.
