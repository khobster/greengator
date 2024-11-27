const GreenGator = () => {
    const [news, setNews] = React.useState([]);
    
    React.useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('https://newsapi.org/v2/everything?q=ESG%20OR%20sustainability%20OR%20accounting%20OR%20finance&apiKey=YOUR_API_KEY');
            const data = await response.json();
            setNews(data.articles);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="p-4 bg-green-50">
            <h1 className="text-3xl mb-4 text-green-800">GreenGator</h1>
            <div className="grid gap-4">
                {news.map((article, index) => (
                    <div key={index} className="border p-4 rounded bg-white shadow">
                        <h2 className="font-bold text-green-700">{article.title}</h2>
                        <p className="text-gray-600">{article.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(<GreenGator />, document.getElementById('root'));
