module Astar {
    export class Node {
        public x: number;
        public y: number;
        public walkable: boolean;
        constructor(x: number, y: number, walkable?: boolean) {
            this.x = x;
            this.y = y;
            this.walkable = walkable ? walkable : true;
        }
        public setWalkable(x: number, y: number, value: boolean) {
            this.walkable = value;
        }
    }
}