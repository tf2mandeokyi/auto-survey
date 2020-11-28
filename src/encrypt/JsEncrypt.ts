global.navigator = {appName: 'nodejs'} as any; // fake the navigator object
global.window = {} as any; // fake the window object

const encrypt = require('jsencrypt').default;

export const JsEncrypt = encrypt;