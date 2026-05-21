export default function ProfileTab({ activeTab, setActiveTab }) {
    return (
        <div className="col-lg-3">
            <div className="d-flex flex-column gap-3">
                <button
                    className={`btn btn-lg w-100 rounded-pill ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Profile Info
                </button>
                <button
                    className={`btn btn-lg w-100 rounded-pill ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
                <button
                    className={`btn btn-lg w-100 rounded-pill ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>
        </div>
    );
}
