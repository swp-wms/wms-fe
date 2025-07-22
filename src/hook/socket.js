import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const baseUrl = "http://localhost:3800";

export const useSocket = (roleid, userid) => {
    const socketRef = useRef(null);
    const [isConnect, setIsConnect] = useState(false);

    useEffect(() => {
        //avoid multiple initialization of socket
        if (socketRef.current) {
            return;
        }

        const socket = io(baseUrl, {
            withCredentials: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000, //delay between reconnection attempts 
            auth: { roleid: roleid, userid: userid }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('socket connected: ' + socket.id);
            setIsConnect(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnect: ', reason);
            setIsConnect(false);

            if (reason == 'io server disconnect') {
                socket.connect();
            }
        })

        socket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err.message);
            setIsConnect(false);
        });

        return () => {
            if (socketRef.current) {
                console.log('Disconnecting socket on useSocket hook unmount...');
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, []); //run only once on mount

    const emit = useCallback((eventName, data) => {
        if (socketRef.current && isConnect) {
            socketRef.current.emit(eventName, data);
        } else {
            console.warn(`Socket not connected or null, cannot emit "${eventName} "`, data)
        }
    }, [isConnect]);

    const on = useCallback((eventName, handler) => {
        if (socketRef.current) {
            socketRef.current.on(eventName, handler);
        } else {
            console.warn(`Socket not initialized, cannot listen for "${eventName}"`);
        }
    }, []); // No dependencies needed for `on`, as it just registers a listener on the current ref

    const off = useCallback((eventName, handler) => {
        if (socketRef.current) {
            socketRef.current.off(eventName, handler);
        } else {
            console.warn(`Socket not initialized, cannot remove listener for "${eventName}"`);
        }
    }, []); // No dependencies needed for `off`

    return {
        socket: socketRef.current, // The raw socket instance (use sparingly, prefer emit/on/off)
        emit,
        on,
        off,
        isConnect
    };
}