Page({
  data: {
    project: {
      name: 'Goodluck Graduation Demo',
      version: '0.1.0-demo',
      summary:
        'A mini-program frontend demo focused on communication practice workflows.',
    },
    items: [
      'Voice input and text confirmation flow',
      'Style selection and generated card display',
      'Daily album and favorites management',
    ],
  },

  onBack() {
    wx.navigateBack({ delta: 1 })
  },
})
