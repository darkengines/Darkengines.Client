import { Container } from 'inversify';
import { apiClient, Client } from './Client';

export function addApi(container: Container) {
	container.bind(Client).toConstantValue(apiClient);
	return container;
}