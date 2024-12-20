const GreenGator = () => {
  const [news, setNews] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedIndustry, setSelectedIndustry] = React.useState('all');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [newUpdates, setNewUpdates] = React.useState(false);
  const [selectedArticles, setSelectedArticles] = React.useState([]);
  const [includeBig4, setIncludeBig4] = React.useState(false);

  // Normal feeds use rss2json.com
  const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url=';
  // Big 4 feeds use Firebase proxy
  const FIREBASE_PROXY = 'https://us-central1-greengatorproxy.cloudfunctions.net/fetchRss?url=';

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
      primary: [
        'financial planning', 'FP&A', 'financial analytics', 'corporate strategy',
        'financial modeling', 'data analytics', 'business intelligence',
        'scenario planning', 'corporate finance strategy', 'performance metrics',
        'key performance indicators', 'KPIs',
      ],
      secondary: [
        'financial forecast', 'budget planning', 'strategic planning', 'financial strategy',
        'decision support', 'financial reporting', 'variance analysis',
      ],
    },
    'ESG & Sustainability': {
      primary: ['ESG', 'sustainability report', 'climate reporting', 'carbon emission'],
      secondary: ['renewable', 'sustainable', 'climate risk', 'environmental impact'],
    },
    'Operational Transformation': {
      primary: [
        'process improvement', 'operational efficiency', 'business transformation',
        'process optimization', 'change management', 'lean operations', 'six sigma',
        'cost reduction', 'performance improvement', 'operational excellence',
      ],
      secondary: [
        'workflow optimization', 'process automation', 'continuous improvement',
        'operational strategy', 'efficiency enhancement', 'productivity improvement',
      ],
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
      primary: [
        'fraud detection', 'forensic investigation', 'financial fraud', 'forensic audit',
        'litigation support', 'financial disputes', 'compliance investigations', 'asset misappropriation',
        'financial statement fraud', 'anti-money laundering', 'AML', 'FCPA violations',
      ],
      secondary: [
        'fraud risk', 'investigation', 'dispute', 'fraud scheme', 'regulatory enforcement',
        'whistleblower', 'internal investigation',
      ],
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
      primary: [
        'business valuation', 'fair value', 'asset valuation', 'valuation analysis',
        'purchase price allocation', 'goodwill impairment', 'intangible assets',
        'financial instruments valuation', 'complex securities', 'ASC 820', 'ASC 805',
        'valuation methodologies',
      ],
      secondary: [
        'appraisal', 'valuation method', 'market value', 'value assessment',
        'discounted cash flow', 'DCF', 'enterprise value', 'equity value',
      ],
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
      sources: ['https://news.google.com/rss/search?q="business+services"+OR+"professional+services"+when:30d'],
    },
    Consumer: {
      keywords: ['retail', 'consumer goods', 'e-commerce'],
      sources: [
        'https://www.consumergoods.com/rss.xml',
        'https://news.google.com/rss/search?q=retail+OR+"consumer+goods"+OR+e-commerce+when:30d',
      ],
    },
    'Energy & Utilities': {
      keywords: ['energy', 'utilities', 'power', 'renewable energy'],
      sources: [
        'https://www.renewableenergyworld.com/feed/',
        'https://news.google.com/rss/search?q=energy+OR+utilities+OR+"renewable+energy"+when:30d',
      ],
    },
    'Financial Services': {
      keywords: ['banking', 'insurance', 'fintech', 'asset management'],
      sources: [
        'https://www.insurancejournal.com/feed/',
        'https://news.google.com/rss/search?q=banking+OR+insurance+OR+fintech+OR+"asset+management"+when:30d',
      ],
    },
    // Adding the "Banking" industry
    'Banking': {
      keywords: [
    'bank', 'banking', 'loan', 'credit', 'lending', 'deposits', 'checking accounts', 
    'savings accounts', 'money market accounts', 'certificates of deposit', 'CDs', 
    'deposit rates', 'deposit insurance', 'commercial loans', 'consumer loans', 
    'mortgages', 'auto loans', 'credit cards', 'loan origination', 'loan servicing', 
    'loan portfolio management', 'non-performing loans', 'NPLs', 'payment processing', 
    'ACH payments', 'wire transfers', 'mobile payments', 'digital wallets', 
    'payment gateways', 'credit risk', 'market risk', 'operational risk', 
    'liquidity risk', 'regulatory compliance', 'Basel III', 'stress testing', 
    'capital adequacy', 'net interest margin', 'NIM', 'return on assets', 'ROA', 
    'return on equity', 'ROE', 'efficiency ratio', 'cost of funds', 
    'mergers and acquisitions', 'M&A', 'branch expansion', 'digital transformation', 
    'customer acquisition', 'market share', 'financial statements', 
    'regulatory reporting', 'accounting standards', 'audit', 'internal controls', 
    'fintech', 'neobanks', 'challenger banks', 'open banking', 'API banking', 
    'artificial intelligence', 'AI', 'machine learning', 'ML', 'blockchain', 
    'cloud computing', 'cybersecurity', 'online banking', 'mobile banking', 
    'digital channels', 'customer experience', 'personalization', 'Dodd-Frank Act', 
    'Consumer Financial Protection Bureau', 'CFPB', 'Federal Reserve', 'FDIC', 'OCC', 
    'anti-money laundering', 'AML', 'Know Your Customer', 'KYC', 'embedded finance', 
    'Buy Now Pay Later', 'BNPL', 'environmental, social, and governance', 
    'ESG investing', 'decentralized finance', 'DeFi' 
  ],
  sources: [
    'https://news.google.com/rss/search?q=bank+OR+banking+OR+loan+OR+credit+OR+lending+when:30d'
  ]
    },
    Healthcare: {
      keywords: ['healthcare', 'hospitals', 'medical', 'health insurance'],
      sources: [
        'https://www.modernhealthcare.com/rss',
        'https://news.google.com/rss/search?q=healthcare+OR+hospitals+OR+medical+OR+"health+insurance"+when:30d',
      ],
    },
    'Life Sciences': {
      keywords: ['pharmaceutical', 'biotech', 'life sciences', 'medical devices'],
      sources: [
        'https://www.fiercebiotech.com/rss',
        'https://news.google.com/rss/search?q=pharmaceutical+OR+biotech+OR+"life+sciences"+OR+"medical+devices"+when:30d',
      ],
    },
    Manufacturing: {
      keywords: ['manufacturing', 'industrial', 'production', 'supply chain'],
      sources: [
        'https://news.google.com/rss/search?q=manufacturing+OR+industrial+OR+production+OR+"supply+chain"+when:30d',
      ],
    },
    'Media & Entertainment': {
      keywords: ['media industry', 'broadcasting business', 'entertainment industry', 'media company'],
      sources: [
        'https://news.google.com/rss/search?q="media+industry"+OR+"entertainment+business"+OR+"broadcasting+company"+when:30d',
      ],
    },
    'Real Estate': {
      keywords: ['real estate', 'property', 'REIT', 'commercial real estate'],
      sources: [
        'https://news.google.com/rss/search?q="real+estate"+OR+property+OR+REIT+OR+"commercial+real+estate"+when:30d',
      ],
    },
    'Software & Tech': {
      keywords: ['technology', 'software', 'SaaS', 'cloud computing'],
      sources: ['https://techcrunch.com/feed/', 'https://www.zdnet.com/rss.xml'],
    },
  };

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
    const text = `${article.title} ${article.description || ''}`.toLowerCase();
    const scores = {};

    Object.entries(KEYWORD_WEIGHTS).forEach(([category, weights]) => {
      scores[category] = 0;
      weights.primary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[category] += 2;
      });
      weights.secondary.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[category] += 1;
      });
    });

    Object.entries(INDUSTRIES).forEach(([industry, data]) => {
      scores[industry] = 0;
      data.keywords.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) scores[industry] += 1;
      });
    });

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
    if (includeBig4) {
      return BIG4_SOURCES;
    }

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
      const secRssUrl = 'https://www.sec.gov/news/pressreleases.rss';
      const secResponse = await fetch(RSS_PROXY + encodeURIComponent(secRssUrl));
      const secData = await secResponse.json();
      const secItems = secData.items || [];

      const irsRssUrl = 'https://www.irs.gov/newsroom/rss';
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

  const fetchFeeds = async (sourceUrls, useFirebaseForBig4 = false) => {
    if (useFirebaseForBig4) {
      // Fetch Big 4 feeds from Firebase proxy
      return Promise.all(
        sourceUrls.map(source =>
          fetch(FIREBASE_PROXY + encodeURIComponent(source))
            .then(res => res.json())
            .then(data => data.items || [])
            .catch(() => [])
        )
      );
    } else {
      // Fetch normal feeds from rss2json.com
      return Promise.all(
        sourceUrls.map(source =>
          fetch(RSS_PROXY + encodeURIComponent(source))
            .then(res => res.json())
            .then(data => data.items || [])
            .catch(() => [])
        )
      );
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const sources = getAllSources();
      let regulatoryData = [];
      let rssNews = [];

      if (!includeBig4) {
        regulatoryData = await fetchRegulatoryData();
      }

      if (includeBig4) {
        rssNews = await fetchFeeds(sources, true);
      } else {
        rssNews = await fetchFeeds(sources, false);
      }

      const processedRegulatory = includeBig4 ? [] : processRegulatoryData(regulatoryData);

      const processedRSS = rssNews.flat().map(item => {
        const { categories, industries } = categorizeArticle(item);
        return {
          title: item.title || '',
          description: processDescription(item.description),
          date: item.pubDate,
          link: item.link,
          source: item.link ? new URL(item.link).hostname : 'Unknown',
          categories,
          industries
        };
      });

      const allNews = [...processedRegulatory, ...processedRSS].filter(item => {
        if (item.categories.length === 1 &&
          item.categories[0] === 'Other' &&
          item.industries.length === 1 &&
          item.industries[0] === 'General') {
          return false;
        }
        return (selectedCategory === 'all' || item.categories.includes(selectedCategory)) &&
          (selectedIndustry === 'all' || item.industries.includes(selectedIndustry));
      });

      const uniqueNews = Array.from(new Map(allNews.map(item => [item.title, item])).values())
        .sort((a, b) => new Date(b.date) - new Date(a.date));

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
  }, [selectedCategory, selectedIndustry, includeBig4]);

  const toggleArticleSelection = article => {
    setSelectedArticles(prevSelected => {
      if (prevSelected.includes(article.link)) {
        return prevSelected.filter(link => link !== article.link);
      } else {
        return [...prevSelected, article.link];
      }
    });
  };

  const emailSelectedArticles = () => {
    const subject = '🐊: Selected Articles from GreenGator';
    const selectedArticleObjects = news.filter(item => selectedArticles.includes(item.link));
    const body = selectedArticleObjects
      .map(item => `${item.title}\nRead more here: ${item.link}\n\n`)
      .join('');
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (mailtoLink.length > 2000) {
      alert('The selected articles are too long to send in one email.');
    } else {
      window.location.href = mailtoLink;
    }
  };

  const allSelected = news.length > 0 && news.every(item => selectedArticles.includes(item.link));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(news.map(item => item.link));
    }
  };

  const toggleBig4 = () => {
    setIncludeBig4(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">GreenGator 🐊</h1>
          <div className="flex items-center space-x-4">
            {newUpdates && (
              <span className="px-2 py-1 bg-red-500 text-white rounded-full text-sm">New Updates</span>
            )}
            <button
              onClick={fetchNews}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh News'}
            </button>
            <button
              onClick={toggleBig4}
              className="px-4 py-2 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {includeBig4 ? 'Back to Normal' : 'Big 4 Fun'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Line</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Business Lines</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              disabled={loading}
            >
              <option value="all">All Industries</option>
              {Object.keys(INDUSTRIES).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
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
          <div className="mb-4">
            <button
              onClick={emailSelectedArticles}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Email Selected Articles ({selectedArticles.length})
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
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{cat}</span>
                    ))}
                    {item.industries.map((ind, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{ind}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.source}</span>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(item.link)}
                          onChange={() => {
                            setSelectedArticles(prevSelected => {
                              if (prevSelected.includes(item.link)) {
                                return prevSelected.filter(link => link !== item.link);
                              } else {
                                return [...prevSelected, item.link];
                              }
                            });
                          }}
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
