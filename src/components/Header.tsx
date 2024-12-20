import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 z-10">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Pokemon Sleep Management</h1>

                {/* ハンバーガーメニューアイコン */}
                <button
                    type="button"
                    className="text-gray-800 md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                {/* ナビゲーションリンク (PC表示) */}
                <nav className="hidden md:flex gap-6">
                    <Link to="/" className="text-blue-500 hover:underline">
                        レベル管理
                    </Link>
                    <Link to="/list" className="text-blue-500 hover:underline">
                        保存済みポケモン
                    </Link>
                </nav>
            </div>

            {/* ナビゲーションメニュー (スマホ用) */}
            {menuOpen && (
                <nav className="mt-4 flex flex-col gap-4 md:hidden">
                    <Link to="/" className="text-blue-500 hover:underline">
                        レベル管理
                    </Link>
                    <Link to="/list" className="text-blue-500 hover:underline">
                        保存済みポケモン
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;
