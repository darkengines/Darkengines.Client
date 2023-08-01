import { Routing } from '@drk/src';
import { makeMiddleware } from '@drk/src/routing';
import { html } from 'lit';
import { serviceCollection } from '../inversify.config';
import { UserMiddlewareInterfaces, UserRouteInterfaces } from './Interfaces';
import { IUserMiddleware } from './Middlewares/UserMiddleware';
import { IEmailVerificationRequestRoute } from './Routes/EmailVerificationRequestRoute';
import { IEmailVerificationRoute } from './Routes/EmailVerificationRoute';
import { IIndexRoute } from './Routes/IndexRoute';
import { ILoginRoute } from './Routes/LoginRoute';
import { IPasswordResetRequestRoute } from './Routes/PasswordResetRequestRoute';
import { IPasswordResetRoute } from './Routes/PasswordResetRoute';
import { ISignupRoute } from './Routes/SignupRoute';
import { IUserAccountRoute } from './Routes/UserAccountRoute';
import { IUserProfileRoute } from './Routes/UserProfileRoute';
import { IUserSecurityRoute } from './Routes/UserSecurityRoute';

const loginRoute = serviceCollection.get<ILoginRoute>(UserRouteInterfaces.ILoginRoute);
const emailVerificationRoute = serviceCollection.get<IEmailVerificationRoute>(
	UserRouteInterfaces.IEmailVerificationRoute
);
const emailVerificationRequestRoute = serviceCollection.get<IEmailVerificationRequestRoute>(
	UserRouteInterfaces.IEmailVerificationRequestRoute
);
const signupRoute = serviceCollection.get<ISignupRoute>(UserRouteInterfaces.ISignupRoute);
const indexRoute = serviceCollection.get<IIndexRoute>(UserRouteInterfaces.IIndexRoute);
const passwordResetRequestRoute = serviceCollection.get<IPasswordResetRequestRoute>(
	UserRouteInterfaces.IPasswordResetRequestRoute
);
const passwordResetRoute = serviceCollection.get<IPasswordResetRoute>(
	UserRouteInterfaces.IPasswordResetRoute
);
const userAccountRoute = serviceCollection.get<IUserAccountRoute>(
	UserRouteInterfaces.IUserAccountRoute
);
const userProfileRoute = serviceCollection.get<IUserProfileRoute>(
	UserRouteInterfaces.IUserProfileRoute
);
const userSecurityRoute = serviceCollection.get<IUserSecurityRoute>(
	UserRouteInterfaces.IUserSecurityRoute
);
const userMiddleware = serviceCollection.get<IUserMiddleware>(
	UserMiddlewareInterfaces.IUserMiddleware
);
export const indexRouteNode = Routing.makeRoute({
	path: '/',
	route: indexRoute,
});
export const loginRouteNode = Routing.makeRoute({
	path: '/login',
	route: loginRoute,
});
export const emailVerificationRouteNode = Routing.makeRoute({
	path: '/verify/:guid',
	route: emailVerificationRoute,
});
export const emailVerificationRequestRouteNode = Routing.makeRoute({
	path: '/verify',
	route: emailVerificationRequestRoute,
});
export const signupRouteNode = Routing.makeRoute({
	path: '/signup',
	route: signupRoute,
});
export const passwordResetRequestRouteNode = Routing.makeRoute({
	path: '/request-password-reset',
	route: passwordResetRequestRoute,
});
export const passwordResetRouteNode = Routing.makeRoute({
	path: '/password-reset/',
	route: passwordResetRoute,
});
export const account = Routing.makeRoute({
	path: '/account',
	route: userAccountRoute,
});
export const profile = Routing.makeRoute({
	path: '/profile',
	route: userProfileRoute,
});
export const security = Routing.makeRoute({
	path: '/security',
	route: userSecurityRoute,
});
export const userNode = makeMiddleware('me', userMiddleware, {
	index: {
		path: '/',
		route: {
			handler: async (context) => html`Me`,
			display: () => 'Me',
		},
	},
	account,
	profile,
	security,
});