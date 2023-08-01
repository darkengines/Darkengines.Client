import { css, CSSResultGroup, html, LitElement, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

export interface ICommand {
	input: string;
	output: string;
}

export interface ITerminal {
	history: ICommand[];
}

@customElement('drk-terminal')
export class Terminal extends LitElement {
	@query('#terminal')
	protected terminalElement: HTMLDivElement;
	@query('#_input')
	protected input: HTMLInputElement;
	protected terminal: ITerminal = {
		history: [],
	};

	public static get styles(): CSSResultGroup {
		return [
			css`
				:host {
					display: block;
				}
				#terminal {
					width: 1024px;
					height: 768px;
					background-color: black;
				}
				#_input {
					
				}
			`,
		];
	}

	async connectedCallback() {
		super.connectedCallback();
		await this.updateComplete;
	}

	render() {
		return html`<div
			id="terminal"
			@click=${(e: Event) => {
				console.log(e);
				this.input.focus();
			}}
		>
			<input
				id="_input"
				type="text"
				@keyup=${(e: KeyboardEvent) => {
					console.log(e);
				}}
				@keydown=${(e: KeyboardEvent) => {
					console.log(e);
				}}
				@input=${(e: KeyboardEvent) => {
					console.log(e);
				}}
			/>
			<div id="history">
				${repeat(
					this.terminal.history,
					(command) => html`
						<div class="command">
							<div class="input"></div>
							<div class="output"></div>
						</div>
					`
				)}
			</div>
			<div id="input"></div>
		</div>`;
	}
}
