import { useState } from 'react';
import styles from './StockSelector.module.css';

interface StockSelectorProps {
  symbols: string[];
  onAdd: (s: string) => void;
}

const StockSelectorComponent = (props: StockSelectorProps) => {
  const [selection, setSelection] = useState(
    props.symbols.length > 0 ? props.symbols[0] : ''
  );

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelection(e.target.value);
  };

  const handleAdd = () => {
    props.onAdd(selection);
  };

  return (
    <>
      <div className="field">
        <label className="label" htmlFor="SelectSymbol">
          Add Symbol:
        </label>
        <div className="control">
          <div
            className={`select is-small ${styles.selectContainer}`}
            id="SelectSymbol"
          >
            <select value={selection} onChange={handleSelection}>
              {[...props.symbols.sort()].map((symbol, index) => (
                <option key={symbol + index} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
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
