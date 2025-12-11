import { CreateOfferingForm } from '@/components/offering/create-offering-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Mock user for demo - in real app, get from session
const MOCK_USER_ID = 'user-123';

export default function CreateOfferingPage() {
    return (
        <div className="container mx-auto max-w-3xl py-10 px-6">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-outfit mb-2">Offer Your Services</h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Create a professional listing to showcase your skills and get discovered by people in your area.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                    <CardDescription>
                        Provide comprehensive information about the service you wish to offer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateOfferingForm userId={MOCK_USER_ID} />
                </CardContent>
            </Card>
        </div>
    );
}
