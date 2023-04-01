import { Expression } from 'estree';
export interface IQueryExecutionResult<T> {
	value: T,
	report: IQueryExecutionReport
}
export interface IQueryExecutionReport {
	duration: number;
}
export default interface IQueryable<T> {
	execute(options: any): Promise<T>;
	executeMonitored(options: any): Promise<IQueryExecutionResult<T>>;
	expression: Expression;
}
