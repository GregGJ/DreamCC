import { BTNodeStatus } from "./BTNodeStatus";
import { BTNodeType } from "./BTNodeType";
import { BTControlNode } from "./controls/BTControlNode";
import { BTDecoratorNode } from "./decorators/BTDecoratorNode";
import { IBTNode } from "./interfaces/IBTNode";




/**
 * 行为树
 */
export class BTUtils {


    /**
     * 递归遍历行为树节点，并对每个节点执行指定函数。
     *
     * @param root 行为树根节点。
     * @param visitor 访问函数，用于处理每个节点。
     * @throws 当根节点为null时，抛出异常。
     */
    static applyRecursiveVisitor<T>(root: IBTNode, visitor: (node: IBTNode) => void) {
        if (!root) throw new Error("root is null");
        visitor(root);
        if (root.type == BTNodeType.CONTROL) {
            const controlNode = root as BTControlNode;
            for (let index = 0; index < controlNode.numChildren; index++) {
                const child = controlNode.getChild(index);
                this.applyRecursiveVisitor(child, visitor);
            }
        } else if (root.type == BTNodeType.DECORATOR) {
            const decoratorNode = root as BTDecoratorNode;
            this.applyRecursiveVisitor(decoratorNode.getChild()!, visitor);
        }
    }

    /**
     * 递归打印树形结构
     *
     * @param root 树的根节点
     * @returns 返回树的字符串表示
     */
    static printTreeRecursively<T>(root: IBTNode): string {
        if (!root) return "";
        const endl = '\n';
        let stream = '';
        let recursivePrint = (indent: number, node: IBTNode) => {
            for (let i = 0; i < indent; i++) {
                stream += '   ';
            }
            if (!node) {
                stream += '!null!' + endl;
                return;
            }
            let status = '';
            switch (node.status) {
                case BTNodeStatus.FAILURE:
                    status = 'failure';
                    break;
                case BTNodeStatus.RUNNING:
                    status = 'running';
                    break;
                case BTNodeStatus.SUCCESS:
                    status = 'success';
                    break;
            }
            stream += "[" + status + "]" + node.name + endl
            indent++;

            if (node.type == BTNodeType.CONTROL) {
                const controlNode = node as BTControlNode;
                for (let index = 0; index < controlNode.numChildren; index++) {
                    const child = controlNode.getChild(index);
                    recursivePrint(indent, child);
                }
            } else if (node.type == BTNodeType.DECORATOR) {
                const decoratorNode = node as BTDecoratorNode;
                recursivePrint(indent, decoratorNode.getChild()!);
            }
        };

        stream += '----------------' + endl;
        recursivePrint(0, root);
        stream += '----------------' + endl;
        return stream;
    }
}