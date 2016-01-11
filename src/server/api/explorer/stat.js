import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import handleError from './handleError';

const lstatAsync = Promise.promisify(fs.lstat);
const readlinkAsync = Promise.promisify(fs.readlink);

const normalize = (p) => path.resolve('/', p);

const getStats = async (stats, statPath) => {
  const stat = await lstatAsync(statPath);
  stat.atime = stat.atime.getTime();
  stat.mtime = stat.mtime.getTime();
  stat.ctime = stat.ctime.getTime();
  stat.birthtime = stat.birthtime.getTime();
  stats[statPath] = stat;

  if (!stat.isSymbolicLink())
    return statPath;

  const link = await readlinkAsync(statPath);
  const resolvedPath = normalize(path.resolve(path.dirname(statPath), link));
  stat.link = {
    link,
    path: resolvedPath
  };

  // recursively-broken symlink
  if (stats[resolvedPath]) {
    stat.link.recursive = true;
    return null;
  }

  return await getStats(stats, resolvedPath);
};

export default async function stat(req, res) {
  try {
    const currentPath = normalize(req.params[0].replace(/^\/*/, '//'));
    const stats = {};
    const realPath = await getStats(stats, currentPath);
    return res.json({
      path: currentPath,
      realPath,
      stats
    });
  } catch (err) {
    return handleError(res, err);
  }
}
