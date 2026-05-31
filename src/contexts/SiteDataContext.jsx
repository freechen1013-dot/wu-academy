import { createContext, useContext, useState, useEffect } from 'react';

const SiteDataContext = createContext({ isLoading: true, data: null });

export function SiteDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Backend API failed:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const value = {
    isLoading: loading,
    error,
    data,
    site: data, // alias for convenience
    brand: data?.brand || {},
    stats: data?.stats || {},
    coreValues: data?.coreValues || [],
    courseModel: data?.courseModel || [],
    timeline2026: data?.timeline2026 || [],
    oneProblem: data?.oneProblem || {},
    calendar: data?.calendar || { sessions: [] },
    instructors: data?.instructors || [],
    project: data?.project || {},
    awards: data?.awards || [],
    resources: data?.resources || {},
    email: data?.email || ''
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-wu-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入無學院資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-wu-black mb-2">資料載入失敗</h2>
          <p className="text-gray-600 mb-4">{error || '無法連接到後端伺服器'}</p>
          <p className="text-sm text-gray-500">
            請確認後端伺服器已啟動
          </p>
        </div>
      </div>
    );
  }

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}