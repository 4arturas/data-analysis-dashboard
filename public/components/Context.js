const { createContext, useState } = React;

const AppContext = createContext({});

const AppProvider = ({ children }) => {
    const [appContext, setAppContext] = useState({
        activeTabKey: '1',
        payloads: [],
        rawChartsData: [],
        normalizedChartsData: [], // Added for correlation analysis
        allCorrelations: [], // Added for correlation analysis (unfiltered source)
        normalizeDataForCorrelation: true,


        initialFrom: '2025-11-10T10:40:00.000Z',
        initialTo: '2025-11-10T11:10:00.000Z',

        // initialFrom: '2025-11-10T00:00:00.000Z',
        // initialTo: '2025-11-10T23:59:59.000Z',

        // initialFrom: '2025-11-10T10:00:00.000Z',
        // initialTo: '2025-11-10T11:00:00.000Z',
    });

    const contextValue = {
        appContext,
        setAppContext,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
