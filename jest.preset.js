const path = require('path');
const nxPreset = require('@nrwl/jest/preset').default;

module.exports = { ...nxPreset, setupFiles: [path.join(__dirname, `jest.shim.js`)] };
