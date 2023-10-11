import { validUUID } from './uuid';

describe('validUUID', () => {
  test('validate valid uuid', () => {
    expect(validUUID('6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b')).toStrictEqual(true);
    expect(validUUID('596547fb-f496-804e-933c-1fc948dd6ada')).toStrictEqual(true);
  });
  test('validate invalid uuid', () => {
    expect(validUUID('invalid-uuid')).toStrictEqual(false);
  });
});
