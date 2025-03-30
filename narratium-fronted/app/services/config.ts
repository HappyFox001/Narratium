// API基础URL
export const API_BASE_URL = 'http://localhost:8000';

// 开发模式配置
export const DEV_MODE = true; // 设置为true可以绕过Google认证，仅用于本地开发

// Google OAuth配置
// 要获取真实的Google Client ID，请访问 https://console.cloud.google.com/apis/credentials
// 1. 创建一个新项目或选择现有项目
// 2. 在"凭据"页面，点击"创建凭据" > "OAuth客户端ID"
// 3. 选择"Web应用"类型
// 4. 添加授权的JavaScript来源（例如：http://localhost:3000）
// 5. 添加授权的重定向URI（例如：http://localhost:3000/auth/callback/google）
// 6. 点击"创建"，然后复制生成的客户端ID
export const GOOGLE_CLIENT_ID = 'your-google-client-id';
export const GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/callback/google';
