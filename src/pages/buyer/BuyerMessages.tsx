import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import Layout from '../../components/Layout'

export default function BuyerMessages() {
  const { currentUser, data, getConversationsForUser, getMessagesForConversation, sendMessage, markConversationRead, selectedConversationUserId, setSelectedConversationUserId } = useApp()
  const [messageText, setMessageText] = useState('')
  const [newMessageTo, setNewMessageTo] = useState('')
  const [showNewConv, setShowNewConv] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  if (!currentUser) return null

  const conversations = getConversationsForUser(currentUser.id)
  const selectedConv = conversations.find(c => c.otherUser.id === selectedConversationUserId)
  const messages = selectedConv ? getMessagesForConversation(selectedConv.id) : []

  const farmers = data.users.filter(u => u.role === 'farmer')

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

  const startConversation = (farmerId: string) => {
    setSelectedConversationUserId(farmerId)
    setShowNewConv(false)
  }

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
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
          <button className="btn-primary btn-sm" onClick={() => setShowNewConv(!showNewConv)}>
            + New Message
          </button>
        </div>

        {showNewConv && (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h4 style={{ fontFamily: 'Nunito', fontWeight: 700, marginBottom: 12, color: 'var(--forest)' }}>Message a Farmer</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {farmers.map(f => (
                <button key={f.id} className="btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => startConversation(f.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {f.name} · {f.address}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ display: 'flex', height: 540, overflow: 'hidden' }}>
          {/* Conversation list */}
          <div style={{ width: 260, borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: 16, borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, color: 'var(--forest)' }}>
              Conversations
            </div>
            {conversations.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <svg width="32" height="32" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="14" fill="#34C759"/><path d="M14 20C14 17.8 15.8 16 18 16H42C44.2 16 46 17.8 46 20V34C46 36.2 44.2 38 42 38H26L19 44V38H18C15.8 38 14 36.2 14 34V20Z" fill="white"/></svg>
                </div>
                <p>No conversations yet.</p>
                <p style={{ marginTop: 4 }}>Click "+ New Message" to contact a farmer!</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationUserId(conv.otherUser.id)}
                  style={{
                    padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                    background: selectedConversationUserId === conv.otherUser.id ? '#F0FDF4' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', background: 'var(--forest)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, flexShrink: 0
                    }}>
                      {conv.otherUser.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{conv.otherUser.name}</span>
                        {conv.unreadCount > 0 && (
                          <span style={{ background: 'var(--leaf)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.lastMessage}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!selectedConversationUserId ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', flexDirection: 'column', gap: 12 }}>
                <svg width="56" height="56" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="14" fill="#34C759"/><path d="M14 20C14 17.8 15.8 16 18 16H42C44.2 16 46 17.8 46 20V34C46 36.2 44.2 38 42 38H26L19 44V38H18C15.8 38 14 36.2 14 34V20Z" fill="white"/></svg>
                <p style={{ fontSize: 14 }}>Select a conversation to chat with a farmer</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--forest)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {(selectedConv || { otherUser: data.users.find(u => u.id === selectedConversationUserId) })?.otherUser?.name.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {selectedConv?.otherUser.name ?? data.users.find(u => u.id === selectedConversationUserId)?.name ?? 'Farmer'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {selectedConv?.otherUser.address ?? data.users.find(u => u.id === selectedConversationUserId)?.address ?? ''}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, paddingTop: 20 }}>
                      No messages yet. Send a message to start the conversation!
                    </div>
                  )}
                  {messages.map(msg => {
                    const isSent = msg.senderId === currentUser.id
                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        <div className={isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}>
                          {msg.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{formatTime(msg.createdAt)}</div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <input className="input-field" placeholder="Type a message..." value={messageText} onChange={e => setMessageText(e.target.value)} style={{ flex: 1 }} />
                  <button type="submit" className="btn-primary" disabled={!messageText.trim()}>Send</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
