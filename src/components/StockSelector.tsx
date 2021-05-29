import { useState } from 'react';

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
      <select value={selection} onChange={handleSelection}>
        {['', ...props.symbols.sort()].map((symbol, index) => (
          <option key={symbol + index} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
      <button type="submit" onClick={handleAdd} disabled={!selection}>
        Add
      </button>
    </>
  );
};

export default StockSelectorComponent;
