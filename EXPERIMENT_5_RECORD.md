# EXPERIMENT 5
## Security, Version Control, CI/CD and Cloud Deployment

**Course**: Web Technology Laboratory  
**Module**: Module 5 – Security, DevOps and Deployment (CO5)  
**Student Name**: Vaishnav M N  
**Application**: TechFest 2026 Portal (MERN Stack)  

---

## 1. Aim
To secure the MERN application against common OWASP vulnerabilities, manage it with Git/GitHub, configure a CI pipeline, deploy it to the cloud, and analyse and improve its performance.

---

## 2. Theory / Background
- **HTTPS & SSL/TLS**: Encrypts client-server traffic, protecting sensitive user data against eavesdropping and man-in-the-middle attacks.
- **Content-Security-Policy (CSP)**: A declarative HTTP header that restricts resources (scripts, styles, images) that the browser is permitted to load, drastically mitigating Cross-Site Scripting (XSS).
- **NoSQL Injection**: Occurs when untrusted user input containing query selector operators (e.g., `$gt`, `$ne`) is passed directly to database queries. Prevented by input validation and sanitizing input via `express-mongo-sanitize`.
- **Cross-Site Scripting (XSS)**: Attackers inject malicious scripts into web pages. Mitigated by context-aware escaping, safe React JSX text node rendering, and strict CSP headers.
- **Cross-Site Request Forgery (CSRF)**: Tricks a logged-in user's browser into executing unauthorized requests against a trusted site. Mitigated with `SameSite=Strict` cookies and `HttpOnly` flags.
- **Git & Version Control**: Distributed version control isolating features on branches, facilitating collaborative merging, and conflict resolution.
- **CI/CD Pipeline**: GitHub Actions automates integration by checking out code, installing dependencies, executing test suites with Jest/Supertest, and building production artifacts.
- **Performance Optimization**: Dynamic code-splitting with `React.lazy()` and `Suspense`, asynchronous lazy loading of offscreen images, asset minification, and gzip compression.

---

## 3. Software / Tools Required
- **Git**: Git for Windows (`v2.56.0`)
- **Repository Hosting & CI/CD**: GitHub & GitHub Actions (`.github/workflows/ci.yml`)
- **Security & Testing Libraries**: `helmet`, `express-mongo-sanitize`, `cookie-parser`, `jest`, `supertest`
- **Cloud Hosting Platforms**:
  1. **Database**: MongoDB Atlas Cloud Multi-Region Cluster
  2. **Backend API**: Render Web Service (Node.js/Express)
  3. **Frontend**: Vercel (React 19 + Vite SPA)
- **Browser & Auditing**: Google Chrome DevTools & Lighthouse

---

## 4. Questions & Subdivision Answers

### Q1. Potential security vulnerabilities and preventive measures
- **NoSQL Query Injection**: Neutralized using `express-mongo-sanitize` to strip all `$` prefixes from request payloads, and adding strict datatype verification (`typeof email !== "string"`) returning `400 Bad Request`.
- **Stored/Reflected XSS**: Prevented by replacing unescaped HTML injection (`dangerouslySetInnerHTML`) with safe React text-node rendering, combined with Helmet's default restrictive CSP.
- **Clickjacking & MIME Sniffing**: Mitigated using Helmet headers (`X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`).

### Q2. Securing user authentication and sensitive communication
- All traffic between client and server is encrypted end-to-end using **HTTPS/TLS**.
- Passwords are encrypted before database storage using **bcryptjs** with 10 salt rounds.
- JWT authentication tokens are transmitted inside an **`HttpOnly`**, **`Secure`**, **`SameSite=Strict`** cookie, making it immune to theft from malicious JavaScript scripts (`document.cookie`) and immune to CSRF cross-origin exploits.

### Q3. Git branching and merging strategies
- Project initialized on `main` branch.
- Feature developed on dedicated branch `feature-page` and merged cleanly via fast-forward.
- Deliberate merge conflict induced between `main` and `conflict-test` on `Contact.jsx`, conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) resolved, and committed.

### Q4. Automated deployment pipeline
- Configured `.github/workflows/ci.yml` running on GitHub Actions.
- Pipeline tests code with Jest & Supertest, builds the React frontend, and reports status. Demonstrated both failing (Red) and passing (Green) states.

### Q5. Cloud platform deployments
- Database hosted on **MongoDB Atlas**.
- Backend REST API deployed on **Render**.
- Frontend React SPA deployed on **Vercel**.

### Q6. Performance optimization
- Route-level code splitting using `React.lazy()` and `<Suspense>` for the `Gallery` and `Feedback` routes.
- Lazy image loading (`loading="lazy"`) and explicit dimensions (`width="300"`, `height="200"`) applied to prevent Cumulative Layout Shift (CLS).

### Q7. Browser developer tools and auditing
- Verified network requests with HTTPS lock, security headers in response inspection, and measured bundle size reduction through Vite code splitting.

### Q8. Cross-browser and responsive verification
- Verified responsive layout across desktop and mobile viewports with theme switching (Light/Dark mode) preserved.

---

## 5. System Architecture

```mermaid
graph LR
    subgraph Client ["Client Tier (Vercel)"]
        UI["React 19 Vite SPA<br/>https://techfest-2026-lyart.vercel.app"]
        Lazy["Lazy-Loaded Modules<br/>Gallery & Feedback Chunks"]
    end

    subgraph Backend ["Backend Tier (Render)"]
        API["Express 5 REST API<br/>https://techfest2026-api-9ius.onrender.com"]
        H["Helmet Security Headers"]
        S["express-mongo-sanitize"]
    end

    subgraph Database ["Database Tier (MongoDB Atlas)"]
        Atlas[("Cloud MongoDB Cluster<br/>Users & Registrations")]
    end

    UI --> |HTTPS / JSON Requests| API
    API --> |Mongoose TLS| Atlas
    H --> API
    S --> API
```

---

## 6. Live Deployment URLs

| Component | Cloud Platform | Live Production URL |
| :--- | :--- | :--- |
| **Frontend Web App** | Vercel | [https://techfest-2026-lyart.vercel.app](https://techfest-2026-lyart.vercel.app) |
| **Backend REST API** | Render | [https://techfest2026-api-9ius.onrender.com](https://techfest2026-api-9ius.onrender.com) |
| **Database Cluster** | MongoDB Atlas | `mongodb+srv://vaishnavmnb23cs1162_db_user:...@techfest.7avhikc.mongodb.net` |
| **Source Code & CI** | GitHub | [https://github.com/vaishh-05/techfest-2026](https://github.com/vaishh-05/techfest-2026) |

---

## 7. Security Hardening Evidence

### 7.1 NoSQL Injection Mitigation (Step 3)
```bash
# Attacker Payload attempting login bypass:
curl -X POST https://techfest2026-api-9ius.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":{"$gt":""},"password":"any"}'

# Server Response:
HTTP/1.1 400 Bad Request
{"message":"Invalid email or password format (injection attempt blocked)"}
```

### 7.2 Safe Cookies & CSRF Protection (Step 5)
```http
HTTP/1.1 200 OK
Set-Cookie: token=eyJhbGciOi...; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=Strict
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 8. Version Control Evidence

### 8.1 Branching & Merge Conflict Graph (Step 8 & 9)
```text
*   55b2c3d (HEAD -> main) Resolve merge conflict between main and conflict-test
|\  
| * 1e0e435 (conflict-test) Update phone on conflict-test
* | 426089f Update phone on main
|/  
* 7dd820a (feature-page) Add student coordinator details to contact page
* 4826440 first version
```

### 8.2 Merge Conflict Resolution in `Contact.jsx`
- **Conflict Markers Detected**:
```
<<<<<<< HEAD
            <p>Phone: +91 98765 99999 (Main Branch Helpline)</p>
=======
            <p>Phone: +91 98000 11111 (Branch Conflict Version)</p>
>>>>>>> conflict-test
```
- **Resolution**:
```javascript
<p>Phone: +91 98765 99999 (Main Helpline) / +91 98000 11111 (Alternative)</p>
```

---

## 9. CI/CD Automated Testing Pipeline (Step 11)

### 9.1 GitHub Actions Workflow
- **Workflow File**: `.github/workflows/ci.yml`
- **Demonstration**:
  1. **Red CI Run ❌**: Commit `1616cb0` (*"Deliberate broken test to demonstrate failing red CI pipeline"*).
  2. **Green CI Run ✅**: Commit `50ba407` (*"Fix failing test: restore 200 OK expectation"*).

### 9.2 Automated Test Results (Jest & Supertest)
```text
PASS tests/api.test.js
  TechFest 2026 Security & API Tests
    √ Health Check endpoint returns 200 OK (68 ms)
    √ Security Headers: Helmet sets X-Content-Type-Options and X-Frame-Options (22 ms)
    √ NoSQL Injection Protection: Blocks object query injection in auth (43 ms)
    √ Validation: Missing fields return 400 Bad Request (18 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        1.643 s
```

---

## 10. Performance Optimization (Step 16 & 17)

### 10.1 Vite Code-Splitting Bundle Comparison
- **Before Optimization**: Single bundle containing all application components (`235.25 kB`).
- **After Optimization**: Modular chunks generated:
  - `dist/assets/Gallery-Bv_V6lLR.js`: `1.32 kB` (loaded on demand)
  - `dist/assets/Feedback-uIMusqJR.js`: `2.22 kB` (loaded on demand)
  - `dist/assets/index-BQk_f_cD.js`: Main shell bundle

### 10.2 Four Key Performance/SEO Audit Fixes Applied
1. **Dynamic Route Lazy Loading**: Implemented `React.lazy` and `Suspense` for Gallery and Feedback.
2. **Image Sizing & Lazy Loading**: Added `loading="lazy"`, `width="300"`, and `height="200"` attributes.
3. **Accessibility Attributes**: Added descriptive `alt` tags to all gallery images.
4. **SEO & Routing**: Added meta descriptions, theme color, and SPA fallback rules (`_redirects` and `vercel.json`).

---

## 11. Live Deployment Verification Screenshots

### Live Home Page (HTTPS Verified)
![Live Home Page](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/01-live-home-page.png)

### Live Events Page
![Live Events Page](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/02-live-events-page.png)

### Lazy-Loaded Gallery Page
![Lazy Loaded Gallery](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/03-live-gallery-lazyloaded.png)

### XSS Prevention (Feedback Page - Safe Escaping)
![XSS Payload Secured](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/05-live-feedback-xss-secured.png)

### Live Registration Form & MongoDB Atlas Success
![Live Registration Form](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/06-live-registration-form.png)
![Registration Success](file:///C:/Users/Vaishnav%20M%20N/.gemini/antigravity/brain/c9c5ac24-af22-4972-8157-9f896e347197/07-live-registration-success.png)

---

## 12. Result
Thus, the *Security, Version Control, CI/CD and Cloud Deployment* was developed and its output verified successfully.
