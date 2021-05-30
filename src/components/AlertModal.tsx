import { useState } from 'react';

interface AlertModalProps {
  isActive: boolean;
  symbolKey: string;
  onDone: (s: string, p: number) => void;
  onClose: () => void;
}

const AlertModalComponent = (props: AlertModalProps) => {
  const [input, setInput] = useState(3);

  const handleOk = () => {
    props.onDone(props.symbolKey, input);
    props.onClose();
  };

  return (
    <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <label className="checkbox">
          <input type="checkbox" />
          Alert me when the stock price deviates from the opening price by:
        </label>
        <input
          className="input"
          type="number"
          value={input}
          onInput={(e) => {
            setInput(+e.currentTarget.value);
          }}
        />
      </div>
      <button
        className="modal-close is-small"
        aria-label="close"
        onClick={props.onClose}
      ></button>
      <button className="button is-small" aria-label="close" onClick={handleOk}>
        OK
      </button>
    </div>
  );
};

export default AlertModalComponent;
