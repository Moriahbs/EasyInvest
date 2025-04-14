// ExampleStartupWrapperPage.tsx
import React from 'react';
import StartupInfo from '@/components/ui/StartupInfo.tsx';
import { STARTUP_MOCK_DATA } from '@/models/StartupModel.ts';

const ExampleStartupWrapperPage: React.FC = () => {
    const startup = STARTUP_MOCK_DATA[0];

    return (
        <div
            className="min-h-screen bg-gray-200 flex justify-center items-center p-4 direction-rtl font-rubik"
        >
            <StartupInfo startup={startup} />
        </div>
    );
};

export default ExampleStartupWrapperPage;