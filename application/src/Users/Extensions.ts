import { apiClient, Client } from '@drk/src/Api/Client';
import { queryExecutor } from '@drk/src/Api/QueryExecutor';
import { queryProvider } from '@drk/src/Api/QueryProvider';
import IQueryable from '@drk/src/Expressions/IQueryable';
import { lambda } from '@drk/src/Expressions/LambdaExpression';
import { Container } from 'inversify';
import { EmailVerificationRequestRoute } from './Routes/EmailVerificationRequestRoute';
import { EmailVerificationRoute } from './Routes/EmailVerificationRoute';
import { IndexRoute } from './Routes/IndexRoute';
import { UserRouteInterfaces } from './Routes/Interfaces';
import { LoginRoute } from './Routes/LoginRoute';
import { PasswordResetRequestRoute } from './Routes/PasswordResetRequestRoute';
import { PasswordResetRoute } from './Routes/PasswordResetRoute';
import { SignupRoute } from './Routes/SignupRoute';

declare module 'inversify' {
	interface Container {
		addUsers(): Container;
	}
}
Container.prototype.addUsers = function (): Container {
	this.bind(UserRouteInterfaces.IIndexRoute).to(IndexRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.ILoginRoute).to(LoginRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.ISignupRoute).to(SignupRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.IEmailVerificationRoute)
		.to(EmailVerificationRoute)
		.inSingletonScope();
	this.bind(UserRouteInterfaces.IEmailVerificationRequestRoute)
		.to(EmailVerificationRequestRoute)
		.inSingletonScope();
	this.bind(UserRouteInterfaces.IPasswordResetRequestRoute)
		.to(PasswordResetRequestRoute)
		.inSingletonScope();
	this.bind(UserRouteInterfaces.IPasswordResetRoute).to(PasswordResetRoute).inSingletonScope();
	return this;
};

declare module '@drk/src/Api/Client' {
	interface Client {
		login(emailAddress: string, password: string): Promise<string>;
	}
}

Client.prototype.login = async function (emailAddress: string, password: string): Promise<string> {
	const login: (login: string, password: string) => void = null;
	const query = lambda(
		{ emailAddress, password },
		(scope) => () => login(scope.emailAddress, password)
	).lambdaSource;
	return await Promise.resolve('');
};
