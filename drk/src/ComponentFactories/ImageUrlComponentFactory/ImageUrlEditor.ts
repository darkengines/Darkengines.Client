import mdcTypographyCss from '!raw-loader!@material/typography/dist/mdc.typography.css';
import cropperCss from '!raw-loader!cropperjs/dist/cropper.min.css';
import '@material/mwc-button/mwc-button';
import { Dialog } from '@material/mwc-dialog';
import { MDCDialogCloseEventDetail } from '@material/mwc-dialog/mwc-dialog-base';
import '@material/mwc-icon/mwc-icon';
import Cropper from 'cropperjs';
import { css, html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IEditorComponentActions, IEditorComponentProps } from '../IComponentFactory';

@customElement('drk-image-url-editor')
export class ImageUrlEditor extends LitElement {
	@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, string>;
	public actions: IEditorComponentActions<IPropertyModel, string>;
	@property({ type: Boolean })
	public helperPersistant: boolean;
	@property({ type: String })
	public validationMessage: string;
	@property({ type: Number })
	public aspectRatio: number = 16 / 9;
	@property({ type: String })
	public label: string;
	@query('#imageEditor')
	protected imageEditor: HTMLImageElement;
	@query('#display')
	protected display: HTMLImageElement;
	@query('#input')
	protected input: HTMLInputElement;
	@query('#dialog')
	protected dialog: Dialog;
	protected cropper: Cropper;
	public onUpload: (file: Blob) => Promise<string>;
	public static get styles() {
		return css`
			${unsafeCSS(cropperCss)}
			${unsafeCSS(mdcTypographyCss)}
			:host {
				display: inline-grid;
				height: 100%;
				grid-auto-flow: row;
				grid-auto-rows: auto;
				justify-items: start;
				grid-gap: calc(var(--content-spacing) / 2);
			}
			#display {
				width: 100%;
				position: relative;
			}
			#interactiveLayer {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				opacity: 0;
				color: var(--primary-color-light);
				cursor: pointer;
				z-index: 1;
				transition: opacity 0.3s;
				border: dashed 4px var(--primary-color-light);
			}
			#display.error #interactiveLayer,
			#display.error #placeholder {
				background-color: rgba(var(--error-color-rgb), 0.1);
				color: rgba(var(--error-color-rgb), 1);
				border-color: rgba(var(--error-color-rgb), 1);
			}
			#interactiveLayer:hover {
				opacity: 1;
				background-color: rgba(var(--primary-color-light-rgb), 0.1);
			}
			#image {
				position: absolute;
				inset: 0px;
				object-fit: contain;
				background-color: var(--primary-color-light);
			}
			#placeholder {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-color: rgba(var(--primary-color-light-rgb), 0.1);
				color: var(--primary-color-light);
				border: dashed 4px var(--primary-color-light);
				cursor: pointer;
			}
			#placeholder mwc-icon,
			#interactiveLayer mwc-icon {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			img {
				width: 100%;
				max-width: 100%;
				max-height: 100%;
				height: 100%;
			}
			#wrapper {
				max-height: 100%;
				height: 100%;
			}
			#input {
				display: none;
			}
			#validationMessage {
				color: var(--error-color);
				min-height: 20px;
				padding-right: 16px;
				padding-left: 16px;
			}
		`;
	}
	renderImage() {
		if (this.props.value) {
			return html` <img id="image" src="${this.props.value}" />
				<div @click=${(e) => this.input.click()} id="interactiveLayer">
					<mwc-icon>insert_photo</mwc-icon>
				</div>`;
		} else {
			return html`<div @click=${(e) => this.input.click()} id="placeholder">
				<mwc-icon>add_photo_alternate</mwc-icon>
			</div>`;
		}
	}
	renderLabel() {
		if (this.label ?? this.props.model?.name) {
			return html`<label id="label" class="mdc-typography--subtitle1"
				>${this.label ?? this.props.model?.name}</label
			>`;
		}
		return nothing;
	}
	render() {
		return html`<input
				type="file"
				id="input"
				accept="image/*"
				@change=${(e: InputEvent) => {
					const file = this.input.files[0];
					var reader = new FileReader();
					reader.onload = (e) => {
						this.imageEditor.src = e.target.result as string;
						if (this.cropper) {
							this.cropper.destroy();
						}
						this.cropper = new Cropper(this.imageEditor, {
							aspectRatio: this.aspectRatio,
							cropBoxResizable: true,
							cropBoxMovable: true,
							minCanvasHeight: 200,
						});
						this.dialog.open = true;
					};
					reader.readAsDataURL(file);
				}}
			/>
			${this.renderLabel()}
			<div
				id="display"
				style="padding-bottom: calc(100% / ${this.aspectRatio});"
				class=${classMap({
					error: this.validationMessage && this.validationMessage.length,
				})}
			>
				${this.renderImage()}
			</div>
			<div id="validationMessage" class="mdc-typography--caption">
				${this.validationMessage}
			</div>
			<mwc-dialog
				id="dialog"
				@closed=${async (e: CustomEvent<MDCDialogCloseEventDetail>) => {
					if (e.detail.action == 'confirm') {
						this.cropper.getCroppedCanvas().toBlob(async (blob) => {
							const url = await this.onUpload(blob);
							this.display.src = url;
							if (this.actions.valueChanged)
								this.actions.valueChanged({ ...this.props, value: url });
						}, 'image/jpeg', 0.95);
					}
				}}
			>
				<div><img id="imageEditor" src="${this.props.value}" /></div>
				<mwc-button slot="primaryAction" dialogAction="confirm">Confirm</mwc-button>
				<mwc-button slot="secondaryAction" dialogAction="cancel">Cancel</mwc-button>
			</mwc-dialog>`;
	}
	async firstUpdated(_changedProperties: PropertyValues) {
		await super.firstUpdated(_changedProperties);
		await this.updateComplete;
	}
	update(changedProperties: PropertyValues) {
		if (changedProperties.has('state')) {
			// if (this.state?.value !== this.cropper?.getContent()) {
			// 	this.cropper?.
			// }
		}
		super.update(changedProperties);
	}
}
