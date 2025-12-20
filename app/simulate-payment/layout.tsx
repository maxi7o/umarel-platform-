
import "../globals.css";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simulate Payment',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
