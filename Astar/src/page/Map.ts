module astar {
    export class Map {

        public nodes: Node[][];
        public constructor(rows: number, cols: number) {
            this.nodes = [];
            this._numRows = rows;
            this._numCols = cols;

            for (let i = 0; i < cols; i++) {
                this.nodes[i] = [];
                for (var j = 0; j < rows; j++) {
                    this.nodes[i][j] = new Node(i, j);
                }
            }
        }

        /**节点 */
        public getNode(x: number, y: number): Node {
            return this.nodes[x][y];
        }

        private _numRows: number;
        /**行数-高 */
        public get numRows(): number {
            return this._numRows;
        }

        private _numCols: number;
        /**列数-宽 */
        public get numCols(): number {
            return this._numCols;
        }

        private _startNode: Node;
        /**起点 */
        public set startNode(node: Node) {
            this._startNode = node;
        }
        public get startNode(): Node {
            return this._startNode;
        }
        public setStartNode(x: number, y: number) {
            this.startNode = this.getNode(x, y);
        }

        private _endNode: Node;
        /**终点 */
        public set endNode(node: Node) {
            this._endNode = node;
        }
        public get endNode(): Node {
            return this._endNode;
        }
        public setEndNode(x: number, y: number) {
            this.endNode = this.getNode(x, y);
        }

    }
}