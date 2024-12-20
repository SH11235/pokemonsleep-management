import type { ReactNode } from "react";

import Header from "./Header";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => (
    <>
        <Header />
        <main className="p-6">{children}</main>
    </>
);

export default Layout;
