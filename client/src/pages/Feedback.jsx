import { useState } from "react";

function Feedback() {
    const [feedback, setFeedback] = useState("");
    const [submittedFeedback, setSubmittedFeedback] = useState([
        {
            id: 1,
            author: "Attendee",
            text: "Great event organization and exciting hackathon tracks!"
        }
    ]);
    const [isVulnerableMode, setIsVulnerableMode] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        const newEntry = {
            id: Date.now(),
            author: "User",
            text: feedback
        };

        setSubmittedFeedback([...submittedFeedback, newEntry]);
        setFeedback("");
    };

    return (
        <div className="page">
            <h1>Feedback & Security Demonstration</h1>
            <p>
                <strong>OWASP A03 - Cross-Site Scripting (XSS) Demonstration:</strong><br />
                Try typing <code>&lt;img src=x onerror="alert('XSS Vulnerability Executed!')"&gt;</code> or <code>&lt;script&gt;alert('hi')&lt;/script&gt;</code> into the feedback box.
            </p>

            {/* Mode Switch for Before / After Screenshots */}
            <div style={{
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                backgroundColor: isVulnerableMode ? "#fee2e2" : "#dcfce7",
                border: `1px solid ${isVulnerableMode ? "#ef4444" : "#22c55e"}`
            }}>
                <label style={{ cursor: "pointer", fontWeight: "bold" }}>
                    <input
                        type="checkbox"
                        checked={isVulnerableMode}
                        onChange={(e) => setIsVulnerableMode(e.target.checked)}
                        style={{ marginRight: "10px" }}
                    />
                    {isVulnerableMode
                        ? "⚠️ VULNERABLE MODE (dangerouslySetInnerHTML active - scripts will execute)"
                        : "🛡️ SECURED MODE (React safe plain-text escaping active)"}
                </label>
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
                <label htmlFor="feedbackInput">Your Feedback:</label>
                <textarea
                    id="feedbackInput"
                    rows="3"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your comments or test XSS payload..."
                    style={{ width: "100%", padding: "10px", marginTop: "6px", boxSizing: "border-box" }}
                />
                <button type="submit" style={{ marginTop: "10px" }}>Submit Feedback</button>
            </form>

            <h2>Submitted Feedback</h2>
            <div className="feedback-list">
                {submittedFeedback.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "12px",
                            backgroundColor: "var(--card-bg, #fff)"
                        }}
                    >
                        <strong>{item.author}: </strong>
                        {isVulnerableMode ? (
                            // Vulnerable rendering allows HTML execution
                            <span dangerouslySetInnerHTML={{ __html: item.text }} />
                        ) : (
                            // Secure rendering: React treats text as string literal, encoding special chars safely
                            <span className="feedback-safe-text">{item.text}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feedback;
