import { Dictionary } from "ts-essentials";
import { NamespaceType, Node } from "./Node";

export type Namespace = {
	type: NamespaceType;
	children: Dictionary<Node>;
};
export type RuntimeNamespace = {
	type: RuntimeNamespace;
};
export function makeNamespace<TNamespace extends Namespace>(node: TNamespace): TNamespace {
	return node;
}