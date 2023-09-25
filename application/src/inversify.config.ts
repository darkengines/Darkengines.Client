import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';
import './Users/Extensions';
import './Models/Extensions';
import '@drk/src/Components/Forms';
import './Applications/Extensions';
import './Administration/Extensions';
import { addDesigner } from './Designer/Extensions';
import { addColumnFactories } from '@drk/src/Components/DarkenginesGrid/Extensions';

let serviceCollection = new Container();
addDarkengines(serviceCollection);
serviceCollection
.addModels()
.addUsers()
.addForms()
.addApplications()
.addAdministration();
addDesigner(serviceCollection);
addColumnFactories(serviceCollection);

export { serviceCollection };
