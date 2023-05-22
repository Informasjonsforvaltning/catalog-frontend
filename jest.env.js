import JsdomEnvironment from 'jest-environment-jsdom';
import { TextEncoder, TextDecoder } from 'util';

// A custom environment to set the TextEncoder that is required by mongodb.
module.exports = class CustomTestEnvironment extends JsdomEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
