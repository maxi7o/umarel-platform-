export default function PrivacyPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Your privacy is important to us.</p>

                <h3>1. Data Collection</h3>
                <p>We collect information you provide directly to us, such as when you create an account or post a listing.</p>

                <h3>2. Data Usage</h3>
                <p>We use your data to provide and improve our services.</p>

                <h3>3. Cookies</h3>
                <p>We use cookies to enhance your experience.</p>
            </div>
        </div>
    );
}
