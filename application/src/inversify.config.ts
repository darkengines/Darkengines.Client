import { AdminRoute } from './AdminRoute';
import { Container } from 'inversify';
import { addDarkengines } from '@drk/src/Extensions';

let serviceCollection = new Container();
serviceCollection.bind(AdminRoute).toSelf().inSingletonScope()
addDarkengines(serviceCollection);

export { serviceCollection };
