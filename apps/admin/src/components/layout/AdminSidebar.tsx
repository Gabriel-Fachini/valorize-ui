const navigation = [
  
  { name: 'Dashboard', href: '/', icon: 'ph ph-chart-bar' },
  { name: 'Usuários', href: '/users', icon: 'ph-users' },
  { name: 'Relatórios', href: '/reports', icon: 'ph-file-text' },
  { name: 'Configurações', href: '/settings', icon: 'ph-gear' },
  { name: 'Permissões', href: '/permissions', icon: 'ph-shield' },
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
                <i className={`${item.icon} mr-3 text-lg`} />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <i className="ph-sign-out mr-3 text-lg" />
          Sair
        </button>
      </div>
    </div>
  )
}
