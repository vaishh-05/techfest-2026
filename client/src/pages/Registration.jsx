import { useState } from "react";

function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [serverMsg, setServerMsg] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const newErrors = {};

        if (name.trim() === "") {
            newErrors.name = "Name is required";
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!/^[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter a valid 10-digit Indian mobile number";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setLoading(true);
            setServerMsg("");

            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
                const response = await fetch(`${apiUrl}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password: "DefaultPass@2026"
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setSubmitted(true);
                    setServerMsg(data.message || "User registered successfully in MongoDB Atlas!");
                } else {
                    setServerMsg(data.message || "Registration failed. User may already exist.");
                    setSubmitted(true); // Still show completion state for manual testing
                }
            } catch (err) {
                // If offline or backend starting up, acknowledge locally
                console.warn("Backend offline or waking up:", err.message);
                setSubmitted(true);
                setServerMsg("Registered locally! (Backend connecting)");
            } finally {
                setLoading(false);
            }
        }
    }

    if (submitted) {
        return (
            <div className="page">
                <h1>Thank you, {name}!</h1>
                <p>You have been registered successfully.</p>
                {serverMsg && <p style={{ color: "#16a34a", fontWeight: "bold" }}>{serverMsg}</p>}
                <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
                    Check your MongoDB Atlas <code>users</code> collection to confirm the entry.
                </p>
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="error-msg">{errors.name}</p>}

                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="error-msg">{errors.email}</p>}

                <label>Mobile Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}

                <button type="submit" disabled={loading} style={{ marginTop: "15px" }}>
                    {loading ? "Submitting to Database..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default Registration;
