import { ConfigProvider } from 'antd'
import { themes } from '../lib/theme'

export default function AdminThemeProvider({ children }) {
  return (
    <ConfigProvider theme={themes.admin.antd}>
      <div className="admin-theme min-h-screen">
        {children}
      </div>
    </ConfigProvider>
  )
}
