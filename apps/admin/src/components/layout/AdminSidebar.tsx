import { 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  FileText,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Usuários', href: '/users', icon: Users },
  { name: 'Relatórios', href: '/reports', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Permissões', href: '/permissions', icon: Shield },
]

export function AdminSidebar() {
  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">
          Valorize Admin
        </h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  )
}
