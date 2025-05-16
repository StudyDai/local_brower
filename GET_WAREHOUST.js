const fs = require('fs')
const path = require('path')
// 下载面单需要有cookie 否则无法拿到面单的数据
fetch('https://agentseller-us.temu.com/pkg-label-u/41da23d5/50e9b9ec-ffc6-490f-a9c2-28dc72dca7b7.pdf?signASM=q-sign-algorithm%3Dsha1%26q-ak%3D9dxqhKoxrDedVkQVjgtbe6TmRGr2UEwY%26q-sign-time%3D1744791459%3B1744792059%26q-key-time%3D1744791459%3B1744792059%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D224d6f682f6a9b2b6be553cd5be8e905f59fdb92', {
    method: 'get',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Cookie': 'api_uid=Cmzccmf4tRh/kABf8OvpAg==; _bee=ytPRALa0VdVy3xzFhGMgT6Oaci8nYanc; njrpl=ytPRALa0VdVy3xzFhGMgT6Oaci8nYanc; dilx=bu5k1109wj8jjuxFpxPz9; hfsc=L3yOfIo16zv72pPKfQ==; _nano_fp=XpmYn0Xyn09yX5XYnC_l5U8a82iUG8zYg2cT5nbj; timezone=Asia%2FShanghai; webp=1; region=0; seller_temp=N_eyJ0IjoiMndyUzdYMGN1WW9aUHh6ZWFnSFlrNVg1TEVIZE5OT1RZSlJFN3pOMnV1QVNKRjFzZlBRVENPNHE3Rkd4THVJTnlxTEtzWi93bVNBcXRtR21LaDFKS0E9PSIsInYiOjEsInMiOjEwMDAxLCJ1IjoyMzI2NjkyNzIzNzkyNX0=; mallid=634418216727802; gmp_temu_token=fMDM3vgsaw6yNmcxZaerN45uPRP/JzukywM2mThQkgu0jIC/GtChIcw8Elg/5ztg/IBjQsujrqLjYa53KhjX9pbrAXK/NmcfBpYO5n+WglFLfeS0zWFWv482Nofs+oSCnupZX8o3nGoz+aa1cm6xSMhpJD4+KnWZEfrEppsesyc; __cf_bm=SP_v4XpKh1Y3jadEmk8CuryiDzWTbUDpEBm9bfbu.9M-1744789582-1.0.1.1-BscjcQfGr7L7QGzu0S28NZ9gwKcGXfCDs1P8LbvA9ntfeAFpLRCbl_.POhDnXxCFdNJ4HhocbcJr5aUdomE2j_coabZ4BHo8PJbKJBDZCUg'
    }
}).then(res => res.arrayBuffer()).then(res => {
    // 根据二进制创建url
    const buffer = Buffer.from(res);
    const filePath = path.resolve(__dirname, './02.pdf');
    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.error('保存文件时出错:', err);
        } else {
            console.log('文件保存成功');
        }
    })
})