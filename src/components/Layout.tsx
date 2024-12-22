import type { ReactNode } from "react";

import { Footer } from "./Footer";
import Header from "./Header";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow p-6">{children}</main>
        <Footer />
    </div>
);

export default Layout;
