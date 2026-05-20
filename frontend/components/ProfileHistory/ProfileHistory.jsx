export default function ProfileHistory() {
    return (
        <div className="col-lg-9">
            <div className="card border border-dark rounded-3">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="fw-bold">Match ID - 000001</h3>
                        <p className="text-muted">10.10.2026 00:00</p>
                    </div>

                    <div className="ps-4">
                        <p className="mb-1">Game Mode: Single</p>
                        <p className="mb-1">10 x 10</p>
                        <p className="mb-1">Opponent: MeowMeow</p>
                        <p className="mb-0">Status: Won</p>
                    </div>
                </div>
                <div className="card-footer">
                    <button className="btn">View Details</button>
                </div>
            </div>
        </div>
    );
}