import { UniversalSliceIDE } from '@/components/ide/universal-slice-ide';

export default function IdeDemoPage() {
    return (
        <div className="h-screen w-screen overflow-hidden">
            {/* Force full screen, bypass layout if needed */}
            <UniversalSliceIDE
                initialMode="EXPERIENCE_DESIGN"
                userRole="provider"
            />
        </div>
    );
}
