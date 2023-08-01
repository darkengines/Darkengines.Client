export const UserRouteInterfaces = {
	ILoginRoute: Symbol.for('ILoginRoute'),
	ISignupRoute: Symbol.for('ISignupRoute'),
	IPasswordResetRequestRoute: Symbol.for('IPasswordResetRequestRoute'),
	IPasswordResetRoute: Symbol.for('ILoginRoutIPasswordReseteRoute'),
	IIndexRoute: Symbol.for('IIndexRoute'),
	IEmailVerificationRoute: Symbol.for('IEmailVerificationRoute'),
	IEmailVerificationRequestRoute: Symbol.for('IEmailVerificationRequestRoute'),
	IUserAccountRoute: Symbol.for('IUserAccountRoute'),
	IUserProfileRoute: Symbol.for('IUserProfileRoute'),
	IUserSecurityRoute: Symbol.for('IUserSecurityRoute'),
};

export const UserMiddlewareInterfaces = {
	IAuthenticatedUserMiddleware: Symbol.for('IAuthenticatedUserMiddleware'),
	IVerifiedUserMiddleware: Symbol.for('IVerifiedUserMiddleware'),
	IUserMiddleware: Symbol.for('IUserMiddleware'),
};

export const UserInterfaces = {
	IUserMenuItemProvider: Symbol.for('IUserMenuItemProvider'),
};
