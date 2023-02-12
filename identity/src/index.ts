import 'reflect-metadata';
import { Application } from './Application';
import { serviceCollection } from './inversify.config';

serviceCollection.bind(Application).toSelf();
const application = serviceCollection.get(Application);