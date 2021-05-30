interface BidAlerts {
  symbol: string;
  move: string;
  time: string;
}

const AlertsPage = () => {
  return (
    <>
      <article className="message">
        <div className="message-header">
          <p>Hello World</p>
          <button className="delete" aria-label="delete"></button>
        </div>
        <div className="message-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. sem.
        </div>
      </article>
    </>
  );
};

export default AlertsPage;
