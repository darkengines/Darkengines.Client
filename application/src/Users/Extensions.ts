import { Client } from '@drk/src/Api/Client';
import { lambda } from '@drk/src/Expressions/LambdaExpression';
import { Container } from 'inversify';
import {
	EmailVerificationRequestRoute,
} from './Routes/EmailVerificationRequestRoute';
import { EmailVerificationRoute } from './Routes/EmailVerificationRoute';
import { IndexRoute } from './Routes/IndexRoute';
import { UserInterfaces, UserMiddlewareInterfaces, UserRouteInterfaces } from './Interfaces';
import { LoginRoute } from './Routes/LoginRoute';
import {
	PasswordResetRequestRoute,
} from './Routes/PasswordResetRequestRoute';
import { PasswordResetRoute } from './Routes/PasswordResetRoute';
import { SignupRoute } from './Routes/SignupRoute';
import { AuthenticatedUserMiddleware } from './Middlewares/AuthenticatedUserMiddleware';
import { VerifiedUserMiddleware } from './Middlewares/VerifiedUserMiddleware';
import { UserMiddleware } from './Middlewares/UserMiddleware';
import { ApplicationMiddlewareInterfaces } from '../Applications/Interfaces';
import { UserApplicationMenuItemProvider } from './UserApplicationMenuItemProvider';
import { UserAccountRoute } from './Routes/UserAccountRoute';
import { UserProfileRoute } from './Routes/UserProfileRoute';
import { UserSecurityRoute } from './Routes/UserSecurityRoute';
import { UserUserMenuItemProvider } from './UserUserMenuItemProvider';

declare module 'inversify' {
	interface Container {
		addUsers(): Container;
	}
}
Container.prototype.addUsers = function (): Container {
	this.bind(UserRouteInterfaces.IIndexRoute).to(IndexRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.ILoginRoute).to(LoginRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.ISignupRoute).to(SignupRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.IUserAccountRoute).to(UserAccountRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.IUserProfileRoute).to(UserProfileRoute).inSingletonScope();
	this.bind(UserRouteInterfaces.IUserSecurityRoute).to(UserSecurityRoute).inSingletonScope();
	this.bind(UserMiddlewareInterfaces.IAuthenticatedUserMiddleware)
		.to(AuthenticatedUserMiddleware)
		.inSingletonScope();
	this.bind(UserMiddlewareInterfaces.IVerifiedUserMiddleware)
		.to(VerifiedUserMiddleware)
		.inSingletonScope();
	this.bind(UserMiddlewareInterfaces.IUserMiddleware).to(UserMiddleware).inSingletonScope();
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
	this.bind(ApplicationMiddlewareInterfaces.IApplicationMenuItemProvider)
		.to(UserApplicationMenuItemProvider)
		.inSingletonScope();
	this.bind(UserInterfaces.IUserMenuItemProvider).to(UserUserMenuItemProvider).inSingletonScope();
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
		(context) => () => login(context.scope.emailAddress, password)
	).lambdaSource;
	return await Promise.resolve('');
};
