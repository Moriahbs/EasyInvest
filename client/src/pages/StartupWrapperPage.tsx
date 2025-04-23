import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import StartupInfo from '@/components/ui/StartupInfo.tsx';
import {Startup} from '@/models/StartupModel.ts';
import {getAllStartups} from "@/actions/startupActions.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";

const StartupWrapperPage: React.FC = () => {
    const [startups, setStartUps] = useState<Startup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getAllStartups();
            setStartUps(res);
            setLoading(false);
        };

        fetchData();
    }, []);
    
    const { id } = useParams<{ id: string }>();
    const startup = startups.find((s) => s._id === id);

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4 direction-rtl font-rubik">
            {loading ? (
                <div style={{ height: "500px", width: "100%" }}>
                    <Skeleton />
                </div>
            ) : (
                startup ? (<StartupInfo startup={startup} />
                    ) : (<div
                        className="min-h-screen bg-gray-200 flex justify-center items-center p-4 direction-rtl font-rubik">
                        <p>סטארטאפ לא נמצא</p>
                    </div>)

            )}
        </div>
    );
};

export default StartupWrapperPage;