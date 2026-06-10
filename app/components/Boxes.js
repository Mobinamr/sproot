export default function Boxes() {
  return (
    <div className="boxes-container">
      <div className="column column-left">
        <div className="box grid-box">
          <div className="point-grid">
            {[...Array(12)].map((_, row) => (
              <div key={row} className="point-row">
                {[...Array(12)].map((_, col) => (
                  <div key={col} className="point"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="box"></div>
      </div>
      <div className="column column-right">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  )
}