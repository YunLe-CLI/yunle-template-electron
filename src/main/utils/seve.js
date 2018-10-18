import fs from 'fs';
import path, { join } from 'path';
import url from 'url';
import util from 'util';
import electron from 'electron';

const stat = util.promisify(fs.stat);

const getPath = async (pth) => {
  try {
    const result = await stat(pth);

    if (result.isFile()) {
      return pth;
    }

    if (result.isDirectory()) {
      return getPath(path.join(pth, 'index.html'));
    }
  } catch (err) {}
};

export function createSeve(options) {
  options = {
    scheme: 'app',
      ...options,
  };

  // TODO: Make directory relative to app root. Document it.
  if (!options.protocol) {
    throw new Error('The `protocol` option is required');
  }

  const handler = async (request, callback) => {
    const protocol = global.__PROTOCOL_PATH__ || {};
	  const u = new url.URL(request.url);
    // 'app'
    if (u.hostname === 'localhost') {
      const directory = path.resolve(join($dirname, '..', 'renderer'));
      const indexPath = path.join(directory, 'index.html');
      const filePath = path.join(directory, u.pathname);
      callback({
        path: (await getPath(filePath)) || indexPath,
      });
    }
  };

  electron.protocol.registerStandardSchemes([options.scheme], { secure: true });

  electron.app.on('ready', () => {
    const session = options.partition
      ? electron.session.fromPartition(options.partition)
      : electron.session.defaultSession;
    session.protocol.registerFileProtocol(options.scheme, handler, (error) => {
	    console.log(error)
	    if (error) {
        throw error;
      }
    });
  });

  return (win) => {
    win.loadURL(`${options.scheme}://-`);
  };
};

