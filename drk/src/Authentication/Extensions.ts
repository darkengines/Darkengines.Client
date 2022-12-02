import { Container } from 'inversify';
import { authentication, Authentication } from './Authentication';

export function addAuthentication(container: Container) {
	container.bind(Authentication).toConstantValue(authentication);
	return container;
}
