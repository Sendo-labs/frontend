/**
 * Config field
 */
interface ConfigField {
	name: string;
	label: string;
	type: string;
	required: boolean;
	default?: string | number;
	description: string;
}

/**
 * Plugin
 */
interface Plugin {
	id: string;
	name: string;
	icon: string;
	price: string;
	description: string;
	tags: string[];
	rating: number;
	reviews: number;
	category: string;
	authType: string;
	longDescription: string;
	features: string[];
	configFields?: ConfigField[];
}

/**
 * Plugin categories
 */
interface PluginCategories {
	sponsored: Plugin[];
	liquidity: Plugin[];
	trading: Plugin[];
	ai: Plugin[];
	community: Plugin[];
}

export type { ConfigField, Plugin, PluginCategories };
