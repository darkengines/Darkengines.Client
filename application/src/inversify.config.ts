import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';
import { addUsers } from './Users/Extensions';
import { addDesigner } from './Designer/Extensions';

let serviceCollection = new Container();
addDarkengines(serviceCollection);
addUsers(serviceCollection);
addDesigner(serviceCollection);

export { serviceCollection };
