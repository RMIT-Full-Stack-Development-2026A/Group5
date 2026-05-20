export default function ProfileTab({ activeTab, setActiveTab }) {
    return (
        <div className="col-lg-3">
            <div className="d-flex flex-column gap-3">
                <button
                    className={`btn btn-lg w-100 rounded-pill`}
                    onClick={() => setActiveTab('info')}
                    active={activeTab === 'info'}
                >
                    Profile Info
                </button>
                <button
                    className={`btn btn-lg w-100 rounded-pill`}
                    onClick={() => setActiveTab('history')}
                    active={activeTab === 'history'}
                >
                    History
                </button>
                <button
                    className={`btn btn-lg w-100 rounded-pill `}
                    onClick={() => setActiveTab('settings')}
                    active={activeTab === 'settings'}
                >
                    Settings
                </button>
            </div>
        </div>
    );
}