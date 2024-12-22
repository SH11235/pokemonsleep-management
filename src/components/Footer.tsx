import { Link } from "react-router-dom";

import { pages } from "@/constants";

export const Footer = () => (
    <footer className="bg-gray-800 text-white text-center py-4">
        <p>
            <Link
                to={pages.privacy.path}
                className="underline hover:text-gray-400"
            >
                プライバシーポリシー
            </Link>
        </p>
    </footer>
);
