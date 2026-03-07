Page({
  data: {
    sections: [
      {
        title: '短句表达',
        desc: '尽量用简短、清晰的句子表达，每次只传递一个核心意思。',
      },
      {
        title: '场景化练习',
        desc: '在吃饭、游戏、睡前等固定场景中反复练习，帮助孩子建立稳定理解。',
      },
      {
        title: '及时鼓励',
        desc: '孩子完成回应后马上给出积极反馈，强化沟通意愿和信心。',
      },
    ],
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },
})
