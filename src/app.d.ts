declare global {
	namespace App {
		interface Locals {
			user: {
				id: number;
				name: string;
				role: string;
				token: string;
			};
		}
		interface PageData {
			user: {
				id: number;
				name: string;
			};
		}
	}
}

export {};
