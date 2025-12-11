export default function CookiePage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
            <div className="prose prose-gray max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>This policy explains how we use cookies and similar technologies.</p>

                <h3>1. What are cookies?</h3>
                <p>Cookies are small text files stored on your device.</p>

                <h3>2. How we use cookies</h3>
                <p>We use cookies for authentication, preferences, and analytics.</p>
            </div>
        </div>
    );
}
