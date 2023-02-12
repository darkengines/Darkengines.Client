import config from '../../../../config/appsettings.config.json';
import { html, svg } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import './Common.css';
import logo from '../../../../assets/images/logo.svg';
import { msg } from '@lit/localize';

export function signInFooter<
	TProps,
	TActions extends { goToSignIn: (state: TProps, ...args: any[]) => TProps }
>(props: TProps, actions: TActions) {
	return html`<div class="footer">
		<div class="signin">
			<div>${msg('Already have an account?', { id: 'signup.login.text' })}</div>
			<drk-button @click=${(e: MouseEvent) => actions.goToSignIn(props)}
				>${msg('Log in', { id: 'signup.login.label' })}</drk-button
			>
		</div>
	</div>`;
}

export function signUpFooter<
	TProps,
	TActions extends { goToSignup: (state: TProps, ...args: any[]) => TProps }
>(props: TProps, actions: TActions) {
	return html`<div class="footer">
		<div class="signup">
			<div>${msg('No account yet?', { id: 'login.signup.text' })}</div>
			<drk-button @click=${(e: MouseEvent) => actions.goToSignup(props)}
				>${msg('Sign up', { id: 'login.signup.label' })}</drk-button
			>
		</div>
	</div>`;
}

export function defaultHeader() {
	return html`<div class="head">
		${svg`${unsafeSVG(logo)}`}
		<div class="title mdc-typography--headline2">${config.Application.name}</div>
	</div>`;
}

export function form(header: any, body: any, footer: any) {
	return html`
		<form autocomplete="off" class="form mdc-elevation--z1">
			<input autocomplete="false" name="hidden" type="text" style="display:none;" />
			${header ?? defaultHeader()} ${body} ${footer}
		</form>
	`;
}
