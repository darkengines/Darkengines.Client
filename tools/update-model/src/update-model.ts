import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { queryProvider } from '@drk/src/Api/QueryProvider';
import { getInterfaceName, getTypeNode, makeRelative } from '@drk/src/Model/TypescriptTypeMapping';
import {
	createPrinter,
	EmitHint,
	EndOfLineState,
	factory,
	Modifier,
	NewLineKind,
	NodeFlags,
	SyntaxKind,
} from 'typescript';

export async function main(outputDir: string) {
	const models = await queryProvider
		.query<IEntityModel[]>('ModelProvider.EntityModels')
		.execute();

	for (const model of models) {
		model.namespace = model.namespace
			.filter((part, index) => index > 1)
			.map((part) => (part == 'Entities' ? 'Models' : part));
	}

	const modelSources = models.map((model) => {
		const modelInterfaceName = getInterfaceName(model.name);
		const referencedTypes: IEntityModel[] = [];
		const properties = model.properties.map((property) => {
			const modifiers: Modifier[] = [];
			return factory.createPropertySignature(
				modifiers,
				property.name,
				undefined,
				getTypeNode(property.typeName)
			);
		});
		const references = model.references.map((reference) => {
			const modifiers: Modifier[] = [];
			if (reference.type !== model && !referencedTypes.includes(reference.type))
				referencedTypes.push(reference.type);
			return factory.createPropertySignature(
				modifiers,
				reference.name,
				undefined,
				factory.createTypeReferenceNode(getInterfaceName(reference.type.name), [])
			);
		});
		const collections = model.collections.map((collection) => {
			const modifiers: Modifier[] = [];
			if (collection.type !== model && !referencedTypes.includes(collection.type))
				referencedTypes.push(collection.type);
			return factory.createPropertySignature(
				modifiers,
				collection.name,
				undefined,
				factory.createArrayTypeNode(
					factory.createTypeReferenceNode(getInterfaceName(collection.type.name), [])
				)
			);
		});
		const interfaceDeclaration = factory.createInterfaceDeclaration(
			[factory.createToken(SyntaxKind.ExportKeyword)],
			modelInterfaceName,
			[],
			[],
			[...properties, ...references, ...collections]
		);

		const importStatements = referencedTypes.map((referencedType) => {
			const referencedInterfaceName = getInterfaceName(referencedType.name);
			const importStatement = factory.createImportDeclaration(
				undefined,
				factory.createImportClause(
					false,
					undefined,
					factory.createNamedImports([
						factory.createImportSpecifier(
							false,
							undefined,
							factory.createIdentifier(referencedInterfaceName)
						),
					])
				),
				factory.createStringLiteral(
					`${makeRelative(
						model.namespace,
						referencedType.namespace
					)}${referencedInterfaceName}`
				)
			);
			return importStatement;
		});

		const source = factory.createSourceFile(
			[...importStatements, interfaceDeclaration],
			SyntaxKind.EndOfFileToken as any,
			NodeFlags.None
		);

		const document = {
			path: `${model.namespace.join('/')}/${modelInterfaceName}.ts`,
			source,
		};

		return document;
	});
	var printer = createPrinter({
		newLine: NewLineKind.LineFeed,
	});

	for (const modelSource of modelSources) {
		var result = printer.printNode(EmitHint.Unspecified, modelSource.source, undefined);
		const path = join(outputDir, modelSource.path);
		await mkdir(dirname(path), { recursive: true });
		await writeFile(path, result);
	}
}
