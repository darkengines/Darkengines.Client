import 'reflect-metadata';
import config from '../config/appsettings.config.json';
import { setConfig } from '@drk/src/config';
setConfig(config);
import { main } from './update-model';
import { dirname } from 'path';

await main(process.argv[2]);
