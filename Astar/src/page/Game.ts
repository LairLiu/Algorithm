class Game extends wy.BaseSprite {
    constructor() {
        super();
    }

    /**装载地图和玩家的容器，用于点击-可用this代替 */
    public spr: egret.Sprite;
    public player: egret.Shape;
    /**节点地图-网格地图-无实体 */
    public map: astar.Map;
    /**节点尺寸 */
    public nodeSize: number;
    /**节点数量 */
    public nodesNum: number;
    /**列数-宽 */
    public mapCols: number;
    /**行数-高 */
    public mapRows: number;
    /**不可行走的节点数量 */
    public unWalkableNum: number;
    public show() {
        super.show();

        this.addChild(wy.Tools.createSprBtn(0, 0, 640, 1236, 0xcccccc, 1));

        this.nodeSize = 16;
        this.mapCols = 40;
        this.mapRows = 40;
        this.nodesNum = this.mapCols * this.mapRows;
        this.unWalkableNum = 200;

        this.spr = new egret.Sprite();
        this.spr.width = this.nodeSize * this.mapCols;
        this.spr.height = this.nodeSize * this.mapRows;
        this.addChild(this.spr);
        this.spr.touchEnabled = true;
        this.spr.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMap, this);

        this.makePlayer();
        this.makeMap();
    }
    /**
	 * 创建玩家精灵。这里只是一个圆。
	 */
    public makePlayer() {
        this.player = new egret.Shape();
        this.player.graphics.beginFill(0xff0000);
        this.player.graphics.drawCircle(0, 0, this.nodeSize / 2);
        this.player.graphics.endFill();
        this.player.x = Math.floor(Math.random() * this.mapRows) * this.nodeSize + this.nodeSize / 2;
        this.player.y = Math.floor(Math.random() * this.mapCols) * this.nodeSize + this.nodeSize / 2;
        this.spr.addChild(this.player);
    }

    /**
     * 创建一个网格地图，其中包含一组随机的不可行走节点。
     */
    public makeMap() {
        this.map = new astar.Map(this.mapCols, this.mapRows);
        for (let i = 0; i < this.unWalkableNum; i++) {
            let ranX = Math.floor(Math.random() * this.mapRows);
            let ranY = Math.floor(Math.random() * this.mapCols);
            let node = this.map.getNode(ranX, ranY);
            node.setWalkable(ranX, ranY, false);
        }
        this.drawMap();
    }

    /**
     * 绘制给定的网格，并根据其状态为每个单元格着色
     */
    public drawMap() {
        this.spr.graphics.clear();
        for (let i = 0; i < this.mapRows; i++) {
            for (let j = 0; j < this.mapCols; j++) {
                let color: number = this.getColor(i, j);

                let shape = new egret.Shape();
                // shape.graphics.lineStyle(1, 0x000000);
                shape.graphics.beginFill(color);
                shape.graphics.drawRect(0, 0, this.nodeSize, this.nodeSize);
                shape.graphics.endFill();
                shape.x = i * this.nodeSize;
                shape.y = j * this.nodeSize;
                this.spr.addChild(shape);
            }
        }
        this.addChild(this.player); // 调整层级，使player始终在最上层
    }
    /**
     * 根据给定的节点状态确定其颜色 
     */
    public getColor(x: number, y: number): number {
        let node: astar.Node = this.map.getNode(x, y);
        if (!node.walkable) return 0;
        if (node == this.map.startNode) return 0xcccccc;
        if (node == this.map.endNode) return 0xcccccc;
        return 0xffffff;
    }
    /**
     * 处理地图上的点击事件
     */
    public onClickMap(e: egret.TouchEvent) {
        // 设置起始点和终点，用于可视化
        var posX = Math.floor(e.stageX / this.nodeSize),
            posY = Math.floor(e.stageY / this.nodeSize);
        this.map.setEndNode(posX, posY);

        posX = Math.floor(this.player.x / this.nodeSize);
        posY = Math.floor(this.player.y / this.nodeSize);
        this.map.setStartNode(posX, posY);

        this.drawMap();

        this.startTime = egret.getTimer();
        this.findPath();
        let cost = egret.getTimer() - this.startTime;
        console.log("耗时:", cost)
    }
    private startTime: number;      // 用于记录算法寻找路径花费的时间

    private path: astar.Node[];     // 路径节点集合
    private index: number;          // 要访问的节点在节点集合中的位置
    /**创建Astar实例并使用它查找路径 */
    private findPath() {
        var aStar: astar.AStar = new astar.AStar();
        if (aStar.findPath(this.map)) {         // 是否存在路径
            this.path = aStar.path;             // 查找到的路径节点集合
            this.index = 0;                     // 讲位置归零            
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);    // 开始依据位置开始移动
        }
    }

    /**
     * 找到路径上的下一个节点并对其进行简化。
     */
    private onEnterFrame(event: egret.Event): void {
        console.log(`${this.path[this.index].num}`);

        var targetX = this.path[this.index].x * this.nodeSize + this.nodeSize / 2;
        var targetY = this.path[this.index].y * this.nodeSize + this.nodeSize / 2;
        var dx = targetX - this.player.x;
        var dy = targetY - this.player.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 1) {
            this.index++;
            if (this.index >= this.path.length) {
                this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            }
        }
        else {
            this.player.x += dx * .5;
            this.player.y += dy * .5;
        }
    }

    public hide() {
        super.hide();
        this.spr.graphics.clear();
        this.spr.touchChildren = false;
        this.spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMap, this);
        console.log("hide");
    }
}