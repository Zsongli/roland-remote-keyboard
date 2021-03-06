import * as io from 'socket.io-client';
// remove in browser

let socket: ReturnType<io.Manager['socket']>;
export const init = async (ip: string) => {

    const man = new io.Manager(ip);

    // create socket
    socket = man.socket('/io', {});

    socket.on('connect', () => {
        console.log('Connected!');
    });

    // connected to server
    return new Promise<void>((resolve, reject) => {
        socket.on('connect', resolve);
        socket.on("connect_error", reject);
    });
};

export const getSensorData = () => {
    socket.emit('tracksensor');
    return new Promise<[number, number, number, number]>(res =>
        socket.once('return-tracksensor', ({ data }) => res(data))
    );
};

export const move = ({ left = 0, right = 0 } = {}) => {
    if (left < -100 || left > 100 || right < -100 || right > 100)
        throw `Values should be between -100 and 100`;
    socket.emit('move', { left, right });
};

export const LED = ({ r = false, g = false, b = false } = {}) => {
    socket.emit('led', { r, g, b });
};

export const buzzer = (pw = 100) => {
    if (pw < 0 || pw > 100)
        throw 'PW values should be between 0 and 100';
    socket.emit('buzzer', { pw });
};

export const stop = () => void socket.emit('stop');

export const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export const servo = (absoluteDegree: number) => {
    if (absoluteDegree < -90 || absoluteDegree > 90)
        throw 'Values should be between -90 and 90';
    socket.emit('servo', { degree: absoluteDegree });
};

export const exit = (stops = false) => {
    if (stops)
        stop();

    socket.close();
};