const fs = require('fs')

const REGEX = /^([A-Z])*| |'|"|.|!|\?|\$|\w+$/gim

let total = 0
let invalid = 0

const iterate = (data, parent) => {
    for (const key in data) {
        total++
        if (typeof data[key] === 'string' && REGEX.test(data[key].trim())) {
            invalid++
            data[key] = parent + '.' + key
        }
        if (data[key] !== null && typeof data[key] === 'object') {
            data[key] = iterate(data[key], parent === '' ? key : parent + '.' + key)
        }
    }
    return data;
}

const main = () => {
    const langs = ['jp', 'kr', 'cn'];
    langs.forEach(lang => {
        const jp = require(`./${lang}.json`)
        const filtered = iterate(jp, '')

        if (fs.existsSync(`./${lang}.new.json`)) {
            fs.rmSync(`./${lang}.new.json`)
        }

        fs.writeFileSync(`./${lang}.new.json`, JSON.stringify(filtered))

        console.log('Invalid strings : ' + invalid + ' on total of ' + total + ' for lang ' + lang.toUpperCase())
    })
}

main()