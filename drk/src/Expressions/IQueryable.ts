import { Expression } from 'estree';
export default interface IQueryable<T> {
	execute(options: any): Promise<T>;
	expression: Expression;
}
