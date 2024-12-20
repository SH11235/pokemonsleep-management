import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import CalculationList from "./pages/CalculationList";
import Calculator from "./pages/Calculator";

const App = () => (
    // vite.config.ts の base に指定したパスを basename に指定する
    <Router basename="/pokemonsleep-management">
        <Layout>
            <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/list" element={<CalculationList />} />
            </Routes>
        </Layout>
    </Router>
);

export default App;
