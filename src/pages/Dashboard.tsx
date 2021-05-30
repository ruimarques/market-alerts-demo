import StocksTableComponent, { StockTick } from '../components/StocksTable';
import StockSelectorComponent from '../components/StockSelector';
import AlertModalComponent from '../components/AlertModal';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants';

const Dashboard = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<StockTick[]>([]);

  // Alerts state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState('');

  const getPrices = (symbols: string[]) => {
    fetch(`${API_URL}/prices/${symbols.join(',')}`)
      .then((d) => d.json())
      .then((d) => {
        console.log('getPrices ', d);
        setSymbolPrices(d);
      });
  };

  const handleAdd = (item: string) => {
    selectedSymbols.includes(item);
    const updated = selectedSymbols.includes(item)
      ? selectedSymbols
      : [...selectedSymbols, item];

    setSelectedSymbols(updated);
    sessionStorage.setItem('symbols', JSON.stringify(updated));

    console.log('add', item);

    getPrices(updated);
  };

  const handleEditAlert = (symbol: string) => {
    setAlertSymbol(symbol);
    setIsAlertOpen(true);
  };

  const handleAlertDone = (symbol: string, percent: number) => {
    console.log('handleAlertDone', symbol, percent);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
    setAlertSymbol('');
  };

  useEffect(() => {
    console.log('init');

    const stored = sessionStorage.getItem('symbols');
    console.log('stored ', stored);
    if (stored) {
      const storedArray = JSON.parse(stored);
      setSelectedSymbols(storedArray);
      getPrices(storedArray);
    }

    fetch(`${API_URL}/static/tickers`)
      .then((d) => d.json())
      .then((d) => {
        // console.log(d);
        setSymbols(d);
      });
  }, []);

  return (
    <>
      <StocksTableComponent items={symbolPrices} editAlert={handleEditAlert} />
      <StockSelectorComponent symbols={symbols} onAdd={handleAdd} />
      <AlertModalComponent
        isActive={isAlertOpen}
        symbolKey={alertSymbol}
        onClose={handleAlertClose}
        onDone={handleAlertDone}
      />
    </>
  );
};

export default Dashboard;
