/**
 * @param 要查询的DOM元素
 * @return {Object} DOM所有父级的偏移量对象
 */
export default (dom, cache) => {
  if (!dom) return new Error('参数不能为空')
  if (dom.nodeType !== 1) return new Error('非元素节点')
  if (window.offsetObject && cache) {
    console.log('返回缓存')
    return window.offsetObject
  }
  let offset = {
    offsetLeft: 0,
    offsetTop: 0,
  }
  while (dom.tagName !== 'BODY') {
    const { marginTop, marginLeft } = window.getComputedStyle(dom)
    offset.offsetLeft += dom.offsetLeft + parseInt(marginLeft) / 2
    offset.offsetTop += dom.offsetTop + parseInt(marginTop) / 2
    dom = dom.parentNode
  }
  window.offsetObject = offset
  return offset
}
