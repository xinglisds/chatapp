import NextAuth from "next-auth/next"; // ✅ 为 App Router 正确导入
import { authOptions } from "@/utils/authOptions"; // ✅ 从 utils 中导入 authOptions

// ✅ 定义处理函数
const handler = NextAuth(authOptions);

// ✅ 只导出 GET 和 POST 方法，避免类型冲突
export { handler as GET, handler as POST };