import { useState, useRef, useEffect } from "react";
import { 
  Users,
  UserPlus,
  Shield,
  Edit3,
  Crown,
  Check,
  MoreVertical,
  MessageCircle,
  Send,
  Hash
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function Team() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'publisher'>('editor');
  const [activeTab, setActiveTab] = useState<'members' | 'chat'>('members');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat queries and mutations
  const chatMessages = useQuery(api.teams.getTeamChatMessages);
  const sendMessage = useMutation(api.teams.sendTeamChatMessage);
  const profile = useQuery(api.profiles.getCurrentProfile);

  const handleInviteTeamMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage({ content: newMessage });
      setNewMessage('');
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatMessageTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'editor' as const,
      status: 'active' as const,
      joinedAt: Date.now() - 86400000 * 30,
      avatar: null
    },
    {
      id: '2', 
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'publisher' as const,
      status: 'pending' as const,
      joinedAt: Date.now() - 86400000 * 7,
      avatar: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter flex items-center">
                <Users className="w-8 h-8 mr-3 text-blue-400" />
                Team Management
              </h1>
              <p className="text-slate-300 mt-1 font-inter">
                Manage your team members and communicate in real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-3 py-2 rounded-md font-inter text-sm ${
                    activeTab === 'members' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-2 rounded-md font-inter text-sm ${
                    activeTab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Chat
                </button>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-inter font-semibold flex items-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Invite Member
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {activeTab === 'members' && (
            <>
              {/* Team Overview */}
              <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white font-inter">Team Members</h2>
                  <p className="text-slate-400 font-inter">Current team: {teamMembers.length} members</p>
                </div>

                {/* Team Members List */}
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium font-inter">{member.name}</h3>
                          <p className="text-slate-400 text-sm font-inter">{member.email}</p>
                          <p className="text-slate-500 text-xs font-inter">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 capitalize font-inter">{member.role}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {member.status}
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors p-2">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Permissions */}
              <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-white mb-6 font-inter">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-white font-medium font-inter flex items-center">
                      <Edit3 className="w-5 h-5 mr-3 text-blue-400" />
                      Editor
                    </h4>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Create and edit content
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Access AI tools
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        View analytics
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Collaborate on projects
                      </li>
                      <li className="flex items-center text-slate-500">
                        ❌ Publish content
                      </li>
                      <li className="flex items-center text-slate-500">
                        ❌ Manage team
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-medium font-inter flex items-center">
                      <Crown className="w-5 h-5 mr-3 text-purple-400" />
                      Publisher
                    </h4>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        All Editor permissions
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Publish content
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Schedule posts
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 mr-3 text-green-400" />
                        Manage content approval
                      </li>
                      <li className="flex items-center text-slate-500">
                        ❌ Manage team
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Team Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{teamMembers.length}</div>
                  <div className="text-slate-400 font-inter">Total Members</div>
                </div>
                <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-slate-400 font-inter">Active Members</div>
                </div>
                <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {teamMembers.filter(m => m.status === 'pending').length}
                  </div>
                  <div className="text-slate-400 font-inter">Pending Invites</div>
                </div>
              </div>
            </>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="glass-morphism rounded-2xl border border-slate-700/50 h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center">
                  <Hash className="w-6 h-6 text-blue-400 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-white font-inter">Team Chat</h2>
                    <p className="text-slate-400 font-inter">Global team communication</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages && chatMessages.length > 0 ? (
                  chatMessages.map((message) => (
                    <div key={message._id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {message.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium font-inter">{message.userName}</span>
                          <span className="text-slate-500 text-xs font-inter">
                            {formatMessageTime(message._creationTime)}
                          </span>
                        </div>
                        <p className="text-slate-300 font-inter">{message.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-400 mb-2 font-inter">No messages yet</h3>
                      <p className="text-slate-500 font-inter">Start the conversation with your team!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-slate-700/50">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-slate-400 font-inter"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-inter font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-morphism rounded-2xl border border-slate-700/50 p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-white mb-4 font-inter">Invite Team Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 font-inter">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-slate-400 font-inter"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 font-inter">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'editor' | 'publisher')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white font-inter"
                  >
                    <option value="editor">Editor</option>
                    <option value="publisher">Publisher</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all font-inter font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInviteTeamMember}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all font-inter font-semibold"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
