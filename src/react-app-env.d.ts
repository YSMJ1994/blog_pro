/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

import React, { FC, ComponentClass, EventHandler, MouseEvent } from 'react';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly NODE_ENV: 'development' | 'production' | 'test';
			readonly PUBLIC_URL: string;
			readonly BASE_API: string;
			readonly ICON_URL: string;
			readonly GITHUB_TOKEN: string;
			readonly PROXY_PATH: string;
		}
	}

	module '*.bmp' {
		const src: string;
		export default src;
	}

	module '*.gif' {
		const src: string;
		export default src;
	}

	module '*.jpg' {
		const src: string;
		export default src;
	}

	module '*.jpeg' {
		const src: string;
		export default src;
	}

	module '*.png' {
		const src: string;
		export default src;
	}

	module '*.webp' {
		const src: string;
		export default src;
	}

	module '*.svg' {
		import * as React from 'react';

		export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

		const src: string;
		export default src;
	}

	module '*.module.css' {
		const classes: { [key: string]: string };
		export default classes;
	}

	module '*.module.scss' {
		const classes: { [key: string]: string };
		export default classes;
	}

	module '*.module.sass' {
		const classes: { [key: string]: string };
		export default classes;
	}

	module '*.md' {
		const markdown: {
			id: number;
			title: string;
			tag: string[];
			createTime: number;
			modifyTime: number;
			group: string[];
			review: string;
			content: string;
		};
		export default markdown;
	}

	type RC<P, S = {}> = FC<P> | ComponentClass<P, S>;

	type Merge<T extends {}, P extends {}> = { [K in Exclude<keyof T, keyof P>]: T[K] } & { [K in keyof P]: P[K] };

	type PartialPart<T extends {}, P extends keyof T> = Merge<T, Partial<Pick<T, P>>>;

	type Obj<T> = {
		[key: string]: T;
	};

	type ClickHandler<E extends HTMLElement = HTMLElement> = EventHandler<MouseEvent<E>>;
}
