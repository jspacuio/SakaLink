import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

export default function FarmerMessages() {
  const { currentUser, getConversationsForUser, getMessagesForConversation, sendMessage, markConversationRead, selectedConversationUserId, setSelectedConversationUserId } = useApp()
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  if (!currentUser) return null
  const conversations = getConversationsForUser(currentUser.id)
  const selectedConv = conversations.find(c => c.otherUser.id === selectedConversationUserId)
  const messages = selectedConv ? getMessagesForConversation(selectedConv.id) : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  useEffect(() => {
    if (selectedConv) markConversationRead(selectedConv.id)
  }, [selectedConversationUserId, messages.length])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversationUserId) return
    sendMessage(selectedConversationUserId, messageText)
    setMessageText('')
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Today'
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  }

  return (
    <Layout title="Messages">
      <div style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h2 className="page-title">Messages</h2>
        </div>

        <div className="card" style={{ display: 'flex', height: 560, overflow: 'hidden' }}>
          {/* Conversation list */}
          <div style={{ width: 280, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, color: 'var(--forest)' }}>
              Conversations ({conversations.length})
            </div>
            {conversations.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <svg width="36" height="36" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="60" rx="14" fill="#34C759"/>
                    <path d="M14 20C14 17.8 15.8 16 18 16H42C44.2 16 46 17.8 46 20V34C46 36.2 44.2 38 42 38H26L19 44V38H18C15.8 38 14 36.2 14 34V20Z" fill="white"/>
                  </svg>
                </div>
                <p style={{ marginTop: 4 }}>No conversations yet</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationUserId(conv.otherUser.id)}
                  style={{
                    padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                    background: selectedConversationUserId === conv.otherUser.id ? '#F0FDF4' : 'white',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: 'var(--forest)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 16, flexShrink: 0
                    }}>
                      {conv.otherUser.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)' }}>{conv.otherUser.name}</span>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            background: 'var(--leaf)', color: 'white', borderRadius: '50%',
                            width: 18, height: 18, fontSize: 10, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>{conv.unreadCount}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: 160 }}>
                        {conv.lastMessage}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {formatDate(conv.lastMessageAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!selectedConversationUserId || !selectedConv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', flexDirection: 'column', gap: 12 }}>
                <svg width="56" height="56" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="14" fill="#34C759"/>
                  <path d="M14 20C14 17.8 15.8 16 18 16H42C44.2 16 46 17.8 46 20V34C46 36.2 44.2 38 42 38H26L19 44V38H18C15.8 38 14 36.2 14 34V20Z" fill="white"/>
                </svg>
                <p style={{ fontSize: 14 }}>Select a conversation to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'white' }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', background: 'var(--forest)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 15
                  }}>
                    {selectedConv.otherUser.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedConv.otherUser.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {selectedConv.otherUser.role.charAt(0).toUpperCase() + selectedConv.otherUser.role.slice(1)} · {selectedConv.otherUser.address}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {messages.map(msg => {
                    const isSent = msg.senderId === currentUser.id
                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        <div className={isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}>
                          {msg.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <input
                    className="input-field"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }} disabled={!messageText.trim()}>
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
