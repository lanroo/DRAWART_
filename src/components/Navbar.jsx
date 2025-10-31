export default function Navbar({ onUndo, onRedo, canUndo, canRedo, onDelete, onShare, onDownload }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl">
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              className="h-12 w-auto drop-shadow-lg" 
              alt="DrawArt Logo" 
            />
            <div className="hidden sm:block border-l border-slate-600 pl-4">
              <h1 className="text-xl font-bold text-white">
                DrawArt
              </h1>
              <p className="text-xs text-slate-400">Paint Profissional</p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {/* Botões de Ação Compactos */}
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-slate-700/50">
              <ToolButton
                onClick={canUndo ? onUndo : undefined}
                disabled={!canUndo}
                title="Desfazer (Ctrl+Z)"
                variant="icon"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                }
              />
              <ToolButton
                onClick={canRedo ? onRedo : undefined}
                disabled={!canRedo}
                title="Refazer (Ctrl+Y)"
                variant="icon"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                  </svg>
                }
              />
            </div>

            <div className="h-8 w-px bg-slate-600"></div>

            <ToolButton
              onClick={onDelete}
              title="Limpar Canvas"
              variant="danger"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            />

            <ToolButton
              onClick={onShare}
              title="Compartilhar"
              variant="secondary"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
            />

            <button
              onClick={() => onDownload('png')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 border border-blue-400/30"
              title="Download (Ctrl+S)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Baixar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function ToolButton({ onClick, disabled, title, icon, variant = 'default' }) {
  const baseStyles = "w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 font-medium"
  
  const variants = {
    default: disabled 
      ? "text-slate-500 cursor-not-allowed bg-slate-800/30 border border-slate-700/30" 
      : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg active:scale-95 border border-slate-600/50 bg-slate-800/30",
    icon: disabled
      ? "text-slate-600 cursor-not-allowed"
      : "text-slate-300 hover:text-white hover:bg-slate-700/50 active:scale-95",
    secondary: "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg active:scale-95 border border-slate-600/50 bg-slate-800/30",
    danger: "text-red-400 hover:bg-red-900/30 hover:text-red-300 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 border border-red-800/30 bg-slate-800/30"
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {icon}
    </button>
  )
}
