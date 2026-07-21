import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChatPage } from '@/pages/ChatPage'
import { PromptPage } from '@/pages/PromptPage'
import { ReferencesPage } from '@/pages/ReferencesPage'
import { TimelinePage } from '@/pages/TimelinePage'
import { QueuePage } from '@/pages/QueuePage'
import { ServerStatusProvider } from '@/hooks/ServerStatusContext'
import { ReferenceSelectionProvider } from '@/hooks/ReferenceSelectionContext'
import { TimelineProvider } from '@/hooks/TimelineContext'
import { QueueProvider } from '@/hooks/QueueContext'
import { SettingsProvider } from '@/hooks/SettingsContext'

function LayoutWrapper() {
  return (
    <ServerStatusProvider>
      <SettingsProvider>
        <ReferenceSelectionProvider>
          <TimelineProvider>
            <QueueProvider>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </QueueProvider>
          </TimelineProvider>
        </ReferenceSelectionProvider>
      </SettingsProvider>
    </ServerStatusProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutWrapper />,
    children: [
      { index: true, element: <Navigate to="/chat" replace /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'prompt', element: <PromptPage /> },
      { path: 'references', element: <ReferencesPage /> },
      { path: 'timeline', element: <TimelinePage /> },
      { path: 'queues', element: <QueuePage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
