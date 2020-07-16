export function toElement(svgString) {
  let parser = new DOMParser()
  let xmlText = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1">${svgString}
  </svg>`
  let documentElement = parser.parseFromString(xmlText, "text/xml").documentElement
  let xmlBody = documentElement.firstChild
  //copy node*
  return document.importNode(xmlBody, true)
}

export function attrstringify(attrJson = {}) {
  let queryArr = [];
  for (let k in attrJson) {
    queryArr.push(k + "=" + `"${attrJson[k]}"`);
  }
  return queryArr.join(" ");
}

export function attrtoSvg(svgDom, attrJson = {}) {
  if (svgDom) {
    for (let k in attrJson) {
      svgDom.setAttribute(`${k}`, attrJson[k])
    }
  }
}

export default {
  toElement, attrtoSvg, attrstringify
}

if (module && module.exports) {
  module.exports = toElement
}