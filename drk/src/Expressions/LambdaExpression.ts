import { generate } from 'escodegen';
import { parseScript } from 'esprima';
import { replace } from 'estraverse';
import {
	ArrowFunctionExpression,
	ExpressionStatement,
	Identifier, Node
} from 'estree';

class ScopedLambda<TFunc, TScope> {
	lambda: TFunc;
	scope?: TScope;
	lambdaSource: string;
}
function lambda<TFunc, TScope>(scope: TScope, functionFactory: (scope?: TScope) => TFunc) {
	const program = parseScript(functionFactory.toString());
	const factoryExpression = program.body[0] as ExpressionStatement;
	const factoryFunctionExpression = factoryExpression.expression as ArrowFunctionExpression;
	const scopeParameter = factoryFunctionExpression.params[0] as Identifier;
	let lambdaExpression = factoryFunctionExpression.body as ArrowFunctionExpression;
	lambdaExpression = replace(lambdaExpression, {
		enter: function (node: Node) {
			// Replace it with replaced.
			if (node.type === 'MemberExpression') {
				if (
					node.object.type === scopeParameter.type &&
					(node.object as Identifier).name === scopeParameter.name
				) {
					const value = scope[(node.property as Identifier).name];
					const codeValue = JSON.stringify(value);
					const parsedValue = parseScript(`${codeValue}`);
					const valueExpression = parsedValue.body[0] as ExpressionStatement;

					return valueExpression.expression;
				}
			}
			return undefined;
		},
	});
	const code = generate(lambdaExpression, { format: { escapeless: true } });
	const scopedLambda = new ScopedLambda<TFunc, TScope>();
	scopedLambda.lambdaSource = code;
	return scopedLambda;
}
export { ScopedLambda, lambda };

