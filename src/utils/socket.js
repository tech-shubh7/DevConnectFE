import io from 'socket.io-client';
import { BASE_URL } from './constants';

export const createSocketConnection = (userId) => {
    return io(BASE_URL);
}