const read = require('fs').readFileSync;
const join = require('path').join;

function loadScript() {
  // import global script
  const script = read(join(__dirname, '..', 'dist', 'bundle.js')).toString('utf-8');
  eval(script);
}

describe("onInit", () => {
  // clean listeners
  afterEach(() => {
    messages.removeAllListeners();
  });

  it('can login if device and login have no tags', () => {
    loadScript();
    messages.emit('onLogin', 'asd', '');
  });

  it('shows error if device doesnt have login tag', () => {
    getSettings = () => ({
      errorString: 'custom error',
      tags: [{tag: 'foobar'}],
    });
    (env as any).project = {
      logins: [{key: 'asd', tags: ['foobar']}],
      usersManager: {
        users: [{$modelId: 'TEST', tags: []}]
      }
    };
    loadScript();

    expect(() => messages.emit('onLogin', 'asd', '')).toThrowError(new Error('custom error'));
  });

  it('permits login if both device and login have same locking tag', () => {
    getSettings = () => ({
      errorString: 'custom error',
      tags: [{tag: 'foobar'}],
    });
    (env as any).project = {
      logins: [{key: 'asd', tags: ['foobar']}],
      usersManager: {
        users: [{$modelId: 'TEST', tags: ['foobar']}]
      }
    };
    loadScript();

    expect(() => messages.emit('onLogin', 'asd', '')).not.toThrow();
  });
});