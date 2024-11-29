const GreenGator = () => {
  const [news, setNews] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [newUpdates, setNewUpdates] = React.useState(false);

  const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';

  const KEYWORD_WEIGHTS = {
    'Technical & Operational Accounting': {
      primary: ['GAAP', 'IFRS', 'accounting standard', 'financial reporting', 'accounting rule'],
      secondary: ['audit', 'financial statement', 'accounting principle', 'revenue recognition'],
    },
    'Capital Markets': {
      primary: ['IPO', 'capital market', 'securities', 'stock market', 'debt offering'],
      secondary: ['equity market', 'bond market', 'market capital', 'public offering'],
    },
    'Strategic Finance': {
      primary: ['financial planning', 'FP&A', 'financial analytics', 'corporate strategy'],
      secondary: ['financial forecast', 'budget planning', 'strategic planning', 'financial strategy'],
    },
    'ESG & Sustainability': {
      primary: ['ESG', 'sustainability report', 'climate reporting', 'carbon emission'],
      secondary: ['renewable', 'sustainable', 'climate risk', 'environmental impact'],
    },
    'Operational Transformation': {
      primary: ['process improvement', 'operational efficiency', 'business transformation'],
      secondary: ['workflow optimization', 'process automation', 'operational excellence'],
    },
    'Technology Transformation': {
      primary: ['digital transformation', 'cloud migration', 'enterprise technology'],
      secondary: ['IT modernization', 'tech implementation', 'systems upgrade'],
    },
    'Risk & Compliance': {
      primary: ['risk management', 'compliance requirement', 'regulatory', 'governance'],
      secondary: ['risk assessment', 'internal control', 'compliance program'],
    },
    Cybersecurity: {
      primary: ['cyber attack', 'data breach', 'cybersecurity', 'cyber threat'],
      secondary: ['information security', 'cyber risk', 'security breach', 'cyber defense'],
    },
    'Forensic Accounting': {
      primary: ['fraud detection', 'forensic investigation', 'financial fraud', 'forensic audit'],
      secondary: ['fraud risk', 'investigation', 'dispute', 'fraud scheme'],
    },
    'Tax Services': {
      primary: ['tax regulation', 'tax law', 'tax compliance', 'tax reform'],
      secondary: ['tax planning', 'tax policy', 'tax requirement', 'IRS'],
    },
    'Treasury Services': {
      primary: ['treasury management', 'cash management', 'liquidity', 'working capital'],
      secondary: ['cash flow', 'treasury operation', 'payment system', 'banking relationship'],
    },
    'Valuation Services': {
      primary: ['business valuation', 'fair value', 'asset valuation', 'valuation analysis'],
      secondary: ['appraisal', 'valuation method', 'market value', 'value assessment'],
    },
    'Transaction Advisory': {
      primary: ['M&A', 'due diligence', 'merger', 'acquisition'],
      secondary: ['deal advisory', 'transaction support', 'deal value', 'deal structure'],
    },
    'Workforce Transformation': {
      primary: ['HR transformation', 'talent management', 'workforce planning'],
      secondary: ['employee experience', 'workforce strategy', 'talent development'],
    },
    Restructuring: {
      primary: ['restructuring', 'turnaround', 'bankruptcy', 'reorganization'],
      secondary: ['debt restructuring', 'business recovery', 'financial distress'],
    },
  };

  const REGULATORY_KEYWORDS = {
    SEC_FILINGS: {
      primary: ['10-K', '10-Q', '8-K', 'Form S-1', 'proxy statement', 'securities registration'],
      secondary: ['annual report', 'quarterly report', 'material event'],
    },
    IRS_UPDATES: {
      primary: ['revenue procedure', 'revenue ruling', 'tax guidance', 'notice', 'regulation'],
      secondary: ['memorandum', 'announcement', 'determination', 'private letter'],
    },
  };

  const CATEGORIES = Object.keys(KEYWORD_WEIGHTS);

  const INDUSTRIES = {
    'Business Services': {
      keywords: ['business services', 'professional services', 'consulting'],
      sources: ['https://news.google.com/rss/search?q="business+services"+OR+"professional+services"+when:7d'],
    },
    Consumer: {
      keywords: ['retail', 'consumer goods', 'e-commerce'],
      sources: ['https://www.retaildive.com/rss/news/', 'https://www.consumergoods.com/rss.xml'],
    },
    'Energy & Utilities': {
      keywords: ['energy', 'utilities', 'power', 'renewable energy'],
      sources: ['https://www.utilitydive.com/rss/news/', 'https://www.renewableenergyworld.com/feed/'],
    },
    'Financial Services': {
      keywords: ['banking', 'insurance', 'fintech', 'asset management'],
      sources: ['https://www.bankingdive.com/rss/news/', 'https://www.insurancejournal.com/feed/'],
    },
    Healthcare: {
      keywords: ['healthcare', 'hospitals', 'medical', 'health insurance'],
      sources: ['https://www.healthcaredive.com/rss/news/', 'https://www.modernhealthcare.com/rss'],
    },
    'Life Sciences': {
      keywords: ['pharmaceutical', 'biotech', 'life sciences', 'medical devices'],
      sources: ['https://www.biopharmadive.com/rss/news/', 'https://www.fiercebiotech.com/rss'],
    },
    Manufacturing: {
      keywords: ['manufacturing', 'industrial', 'production', 'supply chain'],
      sources: ['https://www.industryweek.com/rss', 'https://www.manufacturing.net/rss'],
    },
    'Media & Entertainment': {
      keywords: ['media industry', 'broadcasting business', 'entertainment industry', 'media company'],
      sources: [
        'https://www.mediapost.com/rss',
        'https://news.google.com/rss/search?q="media+industry"+OR+"entertainment+business"+OR+"broadcasting+company"+when:7d',
      ],
    },
    'Real Estate': {
      keywords: ['real estate', 'property', 'REIT', 'commercial real estate'],
      sources: ['https://www.bisnow.com/feed', 'https://www.globest.com/feed'],
    },
    'Software & Tech': {
      keywords: ['technology', 'software', 'SaaS', 'cloud computing'],
      sources: ['https://techcrunch.com/feed/', 'https://www.zdnet.com/rss.xml'],
    },
  };

  const NEWS_SOURCES = {
    accounting: [
      'https://www.accountingtoday.com/feed',
      'https://www.journalofaccountancy.com/rss/all-news.xml',
      'https://www.ifrs.org/news-and-events/rss-feeds/',
      'https://www.fasb.org/cs/ContentServer?c=Page&pagename=FASB%2FPage%2FSectionPage&cid=1176156316498',
      'https://news.google.com/rss/search?q=GAAP+OR+IFRS+OR+"accounting+standards"+when:7d',
    ],
    markets: [
      'https://www.globalcapital.com/rss/custody-and-clearing.rss',
      'https://news.google.com/rss/search?q="capital+markets"+OR+IPO+OR+"debt+offering"+when:7d',
      'https://feeds.finextra.com/finextra-news-capital-markets.rss',
      'https://www.marketwatch.com/rss/topstories',
    ],
    esg: [
      'https://www.esginvestor.net/feed/',
      'https://www.esgtoday.com/feed/',
      'https://news.google.com/rss/search?q=ESG+OR+"sustainability+reporting"+when:7d',
    ],
    tech: [
      'https://feeds.feedburner.com/TheHackersNews',
      'https://www.darkreading.com/rss.xml',
      'https://www.csoonline.com/index.rss',
      'https://news.google.com/rss/search?q=cybersecurity+OR+"digital+transformation"+when:7d',
    ],
    tax: [
      'https://www.irs.gov/newsroom/feed',
      'https://news.google.com/rss/search?q="tax+regulation"+OR+"tax+law"+OR+"tax+compliance"+when:7d',
      'https://www.taxnotes.com/feed',
    ],
    treasury: [
      'https://news.google.com/rss/search?q="treasury+management"+OR+"cash+management"+when:7d',
      'https://www.gtnews.com/feed/',
      'https://www.treasury-management.com/rss/news.php',
    ],
    workforce: [
      'https://news.google.com/rss/search?q="workforce+transformation"+OR+"HR+transformation"+when:7d',
      'https://www.shrm.org/rss/pages/rss.aspx',
      'https://www.hcamag.com/feed',
    ],
    ma: [
      'https://news.google.com/rss/search?q="mergers+and+acquisitions"+OR+"M&A+deals"+when:7d',
      'https://www.themiddlemarket.com/feed',
      'https://www.dealmarket.com/feed',
    ],
    regulatory: {
      sec: [
        'https://www.sec.gov/news/pressreleases.rss',
        'https://www.sec.gov/news/financial-reporting-alerts/rss',
      ],
      irs: ['https://www.irs.gov/newsroom/feed'],
    },
  };

  const categorizeArticle = (article) => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    const scores = {};

    // Score regular categories
    Object.entries(KEYWORD_WEIGHTS).forEach(([category, weights]) => {
      scores[category] = 0;
      weights.primary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[category] += 2;
      });
      weights.secondary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[category] += 1;
      });
    });

    // Score industries
    Object.entries(INDUSTRIES).forEach(([industry, data]) => {
      scores[industry] = 0;
      data.keywords.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[industry] += 1;
      });
    });

    // Special handling for SEC and IRS
    if (article.source === 'SEC EDGAR') {
      scores['Technical & Operational Accounting'] = 2;
      scores['Risk & Compliance'] = 2;
    }
    if (article.source === 'IRS Updates') {
      scores['Tax Services'] = 2;
    }

    let matchedCategories = Object.entries(scores)
      .filter(([key, score]) => score >= 2 && CATEGORIES.includes(key))
      .map(([category]) => category);

    const matchedIndustries = Object.entries(scores)
      .filter(([key, score]) => score >= 1 && Object.keys(INDUSTRIES).includes(key))
      .map(([industry]) => industry);

    return {
      categories: matchedCategories.length ? [...new Set(matchedCategories)] : ['Other'],
      industries: matchedIndustries.length ? matchedIndustries : ['General'],
    };
  };

  const processDescription = (desc) => {
    if (!desc) return '';
    const cleaned = desc.replace(/<[^>]*>/g, '');
    return cleaned.length > 200 ? cleaned.substring(0, 200) + '...' : cleaned;
  };

  const getAllSources = () => {
    const sources = [
      ...Object.values(NEWS_SOURCES)
        .filter((value) => Array.isArray(value))
        .flat(),
      ...Object.values(INDUSTRIES).flatMap((industry) => industry.sources),
    ];
    return [...new Set(sources)];
  };

  const fetchRegulatoryData = async () => {
    try {
      // SEC RSS Feed
      const secRssUrl = 'https://www.sec.gov/news/pressreleases.rss';
      const secResponse = await fetch(RSS_PROXY + encodeURIComponent(secRssUrl));
      const secData = await secResponse.json();
      const secItems = secData.items || [];

      // IRS RSS Feed
      const irsRssUrl = 'https://www.irs.gov/newsroom/feed';
      const irsResponse = await fetch(RSS_PROXY + encodeURIComponent(irsRssUrl));
      const irsData = await irsResponse.json();
      const irsItems = irsData.items || [];

      return [...secItems, ...irsItems];
    } catch (error) {
      console.error('Regulatory API Error:', error);
      return [];
    }
  };

  const processRegulatoryData = (data) => {
    return data
      .map((item) => {
        const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();

        // Identify source based on link or title
        const isSEC = item.link && item.link.includes('sec.gov');
        const isIRS = item.link && item.link.includes('irs.gov');

        if (isSEC) {
          return {
            title: item.title || 'SEC Filing',
            description: processDescription(item.description),
            date: item.pubDate || new Date().toISOString(),
            link: item.link,
            source: 'SEC EDGAR',
            categories: ['Technical & Operational Accounting', 'Risk & Compliance'],
            industries: ['Financial Services'],
          };
        } else if (isIRS) {
          return {
            title: item.title || 'IRS Update',
            description: processDescription(item.description),
            date: item.pubDate || new Date().toISOString(),
            link: item.link,
            source: 'IRS Updates',
            categories: ['Tax Services'],
            industries: ['General'],
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both RSS and regulatory data in parallel
      const [rssNews, regulatoryData] = await Promise.all([
        Promise.all(
          getAllSources().map((source) =>
            fetch(RSS_PROXY + encodeURIComponent(source))
              .then((res) => res.json())
              .then((data) => data.items || [])
              .catch(() => [])
          )
        ),
        fetchRegulatoryData(),
      ]);

      const processedRegulatory = processRegulatoryData(regulatoryData);

      // Process RSS news
      const processedRSS = rssNews.flat().map((item) => {
        const { categories, industries } = categorizeArticle(item);
        return {
          title: item.title || '',
          description: processDescription(item.description),
          date: item.pubDate,
          link: item.link,
          source: item.link ? new URL(item.link).hostname : 'Unknown',
          categories,
          industries,
        };
      });

      // Combine and filter all news
      const allNews = [...processedRegulatory, ...processedRSS].filter((item) => {
        // Skip items only categorized as Other/General
        if (
          item.categories.length === 1 &&
          item.categories[0] === 'Other' &&
          item.industries.length === 1 &&
          item.industries[0] === 'General'
        ) {
          return false;
        }
        return (
          (selectedCategory === 'all' || item.categories.includes(selectedCategory)) &&
          (selectedIndustry === 'all' || item.industries.includes(selectedIndustry))
        );
      });

      // Remove duplicates and sort
      const uniqueNews = Array.from(new Map(allNews.map((item) => [item.title, item])).values()).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Check for new updates
      if (uniqueNews.length > news.length) {
        setNewUpdates(true);
      } else {
        setNewUpdates(false);
      }

      setNews(uniqueNews);
    } catch (error) {
      setError('Failed to fetch news. Please try again later.');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 3600000); // Refresh every hour
    return () => clearInterval(interval);
  }, [selectedCategory, selectedIndustry]);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
        </div>

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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Remove the export statement and instead render the component directly
ReactDOM.render(<GreenGator />, document.getElementById('root'));
