import { factory, SyntaxKind, TypeNode } from 'typescript';

export function makeRelative(source: string[], destination: string[]) {
	let partIndex = 0;
	while (
		partIndex < source.length &&
		partIndex < destination.length &&
		source[partIndex] == destination[partIndex]
	) {
		partIndex++;
	}
	const parentOpCount = source.length - partIndex;
	const parentOperators = parentOpCount ? '../'.repeat(parentOpCount) : './';
	if (partIndex >= destination.length) return parentOperators;
	const relativePath = `${parentOperators}${destination.slice(partIndex).join('/')}/`;
	return relativePath;
}

export function getInterfaceName(typeName: string) {
	return `I${typeName}`;
}

export function getTypeNode(typeName: string) {
	let isArray = typeName.endsWith('[]');
	let syntaxKind = SyntaxKind.UnknownKeyword;
	if (isArray) {
		typeName = typeName.substring(0, typeName.length - 2);
	}
	switch (typeName) {
		case 'dynamic': {
			syntaxKind = SyntaxKind.AnyKeyword;
			break;
		}
		case 'int':
		case 'float':
		case 'decimal':
		case 'Int32':
		case 'Single':
		case 'Decimal':
		case 'System.Int32':
		case 'System.Single':
		case 'System.Decimal': {
			syntaxKind = SyntaxKind.NumberKeyword;
			break;
		}
		case 'Boolean':
		case 'System.Boolean':
		case 'bool': {
			syntaxKind = SyntaxKind.BooleanKeyword;
			break;
		}
		case 'Byte':
		case 'System.Byte':
		case 'byte': {
			isArray = false;
			syntaxKind = SyntaxKind.StringKeyword;
			break;
		}
		case 'Object': {
			syntaxKind = SyntaxKind.ObjectKeyword;
			break;
		}
		case 'string':
		case 'String':
		case 'System.String':
		case 'DateTimeOffset':
		case 'DateTime': {
			syntaxKind = SyntaxKind.StringKeyword;
			break;
		}
	}
	let typeNode = factory.createKeywordTypeNode(syntaxKind) as TypeNode;
	if (isArray) {
		typeNode = factory.createArrayTypeNode(typeNode);
	}
	return typeNode;
}
