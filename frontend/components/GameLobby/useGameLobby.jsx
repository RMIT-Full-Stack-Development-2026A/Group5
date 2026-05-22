import { useEffect, useMemo, useState } from 'react';
import { useGameStatus } from '../../config/context/GameStatusContext';
import { socketService } from '../../services/socketService';

const normalizeRoomCode = (value) =>
	String(value || '').trim().toUpperCase();

export function useGameLobby({ selectedMode = 'local', onStart }) {
	const { setGameStatus } = useGameStatus();
	const [roomCodeInput, setRoomCodeInput] = useState('');
	const [activeRoomCode, setActiveRoomCode] = useState('');
	const [onlineError, setOnlineError] = useState('');

	const isOnline = selectedMode === 'online';

	useEffect(() => {
		if (!isOnline) {
			setRoomCodeInput('');
			setActiveRoomCode('');
			setOnlineError('');
			return;
		}

		const token = localStorage.getItem('authToken');
		socketService.connect(token);

		const onConnect = () => {
			setOnlineError('');
		};

		const onDisconnect = () => {
            setOnlineError('Disconnected from server. Please check your connection.');
        };

		const onRoomCreated = (payload = {}) => {
			const code = normalizeRoomCode(payload.roomCode);
			if (code) {
				setActiveRoomCode(code);
				setRoomCodeInput(code);
			}
			setOnlineError('');
		};

		const onRoomJoined = (payload = {}) => {
			const code = normalizeRoomCode(payload.roomCode || roomCodeInput);
			setActiveRoomCode(code);
			setOnlineError('');
		};

		const onRoomError = (payload = {}) => {
			setOnlineError(payload.message || 'Room action failed.');
		};

		socketService.on('connect', onConnect);
		socketService.on('disconnect', onDisconnect);
		socketService.on('roomCreated', onRoomCreated);
		socketService.on('roomJoined', onRoomJoined);
		socketService.on('roomError', onRoomError);

		return () => {
			socketService.off('connect', onConnect);
			socketService.off('disconnect', onDisconnect);
			socketService.off('roomCreated', onRoomCreated);
			socketService.off('roomJoined', onRoomJoined);
			socketService.off('roomError', onRoomError);
			socketService.disconnect();
		};
	}, [isOnline]);

	const canStartOnline = useMemo(
		() => Boolean(activeRoomCode),
		[activeRoomCode]
	);

	const createRoom = () => {
		setOnlineError('');
		socketService
			.emitWithAck('createRoom', {})
			.then((response = {}) => {
				if (!response.ok) {
					setOnlineError(response.message || 'Room action failed.');
					return;
				}
				const code = normalizeRoomCode(response.roomCode);
				setActiveRoomCode(code);
				setRoomCodeInput(code);
			})
			.catch(() => {
				setOnlineError('Failed to create room.');
			});
	};

	const joinRoom = () => {
		const code = normalizeRoomCode(roomCodeInput);
		if (!code) {
			setOnlineError('Please enter a room code.');
			return;
		}

		setOnlineError('');
		socketService
			.emitWithAck('joinRoom', { roomCode: code })
			.then((response = {}) => {
				if (!response.ok) {
					setOnlineError(response.message || 'Room action failed.');
					setActiveRoomCode('');
					return;
				}
				setActiveRoomCode(normalizeRoomCode(response.roomCode || code));
			})
			.catch(() => {
				setOnlineError('Failed to join room.');
				setActiveRoomCode('');
			});
	};

	const handleStart = async () => {
		if (isOnline && !canStartOnline) {
			setOnlineError('Create or join a room before starting.');
			return;
		}

		if (onStart) {
			await onStart();
		}
		setGameStatus('ongoing');
	};

	return {
		handleStart,
		roomCodeInput,
		setRoomCodeInput,
		activeRoomCode,
		onlineError,
		canStartOnline,
		createRoom,
		joinRoom,
	};
}
