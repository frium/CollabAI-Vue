/**
 * 生成图片的缩略图
 * @param {File} imageFile 输入的图片文件
 * @returns {Promise} 返回一个 Promise，成功时返回生成的图片缩略图 URL
 */
export function generateThumbnails(imageFile) {
  return new Promise((resolve, reject) => {
    // 使用 createImageBitmap() 将图片文件转为 ImageBitmap
    createImageBitmap(imageFile).then(imageBitmap => {
      const canvas = document.createElement('canvas');

      canvas.height = imageBitmap.height / 4;
      canvas.width = imageBitmap.width / 4;

      // 获取 canvas 上下文对象
      const ctx = canvas.getContext('2d')

      // 在 canvas 上绘制图片，调整大小为缩略图
      ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

      // 将 canvas 内容转换为 base64 格式的图片 URL
      const url = canvas.toDataURL('image/jpeg')


      // 如果生成的缩略图大小超过80KB，继续递归处理（调用 convertBase64UrlToBlob）
      if (url.length > 80 * 1024) {
        // 调用递归函数重新生成缩略图，直到图像尺寸合适
        generateThumbnails(convertBase64UrlToBlob(url)).then(res => {
          resolve(res)
        })
      } else {
        resolve(url)
      }
    }).catch((err) => {
      // 错误处理，如果图像生成失败，返回错误信息
      reject('缩略图生成失败：' + err)
    })
  })
}

/**
 * 将 base64 格式的图片 URL 转换为 Blob 对象
 * @param {string} base64 用 URL 方式表示的 base64 图片数据
 * @returns {Blob} 返回转换后的 Blob 对象
 */
function convertBase64UrlToBlob(base64) {
  // 分离 base64 的头部和实际的数据部分
  const arr = base64.split(',')

  // 获取 MIME 类型
  const mime = arr[0].match(/:(.*?);/)[1]

  // 解码 base64 数据
  const str = atob(arr[1])

  // 创建一个与 base64 数据长度相同的 Uint8Array 数组
  let n = str.length
  const u8arr = new Uint8Array(n)

  // 将 base64 字符串转换为字节数组
  while (n--) {
    u8arr[n] = str.charCodeAt(n)
  }

  // 返回 Blob 对象，指定 MIME 类型
  return new Blob([u8arr], { type: mime })
}
