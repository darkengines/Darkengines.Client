import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';
import { addUsers } from './Users/Extensions';
import { addDesigner } from './Designer/Extensions';
import { addColumnFactories } from '@drk/src/Components/DarkenginesGrid/Extensions';

let serviceCollection = new Container();
addDarkengines(serviceCollection);
addUsers(serviceCollection);
addDesigner(serviceCollection);
addColumnFactories(serviceCollection);

export { serviceCollection };
