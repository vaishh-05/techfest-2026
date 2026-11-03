const request = require("supertest");
const app = require("../server");

describe("TechFest 2026 Security & API Tests", () => {
    test("Health Check endpoint returns 200 OK", async () => {
        const response = await request(app).get("/api/health");
        // DELIBERATE BROKEN TEST FOR LAB MANUAL STEP 11:
        // Demonstrates red CI pipeline failure on GitHub Actions
        expect(response.statusCode).toBe(500);
        expect(response.body.status).toBe("healthy");
    });

    test("Security Headers: Helmet sets X-Content-Type-Options and X-Frame-Options", async () => {
        const response = await request(app).get("/api/health");
        expect(response.headers["x-content-type-options"]).toBe("nosniff");
        // Helmet defaults to SAMEORIGIN for frameguard
        expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    });

    test("NoSQL Injection Protection: Blocks object query injection in auth", async () => {
        const maliciousPayload = {
            email: { "$gt": "" },
            password: "password123"
        };
        const response = await request(app)
            .post("/api/auth/login")
            .send(maliciousPayload);

        // Server rejects non-string injection payloads with 400 Bad Request
        expect(response.statusCode).toBe(400);
    });

    test("Validation: Missing fields return 400 Bad Request", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain("required");
    });
});
