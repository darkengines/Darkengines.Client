import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';
import './Users/Extensions';
import './Applications/Extensions';
import './Administration/Extensions';
import { addDesigner } from './Designer/Extensions';
import { addColumnFactories } from '@drk/src/Components/DarkenginesGrid/Extensions';

let serviceCollection = new Container();
addDarkengines(serviceCollection);
serviceCollection.addUsers().addApplications().addAdministration();
addDesigner(serviceCollection);
addColumnFactories(serviceCollection);

export { serviceCollection };
