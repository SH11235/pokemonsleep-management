import { type ReactNode, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    useLocation,
} from "react-router-dom";

import Layout from "./components/Layout";
import CalculationList from "./pages/CalculationList";
import Calculator from "./pages/Calculator";

const App = () => (
    // vite.config.ts の base に指定したパスを basename に指定する
    <Router basename="/pokemonsleep-management/">
        <RedirectHandler>
            <Layout>
                <Routes>
                    <Route path="/" element={<Calculator />} />
                    <Route path="/list" element={<CalculationList />} />
                </Routes>
            </Layout>
        </RedirectHandler>
    </Router>
);

const RedirectHandler = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let redirectPath = params.get("redirect");

        if (redirectPath) {
            // `basename` が重複している場合を取り除く
            if (redirectPath.startsWith("/pokemonsleep-management")) {
                redirectPath = redirectPath.slice(
                    "/pokemonsleep-management".length,
                );
            }

            // リダイレクトを実行
            navigate(redirectPath, { replace: true });
        }
    }, [location, navigate]);

    return <>{children}</>;
};

export default App;
