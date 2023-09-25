import { generate } from 'escodegen';
import { parseScript } from 'esprima';
import { replace } from 'estraverse';
import { ArrowFunctionExpression, ExpressionStatement, Identifier, Node } from 'estree';
import { CallExpression, MemberExpression } from 'typescript';

class ScopedLambda<TFunc, TScope> {
	lambda: TFunc;
	scope?: TScope;
	lambdaSource: string;
}
interface ILambdaContext<TScope> {
	scope: TScope;
	cast: <T>(type: string, value: any) => T;
}

function getRootObject(node: Node) {
	if (node.type != 'MemberExpression') return node;
	return getRootObject(node.object);
}

function lambda<TFunc, TScope>(
	scope: TScope,
	functionFactory: (context?: ILambdaContext<TScope>) => TFunc
) {
	const program = parseScript(functionFactory.toString());
	const factoryExpression = program.body[0] as ExpressionStatement;
	const factoryFunctionExpression = factoryExpression.expression as ArrowFunctionExpression;
	const contextParameter = factoryFunctionExpression.params[0] as Identifier;
	let lambdaExpression = factoryFunctionExpression.body as ArrowFunctionExpression;
	const context: ILambdaContext<TScope> = {
		scope,
		cast<T>(type, value) {
			return <T>value;
		},
	};
	lambdaExpression = replace(lambdaExpression, {
		enter: function (node: Node) {
			// Replace it with replaced.
			if (
				node.type == 'MemberExpression' &&
				node.object.type == 'MemberExpression' &&
				node.object.object.type == contextParameter.type &&
				node.object.object.name == contextParameter.name &&
				node.object.property.type == 'Identifier' &&
				node.object.property.name == 'scope'
			) {
				const value = context.scope[(node.property as Identifier).name];
				const codeValue = JSON.stringify(value);
				const parsedValue = parseScript(`${codeValue}`);
				const valueExpression = parsedValue.body[0] as ExpressionStatement;

				return valueExpression.expression;
			}
			if (
				node.type == 'CallExpression' &&
				node.callee.type == 'MemberExpression' &&
				node.callee.object.type == contextParameter.type &&
				node.callee.object.name == contextParameter.name &&
				node.callee.property.type == 'Identifier' &&
				node.callee.property.name == 'cast'
			) {
				const callExpression: Node = {
					type: 'CallExpression',
					callee: { type: 'Identifier', name: 'cast' },
					arguments: node.arguments,
					optional: false,
				};
				return callExpression;
			}
			return node;
		},
	});
	const code = generate(lambdaExpression, { format: { escapeless: true } });
	const scopedLambda = new ScopedLambda<TFunc, TScope>();
	scopedLambda.lambdaSource = code;
	return scopedLambda;
}
export function cast<T>(type: string, value: any) {
	return <T>value;
}
export { ScopedLambda, lambda };
