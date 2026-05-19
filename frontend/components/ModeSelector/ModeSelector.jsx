import './modeSelector.css';
import { useState } from 'react';
export default function ModeSelector({ onSelectMode, onBoardSizeChange }) {

    return (
        <div className="col-lg-4 mt-5">
            <div className="d-flex justify-content-between gap-3 mb-4 pe-5 mt-5">
                <button className="rounded-pill  px-4 py-2 w-25" onClick={() => onBoardSizeChange(10)}>10x10</button>
                <button className="rounded-pill  px-4 py-2 w-25" onClick={() => onBoardSizeChange(15)}>15x15</button>
            </div>
            <div className="mode-selector me-5 d-flex flex-column align-items-center rounded-4 pb-5 ">
                <h2 className="mt-4 fw-bold fs-3">Select Game Mode</h2>
                <p className="mb-2 mt-4 fw-semibold fs-4 w-100 text-start ps-4">Single Player</p>
                <div className="d-flex flex-column gap-3 mb-3 w-100 px-4">
                    <button className="rounded-pill  px-4 py-2" onClick={() => onSelectMode('easy')}>
                        Easy
                    </button>
                    <button className="rounded-pill  px-4 py-2" onClick={() => onSelectMode('medium')}>
                        Medium
                    </button>
                    <button className="rounded-pill  px-4 py-2" onClick={() => onSelectMode('hard')}>
                        Hard
                    </button>
                </div>
                <p className="mb-2 mt-4 fw-semibold fs-4 w-100 text-start ps-4">Multiplayer</p>
                <div className="d-flex flex-column gap-3 w-100 px-4">
                    <button className="rounded-pill  px-4 py-2" onClick={() => onSelectMode('local')}>
                        Local
                    </button>
                    <button className="rounded-pill  px-4 py-2" onClick={() => onSelectMode('online')}>
                        Online
                    </button>
                </div>
            </div>
        </div>
    )
}
