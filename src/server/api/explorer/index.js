import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import ls from './ls';
import stat from './stat';

const explorerApi = express();

explorerApi.use(cors());
explorerApi.use(bodyParser.json());

explorerApi.get('/ls/?*', ls);
explorerApi.get('/stat/?*', stat);

export default explorerApi;
