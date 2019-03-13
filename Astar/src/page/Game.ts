class Game extends wy.BaseSprite {
    constructor() {
        super();
    }
    public spr: egret.Sprite;
    public player: egret.Shape;
    public map: Astar.Map;
    public ceilSize: number;
    public ceilsNum: number;
    public mapRows: number;
    public mapCols: number;
    public unWalkableNum: number;
    public show() {
        super.show();

        this.ceilSize = 32;
        this.mapRows = 20;
        this.mapCols = 20;
        this.ceilsNum = 20 * 20;
        this.unWalkableNum = 100;

        this.spr = new egret.Sprite();
        this.spr.width = this.ceilSize * this.mapRows;
        this.spr.height = this.ceilSize * this.mapCols;
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
        this.player.graphics.drawCircle(0, 0, this.ceilSize / 2);
        this.player.graphics.endFill();
        this.player.x = Math.floor(Math.random() * this.mapRows) * this.ceilSize + this.ceilSize / 2;
        this.player.y = Math.floor(Math.random() * this.mapCols) * this.ceilSize + this.ceilSize / 2;
        this.spr.addChild(this.player);
    }

    /**
     * 创建一个网格地图，其中包含一组随机的不可行走节点。
     */
    public makeMap() {
        this.map = new Astar.Map(this.mapRows, this.mapCols);
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
                if (color != 16777215 && color != 0) console.log(`${color}`);

                let shape = new egret.Shape();
                shape.graphics.beginFill(color);
                shape.graphics.drawRect(0, 0, this.ceilSize, this.ceilSize);
                shape.graphics.endFill();
                shape.x = i * this.ceilSize;
                shape.y = j * this.ceilSize;
                this.spr.addChild(shape);
            }
        }
        this.addChild(this.player); // 调整层级，使player始终在最上层
    }

    /**
     * 处理地图上的点击事件
     */
    public onClickMap(e: egret.TouchEvent) {
        console.log("on click")
        // 设置起始点和终点，用于可视化
        var posX = Math.floor(e.stageX / this.ceilSize),
            posY = Math.floor(e.stageY / this.ceilSize);
        this.map.setEndNode(posX, posY);

        posX = Math.floor(this.player.x / this.ceilSize);
        posY = Math.floor(this.player.y / this.ceilSize);
        this.map.setStartNode(posX, posY);

        this.drawMap();
    }

    /**
     * 根据给定的节点状态确定其颜色 
     */
    public getColor(x: number, y: number): number {
        let node: Astar.Node = this.map.getNode(x, y);
        if (!node.walkable) return 0;
        if (node == this.map.startNode) return 0xcccccc;
        if (node == this.map.endNode) return 0xcccccc;
        return 0xffffff;
    }

    
    public hide() {
        super.hide();
        this.spr.graphics.clear();
        this.spr.touchChildren = false;
        this.spr.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMap, this);
        console.log("hide");
    }
}