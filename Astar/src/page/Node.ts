module astar {
    export class Node {
        public x: number;
        public y: number;
        public parent: Node;                // 当前节点的父一节点，，寻路使用
        public f: number;                   // F = G + H
        public g: number;                   // 从起点到当前点的成本
        public h: number;                   // 从当前点到终点的成本
        public costMultiplier: number;      // 成本基础倍数-从当前节点经过时需要的成本倍数
        public walkable: boolean;
        public num: String;
        constructor(x: number, y: number, walkable?: boolean) {
            this.x = x;
            this.y = y;
            this.walkable = walkable ? walkable : true;
            this.costMultiplier = 1;
            this.num = x + "" + y;
        }
        public setWalkable(x: number, y: number, value: boolean) {
            this.walkable = value;
        }
    }
}