import { AlertConfig } from './AlertModal';

export interface StockTick {
  symbol: string;
  bid: string;
  ask: string;
  open: string;
  lastVol: number;
}

interface StocksTableProps {
  items: StockTick[];
  alerts: AlertConfig[];
  editAlert: (s: string) => void;
  clearAlert: (s: string) => void;
}

const StocksTableComponent = (props: StocksTableProps) => {
  return (
    <table className="table is-bordered is-striped">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Bid</th>
          <th>Ask</th>
          <th>Vol</th>
          <th>Alerts</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map(({ symbol, bid, ask, lastVol }) => (
          <tr key={symbol}>
            <td>{symbol}</td>
            <td>{bid}</td>
            <td>{ask}</td>
            <td>{lastVol}</td>
            <td>
              <label className="checkbox">
                <input
                  type="checkbox"
                  disabled
                  checked={
                    props.alerts.findIndex((a) => a.symbol === symbol) !== -1
                  }
                />
              </label>
            </td>
            <td>
              <button
                className="button is-ghost is-small"
                onClick={() => props.editAlert(symbol)}
              >
                Alerts
              </button>
              <button
                className="button is-ghost is-small"
                onClick={() => props.clearAlert(symbol)}
              >
                Clear
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StocksTableComponent;
