Page({
  data: {
    project: {
      name: '毕业设计前端演示',
      version: 'v0.1.0-demo',
      summary: '这是一个聚焦亲子沟通训练流程的微信小程序前端 Demo。',
    },
    items: [
      '语音输入与文本确认流程',
      '风格选择与生成结果展示',
      '日常画册与收藏管理流程',
    ],
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },
})
