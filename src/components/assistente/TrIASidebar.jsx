import { Plus, MessageSquare, Settings, HelpCircle } from 'lucide-react';

export default function TrIASidebar({ isOpen, conversations, activeConversationId, onSelectConversation, onNewConversation, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1A1208]/70 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative w-64 h-screen bg-[#130D06]
        border-r border-orange-900/30 flex flex-col z-40
        transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-orange-900/30">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-orange-700 rounded-pill text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-brand"
          >
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-1">
            {conversations.map(convo => (
              <button
                key={convo.id}
                onClick={() => onSelectConversation(convo.id)}
                className={`w-full text-left p-3 rounded-brand-sm transition-all ${
                  activeConversationId === convo.id
                    ? 'bg-orange-500/20 text-[#F2DEC4] border border-orange-500/40'
                    : 'text-[#C8A882] hover:bg-orange-900/20 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{convo.name}</p>
                    <p className="text-xs text-[#8A6A4A] truncate">{convo.preview}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-orange-900/30 space-y-1">
          <button className="w-full flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#F2DEC4] transition-colors py-2 px-3 rounded-brand-sm hover:bg-orange-900/20">
            <Settings className="w-4 h-4" />
            Configurações
          </button>
          <button className="w-full flex items-center gap-2 text-sm text-[#8A6A4A] hover:text-[#F2DEC4] transition-colors py-2 px-3 rounded-brand-sm hover:bg-orange-900/20">
            <HelpCircle className="w-4 h-4" />
            Ajuda
          </button>
        </div>
      </div>
    </>
  );
}