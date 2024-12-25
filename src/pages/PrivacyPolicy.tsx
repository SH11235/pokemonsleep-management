const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow rounded">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                プライバシーポリシー
            </h1>
            <p className="text-gray-700 mb-4">
                当サイトでは、Google
                Analyticsを使用して訪問者のサイト利用状況を分析しています。
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-700">
                <li>収集されるデータ：デバイス情報、閲覧ページなど。</li>
                <li>
                    データは匿名化されており、個人を特定するものではありません。
                </li>
                <li>
                    詳細は
                    <a
                        href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        Google Analytics利用規約
                    </a>
                    をご覧ください。
                </li>
            </ul>
        </div>
    );
};

export default PrivacyPolicy;
