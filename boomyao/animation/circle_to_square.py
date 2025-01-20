from manim import *

圆形 = Circle
正方形 = Square
蓝色 = BLUE
绿色 = GREEN

def 定义图形(图形, 颜色, 填充透明度):
    return 图形(color=颜色, fill_opacity=填充透明度)

# 用manim制作动画：圆变正方形
class 圆变正方形(Scene):
    def construct(self):
        圆形1 = 定义图形(圆形, 颜色=蓝色, 填充透明度=0.5)
        正方形1 = 定义图形(正方形, 颜色=绿色, 填充透明度=0.8)
        self.展示创建图形(圆形1)
        self.停顿一会()
        self.展示变换图形(圆形1, 正方形1)
        self.停顿一会()

    def 展示创建图形(self, 图形,):
        self.play(Create(图形))

    def 展示变换图形(self, 图形1, 图形2):
        self.play(Transform(图形1, 图形2))

    def 播放(self, 动画, 时间, 平滑=smooth):
        self.play(动画, run_time=时间, rate_func=平滑)

    def 停顿一会(self):
        self.wait()

if __name__ == "__main__":
    # 使用 tempconfig 临时配置渲染设置
    # quality: 设置渲染质量为中等质量
    # preview: 设置为 True 表示渲染完成后自动预览
    with tempconfig({"quality": "medium_quality", "preview": True}):
        # 创建场景实例
        场景 = 圆变正方形()
        # 渲染动画
        场景.render()
