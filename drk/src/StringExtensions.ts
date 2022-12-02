interface String {
	like(this: String, pattern: String): boolean;
	contains(this: String, pattern: String): boolean;
	toSnakeCase(this: string): string;
	toCamelCase(this: string): string;
	capitilize(this: string): string;
}
String.prototype.like = function like(this: String, pattern: String): boolean {
	throw 'Not implemented';
};
String.prototype.contains = function contains(this: String, pattern: String): boolean {
	throw 'Not implemented';
};

String.prototype.toSnakeCase = function (this: string) {
	const regex = /([a-z])([A-Z])/g;
	return `${this[0].toLowerCase()}${this.substr(1).replace(regex, (m) =>
		m.replace(regex, (m) => `${m[0]}-${m[1].toLowerCase()}`)
	)}`;
};
String.prototype.toCamelCase = function (this: string) {
	return `${this[0].toLowerCase()}${this.substr(1)}`;
};
String.prototype.capitilize = function (this: string) {
	return `${this[0].toUpperCase()}${this.substr(1)}`;
};
