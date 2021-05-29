import { useLocation } from 'react-router-dom';

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const getBaseUrl = () => {
  const port = window.location.port ? ':' + window.location.port : '';
  return `${window.location.protocol}//${window.location.hostname}${port}`;
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  // undefined locale means the default one is used
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    // narrowSymbol to show, for example, '$100' instead of 'US$100'
    currencyDisplay: 'narrowSymbol',
    currency,
  });

  return formatter.format(amount);
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
