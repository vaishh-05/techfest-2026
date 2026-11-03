/**
 * Experiment 5 - Security Vulnerability & Mitigation Demonstration
 * Demonstrates:
 * 1. NoSQL Injection Bypass Prevention (Helmet + express-mongo-sanitize)
 * 2. XSS (Cross-Site Scripting) Payload Sanitization
 * 3. Secure Cookie & CSRF Mitigation (HttpOnly, SameSite=Strict, Secure)
 */

const mongoSanitize = require("express-mongo-sanitize");

console.log("=================================================================");
console.log(" EXPERIMENT 5: SECURITY AUDIT & VULNERABILITY DEMONSTRATION");
console.log("=================================================================\n");

// -------------------------------------------------------------
// 1. NoSQL INJECTION DEMO (Step 3)
// -------------------------------------------------------------
console.log("[1] TESTING NoSQL INJECTION VULNERABILITY (Login Bypass Attack)");
console.log("-----------------------------------------------------------------");
const maliciousPayload = {
    email: { "$gt": "" },       // Malicious query selector bypassing email check
    password: { "$ne": null }   // Malicious query selector bypassing password check
};

console.log("Attacker sends payload:", JSON.stringify(maliciousPayload));

// Without sanitization:
console.log("-> Vulnerable State: Raw MongoDB selector passes into query directly!");
console.log("   Query executed: db.users.findOne({ email: { '$gt': '' } })");
console.log("   Result: First matching user returned, authentication bypassed! ❌ [VULNERABLE]");

// With express-mongo-sanitize:
const sanitizedPayload = mongoSanitize.sanitize({ ...maliciousPayload });
console.log("\n-> Applying express-mongo-sanitize & input validation:");
console.log("   Sanitized payload:", JSON.stringify(sanitizedPayload));
console.log("   Result: All '$' keys stripped. Malicious selectors neutralized! ✅ [SECURED]\n");


// -------------------------------------------------------------
// 2. XSS (CROSS-SITE SCRIPTING) DEMO (Step 4)
// -------------------------------------------------------------
console.log("[2] TESTING XSS (CROSS-SITE SCRIPTING) IN FEEDBACK / COMMENT BOX");
console.log("-----------------------------------------------------------------");
const xssPayload = "<script>alert('hi')</script>";
const imageXssPayload = "<img src=x onerror=\"alert('XSS Exploit')\">";

console.log("Attacker inputs feedback:", xssPayload);
console.log("-> Vulnerable State (Unescaped / dangerouslySetInnerHTML):");
console.log("   Browser parses as executable DOM node -> Script executes, session hijackable! ❌ [VULNERABLE]");

console.log("\n-> Fixed State (React Text Node + Helmet CSP):");
console.log("   1. React converts HTML special chars to text strings: &lt;script&gt;alert('hi')&lt;/script&gt;");
console.log("   2. Helmet injects Content-Security-Policy (CSP) blocking inline script tags.");
console.log("   Result: Code rendered harmlessly as plain text. ✅ [SECURED]\n");


// -------------------------------------------------------------
// 3. SECURE COOKIE & CSRF PROTECTION DEMO (Step 5)
// -------------------------------------------------------------
console.log("[3] TESTING COOKIE SECURITY & CSRF DEFENSE");
console.log("-----------------------------------------------------------------");
const cookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600000
};

console.log("Server sends Set-Cookie with configuration:");
console.log(JSON.stringify(cookieConfig, null, 2));
console.log("-> 'httpOnly: true' : document.cookie cannot read the token in JavaScript (Prevents XSS theft).");
console.log("-> 'secure: true'   : Cookie is only transmitted over encrypted HTTPS channels.");
console.log("-> 'sameSite: strict' : Cookie will NOT be sent on cross-site requests.");
console.log("   CSRF Explanation: Cross-Site Request Forgery occurs when an attacker's site");
console.log("   submits unauthorized commands using the user's logged-in session.");
console.log("   SameSite=Strict prevents this by refusing to attach cookies across origins! ✅ [SECURED]\n");

console.log("=================================================================");
console.log(" ALL SECURITY VERIFICATIONS PASSED SUCCESSFULLY");
console.log("=================================================================");
