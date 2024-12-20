import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Calculator from "./pages/Calculator";

const App = () => (
    // vite.config.ts の base に指定したパスを basename に指定する
    <Router basename="/pokemonsleep-management">
        <Routes>
            <Route path="/" element={<Calculator />} />
        </Routes>
    </Router>
);

export default App;
