import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import ls from './ls';

const explorerApi = express();

explorerApi.use(cors());
explorerApi.use(bodyParser.json());

explorerApi.get('/ls/?*', ls);

export default explorerApi;
