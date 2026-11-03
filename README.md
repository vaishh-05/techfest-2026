# TechFest 2026 - Security, Version Control, CI/CD and Cloud Deployment

**Course**: Web Technology Lab (Module 5 - CO5)  
**Student**: Vaishnav M N (MBCET)

---

## 🏛️ System Architecture

```
[ React Client (Vite) ]  ── HTTPS / JSON ──>  [ Express & Node.js API ]  ── Mongoose ──>  [ MongoDB Atlas ]
      (Hosted on Vercel)                             (Hosted on Render)                     (Cloud Cluster)
```

---

## 🛡️ Security Hardening (OWASP Top 10 Mitigations)

1. **NoSQL Injection Defense**:
   - Integrated `express-mongo-sanitize` to strip prohibited `$` query selectors from request parameters and payloads.
   - Strict datatype validation preventing query selector object injection in authentication routes.
2. **Cross-Site Scripting (XSS) Mitigation**:
   - `helmet()` automatically provisions standard security headers including `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and restrictive Content-Security-Policy (CSP).
   - React virtual DOM automatically encodes dynamic strings, preventing arbitrary DOM execution.
3. **Secure Cookies & CSRF Protection**:
   - JWT tokens are issued with `httpOnly: true` (inaccessible to malicious scripts), `secure: true` (only sent over HTTPS), and `sameSite: "strict"` (mitigating Cross-Site Request Forgery).

---

## 🚀 CI/CD Pipeline (`.github/workflows/ci.yml`)

The GitHub Actions workflow triggers automatically on each push to `main`:
1. Checks out repository.
2. Installs server and client dependencies.
3. Executes Jest and Supertest security/API test suite.
4. Builds and minifies the React client with lazy loading code splitting.

---

## 🌐 Live Cloud Deployments

- **Frontend (React)**: [Deployed on Vercel / Netlify]
- **Backend API (Express)**: [Deployed on Render]
- **Database**: MongoDB Atlas Cloud Cluster
