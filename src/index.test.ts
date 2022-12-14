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

    env.setData('RETURN_VALUE', undefined);
    messages.emit('onLogin', 'asd', '');
    expect(env.data.RETURN_VALUE).toStrictEqual({
      error: 'custom error',
    });
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

    env.setData('RETURN_VALUE', undefined);
    messages.emit('onLogin', 'asd', '');
    expect(env.data.RETURN_VALUE).toBeUndefined();
  });

  it('denies login if both device and login have locking tag but different', () => {
    getSettings = () => ({
      errorString: 'custom error',
      tags: [{tag: 'foobar'}, {tag: 'barfoo'}],
    });
    (env as any).project = {
      logins: [{key: 'asd', tags: ['foobar']}],
      usersManager: {
        users: [{$modelId: 'TEST', tags: ['barfoo']}]
      }
    };
    loadScript();

    env.setData('RETURN_VALUE', undefined);
    messages.emit('onLogin', 'asd', '');
    expect(env.data.RETURN_VALUE).toStrictEqual({
      error: 'custom error',
    });
  });
});