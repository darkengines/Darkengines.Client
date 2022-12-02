import { css } from 'lit';

const scrollbarStyle = css`
	:host {
		--firefox-scrollbar-width: thin;
		--scrollbar-size: 8px;
	}
	::-webkit-scrollbar-track {
		background-color: var(--primary-color-light);
	}
	::-webkit-scrollbar {
		width: var(--scrollbar-size);
		height: var(--scrollbar-size);
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb {
		background-color: var(--primary-color-dark);
		border: none;
	}
	::-webkit-scrollbar-corner {
		background-color: var(--primary-color-light);
	}
	* {
		scrollbar-color: var(--primary-color-dark) var(--primary-color-light);
		scrollbar-width: var(--firefox-scrollbar-width);
	}
`;

export { scrollbarStyle };

