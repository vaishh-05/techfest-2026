function Gallery() {
    const galleryItems = [
        {
            src: "https://picsum.photos/seed/techfest1/300/200",
            alt: "TechFest 2026 Robotics Exhibition and Demonstration",
            title: "Robotics Arena"
        },
        {
            src: "https://picsum.photos/seed/techfest2/300/200",
            alt: "Students actively collaborating at the 24-Hour Web Hackathon",
            title: "24-Hour Hackathon"
        },
        {
            src: "https://picsum.photos/seed/techfest3/300/200",
            alt: "Keynote presentation on AI and Cloud Computing",
            title: "Keynote Session"
        },
        {
            src: "https://picsum.photos/seed/techfest4/300/200",
            alt: "TechFest Cultural Night and Awards Ceremony",
            title: "Awards Ceremony"
        }
    ];

    return (
        <div className="page">
            <h1>TechFest Gallery</h1>
            <p>Highlights from workshops, competitions, and keynotes.</p>
            <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
                {galleryItems.map((item, index) => (
                    <div key={index} className="gallery-card" style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                        <img
                            src={item.src}
                            alt={item.alt}
                            width="300"
                            height="200"
                            loading="lazy"
                            style={{ width: "100%", height: "auto", display: "block" }}
                        />
                        <div style={{ padding: "10px" }}>
                            <strong>{item.title}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gallery;
