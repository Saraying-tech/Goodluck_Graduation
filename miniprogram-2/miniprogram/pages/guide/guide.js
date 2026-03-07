Page({
  data: {
    sections: [
      {
        title: 'Talk in short sentences',
        desc: 'Use short and clear phrases, then repeat with stable keywords.',
      },
      {
        title: 'Use daily routines',
        desc: 'Practice in meals, play time, and bedtime for predictable context.',
      },
      {
        title: 'Positive feedback',
        desc: 'Give immediate encouragement after each successful response.',
      },
    ],
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },
})
