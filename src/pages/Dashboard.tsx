import StocksTableComponent, { StockTick } from '../components/StocksTable';
import StockSelector from '../components/StockSelector';
import { useEffect, useState } from 'react';
import { API_URL } from '../constants';

const Dashboard = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<StockTick[]>([]);

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

    console.log('add', item);

    getPrices(updated);
  };

  useEffect(() => {
    fetch(`${API_URL}/static/tickers`)
      .then((d) => d.json())
      .then((d) => {
        // console.log(d);
        setSymbols(d);
      });
  }, []);

  return (
    <>
      <StocksTableComponent items={symbolPrices} />
      <StockSelector symbols={symbols} onAdd={handleAdd} />
    </>
  );
};

export default Dashboard;
