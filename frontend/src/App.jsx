import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'

import Dashboard from './components/pages/Dashboard'
import Plans from './components/pages/Plans'
import Discounts from './components/pages/Discounts'
import Subscriptions from './components/pages/Subscriptions'
import Analytics from './components/pages/Analytics'
import AuditLogs from './components/pages/AuditLogs'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Redirect root /admin to /dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Admin pages */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/plans" element={<Plans />} />
          <Route path="/admin/discounts" element={<Discounts />} />
          <Route path="/admin/subscriptions" element={<Subscriptions />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />

          {/* Optional: catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App;