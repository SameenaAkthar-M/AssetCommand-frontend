const MetricsCard = ({ title, value, onClick }) => {
  return (
    <div className="metrics-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default MetricsCard;
