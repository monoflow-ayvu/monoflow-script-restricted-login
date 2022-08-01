import * as MonoUtils from "@fermuch/monoutils";
import { myID } from "@fermuch/monoutils";

// based on settingsSchema @ package.json
type Config = Record<string, unknown> & {
  errorString: string;
  tags: {
    tag: string;
  }[];
}
const conf = new MonoUtils.config.Config<Config>();

messages.on('onLogin', (key) => {
  const deviceId = myID();
  const device = env?.project?.usersManager?.users?.find((u) => u.$modelId === deviceId);
  const deviceTags = device?.tags || [];
  const loginTags = env?.project?.logins?.find((l) => l.$modelId === key || l.key === key)?.tags || [];

  const loginTagsRestricted = conf.get('tags', []).filter((t) => loginTags.includes(t.tag));
  // no tag is restricted
  if (loginTagsRestricted.length === 0) {
    return;
  }

  const isDeviceEnabled = loginTagsRestricted.some((t) => deviceTags.includes(t.tag));
  if (isDeviceEnabled) {
    return;
  }

  const errMsg = conf.get('errorString', 'O dispositivo não está autorizado para esse login.');
  throw new Error(errMsg);
});