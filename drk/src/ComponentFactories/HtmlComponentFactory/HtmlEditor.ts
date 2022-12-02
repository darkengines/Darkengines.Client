import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import tinymce, { Editor, RawEditorOptions } from 'tinymce';
import { getLocale } from '../../Localization/Localization';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IEditorComponentActions, IEditorComponentProps } from '../IComponentFactory';

@customElement('drk-html-editor')
export default class HtmlEditor extends LitElement {
	@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, string>;
	public actions: IEditorComponentActions<IPropertyModel, string>;
	@property({ type: Boolean })
	public hasFixedWidth: boolean = true;
	@property({ type: Boolean })
	public hasBorder: boolean = true;
	@query('textarea')
	protected textArea: HTMLTextAreaElement;
	protected editor: Editor;
	public static get styles() {
		return css`
			:host {
				display: block;
			}
			#htmlEditor {
				padding: 0px 2px 2px;
			}
		`;
	}
	render() {
		return html`<textarea .value=${this.props?.value ?? ''}>${this.props?.value}</textarea>`;
	}
	async firstUpdated() {
		const supportedLanguages = {
			ar: 'ar',
			ca: 'ca',
			cs: 'cs',
			cs_CZ: 'cs_CZ',
			cy: 'cy',
			da: 'da',
			de: 'de',
			es: 'es_419',
			fa: 'fa',
			fr: 'fr_FR',
			fr_FR: 'fr_FR',
			he: 'he_IL',
			hr: 'hr',
			hu: 'hu_HU',
			id: 'id',
			it: 'it_IT',
			ja: 'ja',
			ka: 'kab',
			nb: 'nb_NO',
			nl: 'nl',
			nl_BE: 'nl_BE',
			pl: 'pl',
			pt: 'pt_PT',
			pt_BR: 'pt_BR',
			pt_PT: 'pt_PT',
			ro: 'ro',
			ru: 'ru',
			ru_RU: 'ru_RU',
			sk: 'sk',
			sl: 'sl',
			sq: 'sq',
			sv: 'sv_SE',
			ta: 'ta',
			ta_IN: 'ta_IN',
			th: 'th_TH',
			tr: 'tr',
			tr_TR: 'tr_TR',
			ug: 'ug',
			zh_CN: 'zh_CN',
			zh_TW: 'zh_TW',
		};
		let initOptions: RawEditorOptions = {
			target: this.textArea,
			language: supportedLanguages[getLocale()],
			id: 'htmlEditor',
			baseURL: '/assets/tinymce',
			skin: 'oxide',
			theme: 'silver',
			height: 0.5625 * 640,
			branding: false,
			setup: (editor) => {
				editor.on('change', (e) => {
					const value = this.editor.getContent();
					this.actions.valueChanged?.({ ...this.props, value });
					this.dispatchEvent(new CustomEvent('blur'));
				});
				editor.on('focus', (e) => {
					this.dispatchEvent(
						new CustomEvent('focus', {
							bubbles: true,
						})
					);
				});
				editor.on('focusin', (e) => {
					this.dispatchEvent(
						new CustomEvent('focusin', {
							bubbles: true,
						})
					);
				});
				editor.on('focusout', (e) => {
					this.dispatchEvent(
						new CustomEvent('focusout', {
							bubbles: true,
						})
					);
				});
				editor.on('blur', (e) => {
					const value = this.editor.getContent();
					this.dispatchEvent(new CustomEvent('blur'));
				});
			},
		};
		if (this.hasFixedWidth) initOptions = { ...initOptions, width: 640 };
		this.editor = (await tinymce.init(initOptions))[0];
		this.editor.editorContainer.id = 'htmlEditor';
		if (!this.hasBorder) {
			this.editor.getContainer().style.border = 'none';
		}
	}
	update(changedProperties: PropertyValues) {
		if (changedProperties.has('props')) {
			if (this.props?.value !== this.editor?.getContent()) {
				this.editor?.setContent(this.props?.value ?? '');
			}
		}
		super.update(changedProperties);
	}
}
