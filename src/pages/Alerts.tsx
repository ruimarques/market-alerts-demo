import { useEffect, useState } from 'react';

export interface BidAlerts {
  symbol: string;
  move: number;
  time: number;
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<BidAlerts[]>([]);

  const handleDelete = (alert: BidAlerts) => {
    const updatedAlerts = alerts.filter(
      (a) => a.symbol !== alert.symbol || a.time !== alert.time
    );
    setAlerts(updatedAlerts);
  };

  useEffect(() => {
    const storedAlerts = sessionStorage.getItem('alerts');
    const alerts: BidAlerts[] = storedAlerts ? JSON.parse(storedAlerts) : [];

    setAlerts(alerts);
  }, []);

  return (
    <>
      {alerts.map((alert, index) => (
        <article className="message" key={index}>
          <div className="message-header">
            <p>{`${alert.symbol} @ ${new Date(
              alert.time
            ).toLocaleTimeString()}`}</p>
            <button
              className="delete"
              aria-label="delete"
              onClick={() => handleDelete(alert)}
            ></button>
          </div>
          <div className="message-body">
            <span>{`${alert.symbol}'s BID price moved `}</span>
            <span style={{ color: 'red' }}>{alert.move + '%'}</span>
            <span>{` from the opening price at ${new Date(
              alert.time
            ).toTimeString()}.`}</span>
          </div>
        </article>
      ))}
    </>
  );
};

export default AlertsPage;
