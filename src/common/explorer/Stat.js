import {Record} from 'immutable';

const UNIX_EPOCH_START_DATE = new Date(0);

const S_IFIFO = 4096;   // 0x1000
const S_IFCHR = 8192;   // 0x2000
const S_IFDIR = 16384;  // 0x4000
const S_IFBLK = 24576;  // 0x6000
const S_IFREG = 32768;  // 0x8000
const S_IFLNK = 40960;  // 0xa000
const S_IFSOCK = 49152; // 0xc000
const S_IFMT = 61440;   // 0xf000

export default class Stat {

  constructor(json = {}) {
    this.dev = json.dev || 0;
    this.mode = json.mode || 0;
    this.nlink = json.nlink || 0;
    this.uid = json.uid || 0;
    this.gid = json.gid || 0;
    this.rdev = json.rdev || 0;
    this.blksize = json.blksize || 0;
    this.ino = json.ino || 0;
    this.size = json.size || 0;
    this.blocks = json.blocks || 0;
    this.atime = json.atime ? new Date(json.atime) : UNIX_EPOCH_START_DATE;
    this.mtime = json.mtime ? new Date(json.mtime) : UNIX_EPOCH_START_DATE;
    this.ctime = json.ctime ? new Date(json.ctime) : UNIX_EPOCH_START_DATE;
    this.birthtime = json.birthtime ? new Date(json.birthtime) : UNIX_EPOCH_START_DATE;
    // timestamp from server
    this.ts = json.ts || Date.now();
  }

  _checkModeProperty(property) {
    return ((this.mode & S_IFMT) === property);
  }

  isDirectory() {
    return this._checkModeProperty(S_IFDIR);
  }

  isFile() {
    return this._checkModeProperty(S_IFREG);
  }

  isBlockDevice() {
    return this._checkModeProperty(S_IFBLK);
  }

  isCharacterDevice() {
    return this._checkModeProperty(S_IFCHR);
  }

  isSymbolicLink() {
    return this._checkModeProperty(S_IFLNK);
  }

  isFIFO() {
    return this._checkModeProperty(S_IFIFO);
  }

  isSocket() {
    return this._checkModeProperty(S_IFSOCK);
  }

}
