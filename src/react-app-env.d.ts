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

	type RC<P = {}, S = {}> = FC<P> | ComponentClass<P, S>;

	type Merge<T extends {}, P extends {}> = Omit<T, keyof P> & P;

	type PartialPart<T extends {}, P extends keyof T> = Merge<T, Partial<Pick<T, P>>>;

	type Obj<T> = {
		[key: string]: T;
	};

	type ClickHandler<E extends HTMLElement = HTMLElement> = EventHandler<MouseEvent<E>>;
}

declare module 'axios' {
	interface AxiosInstance {
		<R = undefined>(config: AxiosRequestConfig): Promise<R>;
		<R = undefined>(url: string, config?: AxiosRequestConfig): Promise<R>;
		defaults: AxiosRequestConfig;
		interceptors: {
			request: AxiosInterceptorManager<AxiosRequestConfig>;
			response: AxiosInterceptorManager<AxiosResponse>;
		};
		getUri(config?: AxiosRequestConfig): string;
		request<R = any>(config: AxiosRequestConfig): Promise<R>;
		get<R = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
		delete<R = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
		head<R = any>(url: string, config?: AxiosRequestConfig): Promise<R>;
		post<R = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
		put<R = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
		patch<R = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
	}
}
