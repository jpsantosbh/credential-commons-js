const UCA = require('../../src/uca/UserCollectableAttribute');
const VC = require('../../src/creds/VerifiableCredential');

jest.mock('../../src/creds/definitions');
jest.setTimeout(100000);

describe('VerifiableCredential', () => {
  test('Dont construct undefined Credentials', () => {
    function createCredential() {
      const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
      const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
      return new VC('civ:cred:Test', 'jest:test', [name, dob], '1');
    }
    expect(createCredential).toThrowError('civ:cred:Test is not defined');
  });
  test('Dont construct Credentials with wrong version', () => {
    function createCredential() {
      const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
      const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
      return new VC('civ:Credential:SimpleTest', 'jest:test', [name, dob], '2');
    }
    expect(createCredential).toThrowError('Credential definition for civ:Credential:SimpleTest v2 not found');
  });
  test('New Defined Credentials', () => {
    const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
    const cred = new VC('civ:Credential:SimpleTest', 'jest:test', [name, dob], 1);
    expect(cred).toBeDefined();
    expect(cred.claims.identity.name.first).toBe('Joao');
    expect(cred.claims.identity.name.middle).toBe('Barbosa');
    expect(cred.claims.identity.name.last).toBe('Santos');
    expect(cred.claims.identity.DateOfBirth.day).toBe(20);
    expect(cred.claims.identity.DateOfBirth.month).toBe(3);
    expect(cred.claims.identity.DateOfBirth.year).toBe(1978);
    expect(cred.signature.leaves).toHaveLength(5);
  });
  test('New Defined Credentials', () => {
    const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
    const cred = new VC('civ:Credential:TestWithExcludes', 'jest:test', [name, dob], 1);
    expect(cred).toBeDefined();
    expect(cred.claims.identity.name.first).toBe('Joao');
    expect(cred.claims.identity.name.middle).toBeUndefined();
    expect(cred.claims.identity.name.last).toBe('Santos');
    expect(cred.claims.identity.DateOfBirth.day).toBe(20);
    expect(cred.claims.identity.DateOfBirth.month).toBe(3);
    expect(cred.claims.identity.DateOfBirth.year).toBe(1978);
    expect(cred.signature.leaves).toHaveLength(4);
  });
  
  test('New Defined Credentials return the correct global Credential Identifier', () => {
    const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
    const cred = new VC('civ:Credential:TestWithExcludes', 'jest:test', [name, dob], 1);
    expect(cred.getGlobalCredentialItemIdentifier()).toBe('credential-civ:Credential:TestWithExcludes-1');
  });

  // TODO Reenable when BitGo Issue is resolved
  test.skip('Request anchor for Credential', () => {
    expect.assertions(2);
    const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
    const cred = new VC('civ:Credential:SimpleTest', 'jest:test', [name, dob], 1);
    return cred.requestAnchor().then((updated) => {
      expect(updated.signature.anchor).toBeDefined();
      expect(updated.signature.anchor.schema).toBe('tbch-20180201');
    });
  });
  test.skip('Refresh anchor for Credential', () => {
    expect.assertions(2);
    const name = new UCA.IdentityName({ first: 'Joao', middle: 'Barbosa', last: 'Santos' });
    const dob = new UCA.IdentityDateOfBirth({ day: 20, month: 3, year: 1978 });
    const cred = new VC('civ:Credential:SimpleTest', 'jest:test', [name, dob], 1);
    return cred.requestAnchor().then((updated) => {
      console.log(`#####${JSON.stringify(updated, null, 2)}`);
      expect(updated.signature.anchor).toBeDefined();
      return updated.updateAnchor().then((newUpdated) => {
        expect(newUpdated.signature.anchor).toBeDefined();
      });
    });
  });
});
