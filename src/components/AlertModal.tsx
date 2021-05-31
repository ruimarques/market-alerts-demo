import { useState } from 'react';
import styles from './AlertModal.module.css';

export interface AlertConfig {
  symbol: string;
  percentage: number;
}

interface AlertModalProps {
  isActive: boolean;
  symbolKey: string;
  onDone: (c: AlertConfig) => void;
  onClose: () => void;
}

const DEFAULT_PERCENTAGE = 3;

const AlertModalComponent = (props: AlertModalProps) => {
  const [input, setInput] = useState(DEFAULT_PERCENTAGE);
  const [checked, setChecked] = useState(false);

  const handleOk = () => {
    if (checked) {
      props.onDone({
        symbol: props.symbolKey,
        percentage: input,
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setChecked(false);
    setInput(DEFAULT_PERCENTAGE);
    props.onClose();
  };

  return (
    <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Edit Alert</p>
          <button
            className="delete"
            aria-label="cancel"
            onClick={closeModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <label className={`checkbox ${styles.checkboxContainer}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
            />
            <span>
              Alert me when the stock price deviates from the opening price by:
            </span>
          </label>

          <div className={styles.percentage}>
            <input
              className="input"
              type="number"
              value={input}
              onInput={(e) => {
                setInput(+e.currentTarget.value);
              }}
            />
            <label>%</label>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-small is-info"
            aria-label="confirm"
            onClick={handleOk}
          >
            OK
          </button>
          <button
            className="button is-small"
            aria-label="cancel"
            onClick={closeModal}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AlertModalComponent;
