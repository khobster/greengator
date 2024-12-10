const GreenGator = () => {
  const [news, setNews] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [newUpdates, setNewUpdates] = React.useState(false);
  const [selectedArticles, setSelectedArticles] = React.useState([]);
  const [includeBig4, setIncludeBig4] = React.useState(false);

  const RSS_PROXY = 'https://us-central1-greengatorproxy.cloudfunctions.net/fetchRss?url=';

  const KEYWORD_WEIGHTS = { /* unchanged */ };
  const REGULATORY_KEYWORDS = { /* unchanged */ };
  const CATEGORIES = Object.keys(KEYWORD_WEIGHTS);
  const INDUSTRIES = { /* unchanged */ };

  const NEWS_SOURCES = {
    accounting: [
      'https://www.accountingtoday.com/rss',
      'https://www.journalofaccountancy.com/rss/all-news.xml',
      'https://www.ifrs.org/news-and-events/updates/rss.xml',
      'https://www.fasb.org/jsp/rss/rss.jsp?rssFeed=FASB_News_Releases',
      'https://news.google.com/rss/search?q=GAAP+OR+IFRS+OR+"accounting+standards"+when:30d',
    ],
    markets: [
      'https://www.marketwatch.com/rss/topstories',
      'https://news.google.com/rss/search?q="capital+markets"+OR+IPO+OR+"debt+offering"+when:30d',
    ],
    esg: [
      'https://www.esginvestor.net/feed/',
      'https://www.esgtoday.com/feed/',
      'https://news.google.com/rss/search?q=ESG+OR+"sustainability+reporting"+when:30d',
    ],
    tech: [
      'https://feeds.feedburner.com/TheHackersNews',
      'https://www.darkreading.com/rss.xml',
      'https://news.google.com/rss/search?q=cybersecurity+OR+"digital+transformation"+when:30d',
    ],
    tax: [
      'https://www.irs.gov/newsroom/rss',
      'https://news.google.com/rss/search?q="tax+regulation"+OR+"tax+law"+OR+"tax+compliance"+when:30d',
    ],
    treasury: [
      'https://news.google.com/rss/search?q="treasury+management"+OR+"cash+management"+when:30d',
      'https://www.treasury-management.com/rss/news.php',
    ],
    workforce: [
      'https://news.google.com/rss/search?q="workforce+transformation"+OR+"HR+transformation"+when:30d',
      'https://www.shrm.org/rss/pages/rss.aspx',
    ],
    ma: [
      'https://news.google.com/rss/search?q="mergers+and+acquisitions"+OR+"M&A+deals"+when:30d',
      'https://www.dealmarket.com/feed',
    ],
    valuation: [
      'https://news.google.com/rss/search?q="business+valuation"+OR+"asset+valuation"+when:90d',
    ],
    operational_transformation: [
      'https://opexsociety.org/feed/',
      'https://news.google.com/rss/search?q="operational+transformation"+OR+"process+optimization"+when:90d',
    ],
    forensic_accounting: [
      'https://www.acfeinsights.com/feed/',
      'https://news.google.com/rss/search?q="forensic+accounting"+OR+"fraud+investigation"+when:90d',
    ],
    strategic_finance: [
      'https://news.google.com/rss/search?q="strategic+finance"+OR+"financial+planning"+OR+"FP&A"+when:90d',
    ],
    regulatory: {
      sec: [
        'https://www.sec.gov/news/pressreleases.rss',
        'https://www.sec.gov/news/financial-reporting-alerts/rss',
      ],
      irs: ['https://www.irs.gov/newsroom/rss'],
    },
  };

  const BIG4_SOURCES = [
    'https://rss.app/feeds/RXmiGOBWPMg9xdmA.xml',
    'https://rss.app/feeds/fR519PfuWAHfWltI.xml',
    'https://rss.app/feeds/HgOktHgpDtDm9YDf.xml',
    'https://rss.app/feeds/kqcC60e2jDp4lzkI.xml'
  ];

  const categorizeArticle = (article) => {
    /* unchanged */
  };

  const processDescription = (desc) => {
    /* unchanged */
  };

  const getAllSources = () => {
    if (includeBig4) {
      return BIG4_SOURCES;
    }

    let sources = [
      ...Object.values(NEWS_SOURCES)
        .filter((value) => Array.isArray(value))
        .flat(),
      ...Object.values(INDUSTRIES).flatMap((industry) => industry.sources),
    ];

    return [...new Set(sources)];
  };

  const fetchRegulatoryData = async () => {
    /* unchanged */
  };

  const processRegulatoryData = (data) => {
    /* unchanged */
  };

  const fetchNews = async () => {
    /* unchanged */
  };

  React.useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, [selectedCategory, selectedIndustry, includeBig4]);

  const toggleArticleSelection = (article) => {
    /* unchanged */
  };

  const emailSelectedArticles = () => {
    // Change the subject line to start with 🐊:
    const subject = '🐊: Selected Articles from GreenGator';
    const selectedArticleObjects = news.filter((item) => selectedArticles.includes(item.link));
    const body = selectedArticleObjects
      .map((item) => `${item.title}\nRead more here: ${item.link}\n\n`)
      .join('');
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (mailtoLink.length > 2000) {
      alert('The selected articles are too long to send in one email.');
    } else {
      window.location.href = mailtoLink;
    }
  };

  const copySelectedArticlesToClipboard = () => {
    /* unchanged */
  };

  const allSelected = news.length > 0 && news.every((item) => selectedArticles.includes(item.link));

  const toggleSelectAll = () => {
    /* unchanged */
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">GreenGator 🐊</h1>
          <div className="flex items-center">
            {newUpdates && (
              <span className="mr-4 px-2 py-1 bg-red-500 text-white rounded-full text-sm">New Updates</span>
            )}
            <button
              onClick={fetchNews}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh News'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Line</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Business Lines</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Industries</option>
              {Object.keys(INDUSTRIES).map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <input
              type="checkbox"
              checked={includeBig4}
              onChange={(e) => setIncludeBig4(e.target.checked)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <span className="text-gray-700">Include Big 4 Only</span>
          </div>
        </div>

        {news.length > 0 && (
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="ml-2 text-gray-700">Select All</span>
            </label>
          </div>
        )}

        {selectedArticles.length > 0 && (
          <div className="mb-4 flex space-x-4">
            <button
              onClick={emailSelectedArticles}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email Selected Articles ({selectedArticles.length})
            </button>
            <button
              onClick={copySelectedArticlesToClipboard}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Copy Selected Articles
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {news.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No news articles found for the selected filters.</p>
              </div>
            ) : (
              news.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                    {item.industries.map((ind, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.source}</span>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(item.link)}
                          onChange={() => toggleArticleSelection(item)}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">Select</span>
                      </label>
                      <a
                        href={`mailto:?subject=${encodeURIComponent('🐊: ' + item.title)}&body=${encodeURIComponent(
                          item.description + '\n\nRead more here: ' + item.link
                        )}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Email Article
                      </a>
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
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<GreenGator />, document.getElementById('root'));
