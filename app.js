const GreenGator = () => {
    const [news, setNews] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [selectedIndustry, setSelectedIndustry] = React.useState('all');
    const [loading, setLoading] = React.useState(true);

    const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

    const CATEGORIES = {
        'Technical & Operational Accounting': ['accounting standards', 'GAAP', 'IFRS', 'financial reporting', 'audit'],
        'Capital Markets': ['IPO', 'capital markets', 'securities', 'stock market', 'debt offering'],
        'Strategic Finance': ['financial planning', 'FP&A', 'financial analytics', 'corporate strategy'],
        'ESG & Sustainability': ['ESG', 'sustainability', 'climate reporting', 'carbon', 'renewable'],
        'Operational Transformation': ['process improvement', 'operational efficiency', 'business transformation'],
        'Technology Transformation': ['digital transformation', 'cloud migration', 'enterprise technology'],
        'Risk & Compliance': ['risk management', 'compliance', 'regulatory', 'governance'],
        'Cybersecurity': ['cyber security', 'data breach', 'information security', 'cyber risk'],
        'Forensic Accounting': ['fraud', 'forensic', 'investigation', 'dispute'],
        'Tax Services': ['tax', 'IRS', 'taxation', 'tax compliance'],
        'Treasury Services': ['treasury', 'cash management', 'liquidity', 'working capital'],
        'Valuation Services': ['valuation', 'fair value', 'business valuation', 'asset valuation'],
        'Transaction Advisory': ['M&A', 'due diligence', 'transaction', 'deal advisory'],
        'Workforce Transformation': ['HR transformation', 'talent management', 'workforce planning'],
        'Restructuring': ['restructuring', 'turnaround', 'bankruptcy', 'reorganization']
    };

    const INDUSTRIES = {
        'Business Services': ['business services', 'professional services', 'consulting'],
        'Consumer': ['retail', 'consumer goods', 'e-commerce'],
        'Energy & Utilities': ['energy', 'utilities', 'power', 'renewable energy'],
        'Financial Services': ['banking', 'insurance', 'fintech', 'asset management'],
        'Healthcare': ['healthcare', 'hospitals', 'medical', 'health insurance'],
        'Life Sciences': ['pharmaceutical', 'biotech', 'life sciences', 'medical devices'],
        'Manufacturing': ['manufacturing', 'industrial', 'production', 'supply chain'],
        'Media & Entertainment': ['media', 'entertainment', 'streaming', 'gaming'],
        'Real Estate': ['real estate', 'property', 'REIT', 'commercial real estate'],
        'Software & Tech': ['technology', 'software', 'SaaS', 'cloud computing']
    };

    const NEWS_SOURCES = {
        accounting: [
            'https://www.accountingtoday.com/feed',
            'https://www.journalofaccountancy.com/rss/all-news.xml',
            'https://www.fasb.org/rss/news',
            'https://www.ifrs.org/news-and-events/rss-feeds/'
        ],
        regulatory: [
            'https://www.sec.gov/rss/news/press.xml',
            'https://www.irs.gov/newsroom/feed',
            'https://www.pcaobus.org/rss/news',
            'https://www.bis.org/rss/feeds.htm'
        ],
        finance: [
            'https://www.reuters.com/rssfeed/businessNews',
            'https://www.ft.com/rss/companies',
            'https://www.treasuryandrisk.com/feed/',
            'https://www.globalcapital.com/rss/custody-and-clearing.rss'
        ],
        esg: [
            'https://www.esginvestor.net/feed/',
            'https://www.esgtoday.com/feed/',
            'https://news.google.com/rss/search?q=ESG+sustainability+when:7d'
        ],
        tech: [
            'https://feeds.feedburner.com/TheHackersNews',
            'https://www.darkreading.com/rss.xml',
            'https://www.csoonline.com/index.rss',
            'https://www.infosecurity-magazine.com/rss/news/'
        ]
    };

    const categorizeArticle = (article) => {
        const text = `${article.title} ${article.description || ''}`.toLowerCase();
        const categories = [];
        const industries = [];

        Object.entries(CATEGORIES).forEach(([category, keywords]) => {
            if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                categories.push(category);
            }
        });

        Object.entries(INDUSTRIES).forEach(([industry, keywords]) => {
            if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
                industries.push(industry);
            }
        });

        return {
            categories: categories.length ? categories : ['Other'],
            industries: industries.length ? industries : ['General']
        };
    };

    const processDescription = (desc) => {
        if (!desc) return '';
        const cleaned = desc.replace(/<[^>]*>/g, '');
        return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
    };

    const fetchAllNews = async () => {
        setLoading(true);
        try {
            const allSources = [...Object.values(NEWS_SOURCES).flat()];
            const allNews = await Promise.all(
                allSources.map(source => 
                    fetch(RSS_PROXY + encodeURIComponent(source))
                    .then(res => res.json())
                    .then(data => data.items || [])
                    .catch(() => [])
                )
            );

            const processed = allNews.flat()
                .map(item => {
                    const {categories, industries} = categorizeArticle(item);
                    return {
                        title: item.title || '',
                        description: processDescription(item.description),
                        date: item.pubDate,
                        link: item.link,
                        source: item.link ? new URL(item.link).hostname : 'Unknown',
                        categories,
                        industries
                    };
                })
                .filter(item => 
                    (selectedCategory === 'all' || item.categories.includes(selectedCategory)) &&
                    (selectedIndustry === 'all' || item.industries.includes(selectedIndustry))
                );

            const uniqueNews = Array.from(new Map(processed.map(item => [item.title, item])).values())
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            setNews(uniqueNews);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchAllNews();
        const interval = setInterval(fetchAllNews, 3600000);
        return () => clearInterval(interval);
    }, [selectedCategory, selectedIndustry]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-green-800">GreenGator 🐊</h1>
                    <button 
                        onClick={fetchAllNews}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Refresh News
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Line
                        </label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Business Lines</option>
                            {Object.keys(CATEGORIES).map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry
                        </label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                        >
                            <option value="all">All Industries</option>
                            {Object.keys(INDUSTRIES).map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {news.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                                    <span className="text-sm text-gray-500">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{item.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.categories.map((cat, i) => (
                                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {cat}
                                        </span>
                                    ))}
                                    {item.industries.map((ind, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {ind}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{item.source}</span>
                                    <a 
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 font-medium"
                                    >
                                        Read More →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

ReactDOM.render(<GreenGator />, document.getElementById('root'));
