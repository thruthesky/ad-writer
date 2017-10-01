export let protocolName;

export function set(pid) {
    protocolName = pid;
}

export function send(code, msg = '') {
    console.log(`${protocolName}=${code}: ${msg}`);
}

export function end(code) {
    console.log(`${protocolName}=${code}`);
    process.exit(0);
}
