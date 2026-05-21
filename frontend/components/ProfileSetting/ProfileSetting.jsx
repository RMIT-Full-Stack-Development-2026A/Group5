import { useGameBoard } from '../../config/context/GameBoardContext';

export default function ProfileSetting() {
    const { gameBoard, setGameBoard } = useGameBoard();

    return (
        <div className="col-lg-9 border border-dark rounded-3 p-4 card">
            <h2 className="card-title text-center">Board Settings</h2>
            <div className="card-body d-flex flex-column gap-3">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="d-flex flex-column justify-content-between align-items-center mb-3">
                            <img src="/frontend/public/classic.png" alt="Classic Board" className="img-fluid" />
                            <h2 className="h4">Classic</h2>
                            <button
                                className={`btn ${gameBoard === 'classic' ? 'active' : ''}`}
                                onClick={() => setGameBoard('classic')}
                                aria-pressed={gameBoard === 'classic'}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="d-flex flex-column justify-content-between align-items-center mb-3">
                            <img src="/frontend/public/arcane.png" alt="Arcane Board" className="img-fluid" />
                            <h2 className="h4">Arcane</h2>
                            <button
                                className={`btn ${gameBoard === 'arcane' ? 'active' : ''}`}
                                onClick={() => setGameBoard('arcane')}
                                aria-pressed={gameBoard === 'arcane'}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="d-flex flex-column justify-content-between align-items-center mb-3">
                            <img src="/frontend/public/celestial.png" alt="Celestial Board" className="img-fluid" />
                            <h2 className="h4">Celestial</h2>
                            <button
                                className={`btn ${gameBoard === 'celestial' ? 'active' : ''}`}
                                onClick={() => setGameBoard('celestial')}
                                aria-pressed={gameBoard === 'celestial'}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-3">
                </div>
            </div>
        </div>
    );
}