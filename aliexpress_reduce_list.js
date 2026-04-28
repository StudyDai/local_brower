const axios = require("axios")
const fs = require('fs')

const path = require("path")
let url = 'https://i.kickstarter.com/assets/052/791/122/73813fabd0b35806db6d13d224658b93_original.gif?fit=scale-down&origin=ugc&q=92&v=1772443871&width=680&sig=MB%2B0M5lNmy2ViEnFSJ0Bq46Um97udtxlvhg0iSxcTUI%3D'

axios({
  url,
  method: 'get',
  responseType: 'arraybuffer'
}).then(res => {
  fs.writeFileSync(path.resolve(__dirname, 'uploads/downloaded9.gif'), res.data)
})
