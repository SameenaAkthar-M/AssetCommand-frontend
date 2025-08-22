import "./basecommanderstyle.css";

const AssetTable = ({ type, assets, onAssign, onExpend, onEdit, onDelete }) => {
  const filteredAssets = assets.filter(
    (a) => a.type.toLowerCase() === type.toLowerCase()
  );

  if (filteredAssets.length === 0) return null;

  return (
    <div className="basecommander-section">
      <h2>{type} Assets</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Opening Balance</th>
            <th>Closing Balance</th>
            <th>Current Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr key={asset._id}>
              <td>{asset.name}</td>
              <td>{asset.openingBalance}</td>
              <td>{asset.closingBalance}</td>
              <td>{asset.closingBalance}</td>
              <td className="asset-btn">
                <button className="assign" onClick={() => onAssign(asset)}>
                  Assign
                </button>
                <button className="expend" onClick={() => onExpend(asset)}>
                  Expend
                </button>
                <button className="edit" onClick={() => onEdit(asset)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => onDelete(asset._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
