import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';
import { addUsers } from './Users/Extensions';

let serviceCollection = new Container();
addDarkengines(serviceCollection);
addUsers(serviceCollection);

export { serviceCollection };
