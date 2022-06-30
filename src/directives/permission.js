function checkArray(arr) {
  const permit = 'editor'
  return arr.includes(permit)
}

const permission = {
  mounted: function(el, binding) {
    // 获取到 v-permission的值
    const permission = binding.value
    if (permission) {
      const hasPermission = checkArray(permission)
      if (!hasPermission) {
        // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}

export default permission
