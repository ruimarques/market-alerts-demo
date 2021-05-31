import { useEffect, useState } from 'react';
import moneyMath from 'money-math';
import StocksTableComponent, { StockTick } from '../components/StocksTable';
import StockSelectorComponent from '../components/StockSelector';
import AlertModalComponent, { AlertConfig } from '../components/AlertModal';
import { API_URL } from '../constants';
import { percentDifference } from '../utils';

const TICK_TIME = 5000;

interface StockTickResponse {
  symbol: string;
  bid: number;
  ask: number;
  open: number;
  lastVol: number;
}

const updateSymbolHasAlerts = (
  prices: StockTick[],
  symbol: string,
  status: boolean
) => {
  return prices.map((p) => {
    if (p.symbol === symbol) {
      p.hasAlerts = status;
    }
    return p;
  });
};

const Dashboard = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<StockTick[]>([]);

  // Alerts state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalSymbol, setAlertSymbol] = useState('');
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);

  // Converts price values to string amounts with 2 decimal places and adds hasAlerts property
  const decorateStockData = (data: StockTickResponse[]): StockTick[] => {
    return data.map((item) => {
      return {
        ...item,
        bid: moneyMath.floatToAmount(item.bid),
        ask: moneyMath.floatToAmount(item.ask),
        open: moneyMath.floatToAmount(item.open),
        hasAlerts: false,
      };
    });
  };

  const getPrices = (symbols: string[]) => {
    return fetch(`${API_URL}/prices/${symbols.join(',')}`)
      .then((d) => d.json())
      .then(decorateStockData)
      .then((data: StockTick[]) => {
        // console.log('decorated getPrices', data);
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

    getPrices(updated).catch((e) => {
      console.error('Failed to get symbols', e);
    });
  };

  const handleEditAlert = (symbol: string) => {
    setAlertSymbol(symbol);
    setIsAlertModalOpen(true);
  };

  const handleAlertDone = (newAlert: AlertConfig) => {
    console.log('handleAlertDone', newAlert.symbol, newAlert.percentage);

    setAlertConfigs([...alertConfigs, newAlert]);
    // FIXME Not a very efficient way to update a row alert status:
    setSymbolPrices(updateSymbolHasAlerts(symbolPrices, newAlert.symbol, true));
  };

  const handleAlertClear = (symbol: string) => {
    setAlertConfigs(alertConfigs.filter((a) => a.symbol !== symbol));
    // FIXME Not a very efficient way to update a row alert status:
    // IDEA: maybe instead of adding hasAlerts to prices data,
    // i keep it separate and send both objects to table: prices and alerts
    setSymbolPrices(updateSymbolHasAlerts(symbolPrices, symbol, false));
  };

  const handleAlertClose = () => {
    setIsAlertModalOpen(false);
    setAlertSymbol('');
  };

  const generateAlerts = (prices: StockTick[]) => {
    //TODO based on configured alerts, need to check prices and trigger alerts accordingly
    console.log('generateAlerts', alertConfigs);
    for (let i = 0; i < alertConfigs.length; i++) {
      const price = prices.find((p) => p.symbol === alertConfigs[i].symbol);

      if (price) {
        const difference = percentDifference(price.bid, price.open);

        console.log('difference', difference);
      }
    }
  };

  // Run every X seconds
  useEffect(() => {
    const timerId = setTimeout(() => {
      getPrices(selectedSymbols)
        .then(generateAlerts)
        .catch((e) => {
          console.error('Failed to get symbols', e);
        });
    }, TICK_TIME);
    return () => clearTimeout(timerId);
  });

  // Typically will run once on initialization
  useEffect(() => {
    const stored = sessionStorage.getItem('symbols');
    if (stored) {
      const storedArray = JSON.parse(stored);
      setSelectedSymbols(storedArray);
      getPrices(storedArray).catch((e) => {
        console.error('Failed to get symbols', e);
      });
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
      <StocksTableComponent
        items={symbolPrices}
        editAlert={handleEditAlert}
        clearAlert={handleAlertClear}
      />
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
