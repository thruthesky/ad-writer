export let protocolName;

export function set(name, category) {
    protocolName = name + '/' + category;
}

export function send(code, msg = '') {
    console.log(`${protocolName}=${code}: ${msg}`);
}

export function end(code, msg = '') {
    console.log(`${protocolName}=${code}: ${msg}`);
    process.exit(0);
}
