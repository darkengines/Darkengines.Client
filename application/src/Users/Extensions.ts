import { Container } from 'inversify';
import { IndexRoute } from './Routes/IndexRoute';
import { UserRouteInterfaces } from './Routes/Interfaces';
import { LoginRoute } from './Routes/LoginRoute';
import { PasswordResetRequestRoute } from './Routes/PasswordResetRequestRoute';
import { PasswordResetRoute } from './Routes/PasswordResetRoute';
import { SignupRoute } from './Routes/SignupRoute';

export function addUsers(container: Container) {
	container.bind(UserRouteInterfaces.IIndexRoute).to(IndexRoute).inSingletonScope();
	container.bind(UserRouteInterfaces.ILoginRoute).to(LoginRoute).inSingletonScope();
	container.bind(UserRouteInterfaces.ISignupRoute).to(SignupRoute).inSingletonScope();
	container.bind(UserRouteInterfaces.IPasswordResetRequestRoute).to(PasswordResetRequestRoute).inSingletonScope();
	container.bind(UserRouteInterfaces.IPasswordResetRoute).to(PasswordResetRoute).inSingletonScope();
	return container;
}
