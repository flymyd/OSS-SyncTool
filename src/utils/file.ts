// 添加一个简单的备选哈希函数
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

export const getFileHash = async (file: File): Promise<string> => {
  try {
    // 检查 crypto.subtle 是否可用
    if (window.crypto && window.crypto.subtle) {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
    
    // 如果 crypto.subtle 不可用，使用备选方案
    const timestamp = Date.now();
    const fileInfo = `${file.name}-${file.size}-${timestamp}`;
    return simpleHash(fileInfo);
    
  } catch (error) {
    console.error('获取文件哈希失败:', error);
    // 生成一个基于文件名、大小和时间戳的备选哈希
    const timestamp = Date.now();
    const fileInfo = `${file.name}-${file.size}-${timestamp}`;
    return simpleHash(fileInfo);
  }
}; 