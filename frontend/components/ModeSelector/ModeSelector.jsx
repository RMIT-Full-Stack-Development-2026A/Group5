import { useGameStatus } from '../../config/context/GameStatusContext';

export default function ModeSelector({ selectedMode, boardSize, onSelectMode, onBoardSizeChange }) {
    const { gameStatus } = useGameStatus();

    return (
        <div className="col-lg-4 mt-5">
            <div className="d-flex justify-content-between gap-3 mb-4 pe-5 mt-5">
                <button className={`rounded-pill btn px-4 py-2 w-25 ${boardSize === 10 ? 'active' : ''}`} onClick={() => onBoardSizeChange(10)} disabled={gameStatus === 'ongoing'}>
                    10x10
                </button>
                <button className={`rounded-pill btn px-4 py-2 w-25 ${boardSize === 15 ? 'active' : ''}`} onClick={() => onBoardSizeChange(15)} disabled={gameStatus === 'ongoing'}>
                    15x15
                </button>
            </div>
            <div className="mode-selector me-5 d-flex flex-column align-items-center rounded-4 pb-5 ">
                <h2 className="mt-4 fw-bold fs-3">Select Game Mode</h2>
                <p className="mb-2 mt-4 fw-semibold fs-4 w-100 text-start ps-4">Single Player</p>
                <div className="d-flex flex-column gap-3 mb-3 w-100 px-4">
                    <button className={`rounded-pill btn px-4 py-2 ${selectedMode === 'easy' ? 'active' : ''}`} onClick={() => onSelectMode('easy')} disabled={gameStatus === 'ongoing'}>
                        Easy
                    </button>
                    <button className={`rounded-pill btn px-4 py-2 ${selectedMode === 'medium' ? 'active' : ''}`} onClick={() => onSelectMode('medium')} disabled={gameStatus === 'ongoing'}>
                        Medium
                    </button>
                    <button className={`rounded-pill btn px-4 py-2 ${selectedMode === 'hard' ? 'active' : ''}`} onClick={() => onSelectMode('hard')} disabled={gameStatus === 'ongoing'}>
                        Hard
                    </button>
                </div>
                <p className="mb-2 mt-4 fw-semibold fs-4 w-100 text-start ps-4">Multiplayer</p>
                <div className="d-flex flex-column gap-3 w-100 px-4">
                    <button className={`rounded-pill btn px-4 py-2 ${selectedMode === 'local' ? 'active' : ''}`} onClick={() => onSelectMode('local')} disabled={gameStatus === 'ongoing'}>
                        Local
                    </button>
                    <button className={`rounded-pill btn px-4 py-2 ${selectedMode === 'online' ? 'active' : ''}`} onClick={() => onSelectMode('online')} disabled={gameStatus === 'ongoing'}>
                        Online
                    </button>
                </div>
            </div>
        </div>
    )
}
