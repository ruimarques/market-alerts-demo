import StocksTableComponent, { StockTick } from '../components/StocksTable';
import StockSelectorComponent from '../components/StockSelector';
import AlertModalComponent, { AlertConfig } from '../components/AlertModal';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants';

const TICK_TIME = 5000;

const Dashboard = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<StockTick[]>([]);

  // Alerts state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalSymbol, setAlertSymbol] = useState('');
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);

  const getPrices = (symbols: string[]) => {
    return fetch(`${API_URL}/prices/${symbols.join(',')}`)
      .then((d) => d.json())
      .then((data: StockTick[]) => {
        console.log('getPrices', data);
        // TODO set alert status > hasAlerts
        setSymbolPrices(data);
        return data;
      });
  };

  const handleAdd = (symbol: string) => {
    // Only adds new ticker if not present in the list
    const updated = selectedSymbols.includes(symbol)
      ? selectedSymbols
      : [...selectedSymbols, symbol];

    setSelectedSymbols(updated);
    sessionStorage.setItem('symbols', JSON.stringify(updated));

    getPrices(updated);
  };

  const handleEditAlert = (symbol: string) => {
    setAlertSymbol(symbol);
    setIsAlertModalOpen(true);
  };

  const handleAlertDone = (alertConfig: AlertConfig) => {
    console.log('handleAlertDone', alertConfig.symbol, alertConfig.percentage);

    setAlerts([...alerts, alertConfig]);
  };

  const handleAlertClose = () => {
    setIsAlertModalOpen(false);
    setAlertSymbol('');
  };

  const generateAlerts = (prices: StockTick[]) => {
    //TODO based on alerts, need to check prices and trigger alerts accordingly
    console.log('generateAlerts', alerts);
    for (let i = 0; i < alerts.length; i++) {
      const price = prices.find((p) => p.symbol === alerts[i].symbol);

      if (price) {
        const currentPercent = price.bid + ' ' + price.open;
        console.log('found price ', currentPercent);

        // difference / OriginalNumber * 100.
      }
    }
  };

  // Run every X seconds
  useEffect(() => {
    const timerId = setTimeout(() => {
      getPrices(selectedSymbols).then(generateAlerts);
    }, TICK_TIME);
    return () => clearTimeout(timerId);
  });

  // Typically will run once on initialization
  useEffect(() => {
    const stored = sessionStorage.getItem('symbols');
    if (stored) {
      const storedArray = JSON.parse(stored);
      setSelectedSymbols(storedArray);
      getPrices(storedArray);
    }

    fetch(`${API_URL}/static/tickers`)
      .then((d) => d.json())
      .then((data: string[]) => {
        setSymbols(data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <StocksTableComponent items={symbolPrices} editAlert={handleEditAlert} />
      <StockSelectorComponent symbols={symbols} onAdd={handleAdd} />
      <AlertModalComponent
        isActive={isAlertModalOpen}
        symbolKey={alertModalSymbol}
        onClose={handleAlertClose}
        onDone={handleAlertDone}
      />
    </>
  );
};

export default Dashboard;
