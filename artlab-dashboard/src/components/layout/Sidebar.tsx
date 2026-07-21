import { NavLink } from 'react-router-dom'
import { MessageSquare, ScrollText, Image, Clock, ListOrdered } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/prompt', label: 'Prompt', icon: ScrollText },
  { to: '/references', label: 'References', icon: Image },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/queues', label: 'Queues', icon: ListOrdered },
]

export function Sidebar() {
  return (
    <aside className="w-60 bg-surface-raised border-r border-surface-border flex flex-col shrink-0">
      <div className="h-12 flex items-center px-4 border-b border-surface-border">
        <span className="text-sm font-bold text-text-primary tracking-wide">ArtLab</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-surface-border">
        <span className="text-xs text-text-muted">ArtLab Dashboard v0.1</span>
      </div>
    </aside>
  )
}
