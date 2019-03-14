module astar {
    export class AStar {

        private map: Map;
        private startNode: Node;
        private endNode: Node;
        private openList: Node[];       // 未考察节点表
        private closeList: Node[];      // 已考察节点表
        private straightCost: number;   // 上下走的成本
        private diagCost: number;       // 斜着走的成本
        /**当前节点到终点的成本 */
        private heuristic: Function;    // 使用的寻路算法

        /**
         * Astar
         * @description F = G + H
         *              G：从起点A，沿着产生的路径，移动到指定节点B上产生的成本
         *              H：从B点移动到终点C的预估成本
         *              F：总成本。取总成本最低节点集合组成的路径为最佳路劲
         * @author Lair
         * @date 2019-03-14
         * @memberof aStar
         */
        public constructor() {
            this.straightCost = 1.0;
            this.diagCost = Math.sqrt(2);   // Math.pow(2, 2);

            // this.heuristic = this.manhattan;
            // this.heuristic = this.euclidian;
            this.heuristic = this.diagonal;
        }

        /**
         * @description 寻路    
         */
        public findPath(map: Map): boolean {

            this.map = map;
            this.startNode = this.map.startNode;
            this.endNode = this.map.endNode;

            this.openList = [];
            this.closeList = [];

            this.startNode.g = 0;
            this.startNode.h = this.heuristic(this.startNode);
            this.startNode.f = this.startNode.g + this.startNode.h;

            return this.search();
        }
        public search(): boolean {
            // 当前节点-初始为起点
            var node: Node = this.startNode;
            // 遍历起点到终点的所有路径-用当前节点与所有节点进行计算获取最低成本
            while (node != this.endNode) {
                // 设置节点边界，防止在遍历时节点超出地图之外
                var startX = Math.max(0, node.x - 1);
                var startY = Math.max(0, node.y - 1);
                var endX = Math.min(this.map.numCols - 1, node.x + 1);
                var endY = Math.min(this.map.numRows - 1, node.y + 1);
                for (let i = startX; i <= endX; i++) {
                    for (let j = startY; j <= endY; j++) {

                        // 不让斜着走，只能走当前节点的同行或同列
                        if (i != node.x && j != node.y) {
                            // continue;
                        }

                        // 测试节点
                        let test = this.map.getNode(i, j);
                        // 相同节点        跳过
                        // 测试节点        不可行走时跳过
                        // 当前节点同行节点 不可行走时跳过
                        // 当前节点同列节点 不可行走时跳过
                        if (
                            test == node ||
                            !test.walkable ||
                            !this.map.getNode(test.x, node.y).walkable ||
                            !this.map.getNode(node.x, test.y).walkable
                        ) {
                            continue;
                        }

                        // 设置成本-上下走代价-斜着走的代价
                        var cost = this.straightCost;
                        if (i != node.x || j != node.y) {
                            cost = this.diagCost;
                        }

                        var g = node.g + cost * test.costMultiplier;
                        var h = this.heuristic(test);
                        var f = g + h;

                        // 判断成本-当节点未检测过时设置好成本
                        if (this.isClose(test) || this.isOpen(test)) {
                            // 保证当前节点的成本最小
                            if (test.f > f) {
                                test.g = g;
                                test.h = h;
                                test.f = f;
                                test.parent = node;
                            }
                        } else {
                            // 第一次查找
                            test.g = g;
                            test.h = h;
                            test.f = f;
                            test.parent = node;
                            this.openList.push(test);
                        }
                    }
                }
                // 当前节点计算完成后加入到closeList
                this.closeList.push(node);

                // 第一次查找都没有路径，则返回没有路径
                if (this.openList.length == 0) {
                    console.log("AStar >> not path found")
                    return false;
                }

                // 从小到大排序-获取到最小值节点用于做路径节点判断
                for (let m = 0; m < this.openList.length - 1; m++) {
                    for (let n = m + 1; n < this.openList.length; n++) {
                        if (this.openList[m].f > this.openList[n].f) {
                            let temp = this.openList[m];
                            this.openList[m] = this.openList[n];
                            this.openList[n] = temp;
                        }
                    }
                }
                node = this.openList.shift();
            }
            // console.log("findpath whils end")
            this.buildPath();
            return true;
        }

        /**生成路线 */
        private buildPath() {
            // console.log(`build path start`);
            this._path = [];
            let node: Node = this.endNode;
            this._path.push(node);

            while (node != this.startNode) {
                node = node.parent;
                this._path.unshift(node);
            }

            // console.log(`buildpath end`);
        }

        private _path: Node[];
        /**节点路径 */
        public get path(): Node[] {
            return this._path;
        }

        /**当前节点未考察过 */
        private isOpen(test: Node): boolean {
            for (const node of this.openList) {
                if (node == test) return true;
            }
            return false;
        }
        /**当前节点已考察过 */
        private isClose(test: Node): boolean {
            for (const node of this.closeList) {
                if (node == test) return true;
            }
            return false;
        }

        // 传入当前所在位置，计算当前点与终点的成本
        // 曼哈顿算法-node到终点的横向距离+纵向距离
        private manhattan(node: Node) {
            var dx = Math.abs(node.x - this.endNode.x);
            var dy = Math.abs(node.y - this.endNode.y);
            return (dx + dy) * this.straightCost;
        }
        // 三角函数-node到终点的直线距离
        private euclidian(node: Node) {
            var dx = Math.abs(node.x - this.endNode.x);
            var dy = Math.abs(node.y - this.endNode.y);
            return Math.sqrt(dx * dx + dy * dy) * this.straightCost;
        }
        // 允许斜向行走时到终点的算法-斜向成本+横向成本
        private diagonal(node: Node) {
            var dx = Math.abs(node.x - this.endNode.x);
            var dy = Math.abs(node.y - this.endNode.y);
            var diag = Math.min(dx, dy);
            var straight = dx + dy;
            var cost1 = this.diagCost * diag;       // 斜着走的代价
            var cost2 = this.straightCost * (straight - 2 * diag);  // 剩余横着走的代价
            return cost1 + cost2;
        }
    }
}


// 通过遍历节点找寻每个节点到终点的最小值
// 设置最小值节点为遍历节点，重新查找，一直找到终点停止

// 通过查询每个节点的父节点创建出最终路径