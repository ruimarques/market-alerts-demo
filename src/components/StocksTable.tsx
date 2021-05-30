export interface StockTick {
  symbol: string;
  bid: string;
  ask: string;
  lastVol: string;
}

interface StocksTableProps {
  items: StockTick[];
  editAlert: (s: string) => void;
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
                <input type="checkbox" disabled />
              </label>
            </td>
            <td>
              <button
                className="button is-ghost is-small"
                onClick={() => props.editAlert(symbol)}
              >
                Alerts
              </button>
              <button className="button is-ghost is-small">Clear</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StocksTableComponent;
