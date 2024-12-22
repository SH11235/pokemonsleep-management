import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useGoogleAnalytics = (trackingId: string) => {
    const location = useLocation();

    useEffect(() => {
        if (import.meta.env.MODE === "production" && window.gtag) {
            window.gtag("config", trackingId, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location, trackingId]);
};

export default useGoogleAnalytics;
