import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import handleError from './handleError';

const realpathAsync = Promise.promisify(fs.realpath);
const readdirAsync = Promise.promisify(fs.readdir);

export default async function ls(req, res) {
  try {
    const queryPath = path.resolve('/', req.params[0]);

    const realPath = await realpathAsync(queryPath);
    const entries = await readdirAsync(realPath);
    return res.json({
      realPath,
      entries
    });
  } catch (err) {
    return handleError(res, err);
  }
}
