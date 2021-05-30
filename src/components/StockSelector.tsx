import { useState } from 'react';
import styles from './StockSelector.module.css';

interface StockSelectorProps {
  symbols: string[];
  onAdd: (s: string) => void;
}

const StockSelectorComponent = (props: StockSelectorProps) => {
  const [selection, setSelection] = useState('');

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  const handleAdd = () => {
    props.onAdd(selection);
  };

  return (
    <>
      <div className={`select is-small ${styles.selectContainer}`}>
        <select value={selection} onChange={handleSelection}>
          {['', ...props.symbols.sort()].map((symbol, index) => (
            <option key={symbol + index} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAdd}
        disabled={!selection}
        className="button is-small is-link is-outlined"
      >
        Add
      </button>
    </>
  );
};

export default StockSelectorComponent;
