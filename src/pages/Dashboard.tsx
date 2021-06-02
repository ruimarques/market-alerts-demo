import { useEffect, useState } from 'react';
import moneyMath from 'money-math';
import StocksTableComponent, { StockTick } from '../components/StocksTable';
import StockSelectorComponent from '../components/StockSelector';
import AlertModalComponent, { AlertConfig } from '../components/AlertModal';
import { API_URL, TICK_TIME } from '../constants';
import { percentDifference } from '../utils';
import { BidAlerts } from './Alerts';

interface StockTickResponse {
  symbol: string;
  bid: number;
  ask: number;
  open: number;
  lastVol: number;
}

const Dashboard = () => {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<StockTick[]>([]);

  // Alerts-related state
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalSymbol, setAlertModalSymbol] = useState('');
  const [alertConfigs, setAlertConfigs] = useState<AlertConfig[]>([]);
  const [alerts, setAlerts] = useState<BidAlerts[]>([]);

  // Converts price values to string amounts with 2 decimal places and adds hasAlerts property
  const decorateStockData = (data: StockTickResponse[]): StockTick[] => {
    return data.map((item) => {
      return {
        ...item,
        bid: moneyMath.floatToAmount(item.bid),
        ask: moneyMath.floatToAmount(item.ask),
        open: moneyMath.floatToAmount(item.open),
      };
    });
  };

  const getPrices = (symbols: string[]) => {
    return fetch(`${API_URL}/prices/${symbols.join(',')}`)
      .then((d) => d.json())
      .then(decorateStockData)
      .then((data: StockTick[]) => {
        setSymbolPrices(data);
        return data;
      });
  };

  const handleAddSymbol = (symbol: string) => {
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
    setAlertModalSymbol(symbol);
    setIsAlertModalOpen(true);
  };

  const updateAlertConfigs = (config: AlertConfig[]) => {
    setAlertConfigs(config);
    sessionStorage.setItem('alertConfigs', JSON.stringify(config));
  };

  const handleAlertDone = (newAlert: AlertConfig) => {
    const updatedConfig = [...alertConfigs, newAlert];

    updateAlertConfigs(updatedConfig);
  };

  const handleAlertClear = (symbol: string) => {
    const updatedConfig = alertConfigs.filter((a) => a.symbol !== symbol);

    updateAlertConfigs(updatedConfig);
  };

  const handleAlertClose = () => {
    setIsAlertModalOpen(false);
    setAlertModalSymbol('');
  };

  const addNewAlert = (price: StockTick, priceMove: number) => {
    const updatedAlerts: BidAlerts[] = [
      ...alerts,
      {
        symbol: price.symbol,
        move: priceMove,
        time: Date.now(),
      },
    ];

    setAlerts(updatedAlerts);
    sessionStorage.setItem('alerts', JSON.stringify(updatedAlerts));
  };

  // Based on configured alerts, check prices,
  // calculate move percentages and trigger alerts accordingly
  const generateAlerts = (alertConfigs: AlertConfig[], prices: StockTick[]) => {
    console.log('generateAlerts', alertConfigs);
    for (let i = 0; i < alertConfigs.length; i++) {
      const currentConfig = alertConfigs[i];
      const price = prices.find((p) => p.symbol === currentConfig.symbol);

      if (price) {
        const difference = percentDifference(price.bid, price.open);
        const differenceAbsolute = Math.abs(difference);

        // FIXME accuracy of these calculations
        console.log('difference', difference);
        // We will check for absolute difference,
        // meaning if a stock moved, for example, either 3% or -3%
        if (differenceAbsolute > currentConfig.percentage) {
          addNewAlert(price, difference);
        }
      }
    }
  };

  // Run every X seconds, to get updated prices
  useEffect(() => {
    if (selectedSymbols.length === 0) {
      return;
    }
    const timerId = setTimeout(() => {
      getPrices(selectedSymbols)
        .then((prices) => generateAlerts(alertConfigs, prices))
        .catch((e) => {
          console.error('Failed to get symbols', e);
        });
    }, TICK_TIME);
    return () => clearTimeout(timerId);
  });

  // Typically will run once on initialization
  useEffect(() => {
    const storedSymbols = sessionStorage.getItem('symbols');
    if (storedSymbols) {
      const parsedSymbols = JSON.parse(storedSymbols);

      setSelectedSymbols(parsedSymbols);
      getPrices(parsedSymbols).catch((e) => {
        console.error('Failed to get symbols', e);
      });
    }

    const storedAlertConfigs = sessionStorage.getItem('alertConfigs');
    if (storedAlertConfigs) {
      const parsedConfigs = JSON.parse(storedAlertConfigs);

      setAlertConfigs(parsedConfigs);
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
        alerts={alertConfigs}
        editAlert={handleEditAlert}
        clearAlert={handleAlertClear}
      />
      <StockSelectorComponent symbols={symbols} onAdd={handleAddSymbol} />
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
