import { Container } from 'inversify';
import { addApi } from './Api/Extensions';
import { addAuthentication } from './Authentication/Extensions';
import { addComponentFactories } from './ComponentFactories/Extensions';
import { addModels } from './Model/Extensions';
import { addOperators } from './Operators/Extensions';

export function addDarkengines(container: Container) {
	return addApi(addAuthentication(addComponentFactories(addModels(addOperators(container)))));
}
