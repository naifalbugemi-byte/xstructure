import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Reply, 
  MoreVertical,
  Users,
  Settings,
  Plus,
  Bot,
  Command,
  Calendar,
  Palette,
  FileText,
  MessageSquare,
  Check,
  X,
  Crown,
  Edit,
  Trash2
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  projectId: Id<"projects">;
  userId: Id<"users">;
  content: string;
  replyTo?: Id<"messages">;
  fileId?: Id<"_storage">;
  fileName?: string;
  reactions: Record<string, Id<"users">[]>;
  isEdited: boolean;
  user: any;
  profile: any;
  name: string;
  replyToMessage?: any;
}

interface TeamMember {
  _id: string;
  _creationTime: number;
  projectId: Id<"projects">;
  userId: Id<"users">;
  role: "creator" | "editor" | "publisher" | "owner";
  invitedBy: Id<"users">;
  joinedAt: number;
  user: any;
  profile: any;
  name: string;
  email: string;
}

export default function ProjectChat() {
  const { id } = useParams<{ id: string }>();
  const projectId = id as Id<"projects">;
  
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showAgentPanel, setShowAgentPanel] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Queries
  const project = useQuery(api.projects.getProject, { projectId });
  const messages = useQuery(api.chat.getMessages, {
    projectId,
    paginationOpts: { numItems: 50, cursor: null }
  });
  const teamMembers = useQuery(api.teams.getProjectTeam, { projectId });
  const typingUsers = useQuery(api.chat.getTypingUsers, { projectId });
  const pendingApprovals = useQuery(api.teams.getPendingApprovals, { projectId });

  // Mutations
  const sendMessage = useMutation(api.chat.sendMessage);
  const addReaction = useMutation(api.chat.addReaction);
  const updateTyping = useMutation(api.chat.updateTyping);
  const executeAgentCommand = useAction(api.aiAgent.executeAgentCommand);
  const handleApproval = useMutation(api.projects.handleApproval);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    updateTyping({ projectId, isTyping: true });
    
    if (typingTimeout) clearTimeout(typingTimeout);
    
    const timeout = setTimeout(() => {
      updateTyping({ projectId, isTyping: false });
    }, 3000);
    
    setTypingTimeout(timeout);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        projectId,
        content: message,
        replyTo: replyTo?._id,
      });
      
      setMessage("");
      setReplyTo(null);
      updateTyping({ projectId, isTyping: false });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleReaction = async (messageId: Id<"messages">, emoji: string) => {
    try {
      await addReaction({ messageId, emoji });
      setShowEmojiPicker(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAgentCommand = async (command: string, context?: string) => {
    try {
      setShowAgentPanel(false);
      toast.loading("AI Agent is working...");
      
      await executeAgentCommand({
        projectId,
        command,
        context,
      });
      
      toast.dismiss();
      toast.success("AI Agent completed the task!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  const handleApprovalAction = async (approvalId: Id<"approvals">, action: "approve" | "reject") => {
    try {
      await handleApproval({ approvalId, action });
      toast.success(`Request ${action}d successfully`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-2 text-sm text-slate-400">
                <Link href="/projects" className="hover:text-white transition-colors">
                  Projects
                </Link>
                <span>/</span>
                <Link href={`/projects/${projectId}`} className="hover:text-white transition-colors">
                  {project.name}
                </Link>
                <span>/</span>
                <span className="text-white">Chat & Team</span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {teamMembers?.slice(0, 3).map((member) => (
                  <div
                    key={member.userId}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    title={member.name}
                  >
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                ))}
                {teamMembers && teamMembers.length > 3 && (
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs">
                    +{teamMembers.length - 3}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Invite
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Pending Approvals */}
              {pendingApprovals && pendingApprovals.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                  <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
                    <Bot className="w-4 h-4 mr-2" />
                    Pending Approvals ({pendingApprovals.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingApprovals.map((approval) => (
                      <div key={approval._id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <p className="text-white text-sm">{approval.type} approval requested</p>
                          <p className="text-slate-400 text-xs">
                            {new Date(approval._creationTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprovalAction(approval._id, "approve")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApprovalAction(approval._id, "reject")}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {messages?.page.map((msg) => (
                <div key={msg._id} className="group">
                  {msg.replyToMessage && (
                    <div className="ml-12 mb-1 text-xs text-slate-400 bg-slate-800/30 rounded-lg p-2 border-l-2 border-blue-500">
                      <span className="font-semibold">{msg.replyToMessage.name}:</span> {msg.replyToMessage.content.substring(0, 100)}...
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {msg.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white">{msg.name}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg._creationTime).toLocaleTimeString()}
                        </span>
                        {msg.isEdited && (
                          <span className="text-xs text-slate-500">(edited)</span>
                        )}
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-lg p-3 max-w-2xl">
                        <p className="text-slate-200 whitespace-pre-wrap">{msg.content}</p>
                        
                        {msg.fileId && (
                          <div className="mt-2 p-2 bg-slate-700/50 rounded border">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-300">{msg.fileName}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Reactions */}
                      {Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg._id, emoji)}
                              className="bg-slate-700/50 hover:bg-slate-700 rounded-full px-2 py-1 text-xs flex items-center space-x-1 transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-slate-300">{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <button
                        onClick={() => setReplyTo(msg)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}
                          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                          title="Add reaction"
                        >
                          <Smile className="w-4 h-4" />
                        </button>
                        
                        {showEmojiPicker === msg._id && (
                          <div className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg p-2 flex space-x-1 z-10">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(msg._id, emoji)}
                                className="hover:bg-slate-700 rounded p-1 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <button className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {typingUsers && typingUsers.length > 0 && (
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>
                    {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Preview */}
            {replyTo && (
              <div className="px-6 py-2 bg-slate-800/50 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Reply className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Replying to</span>
                    <span className="text-white font-semibold">{replyTo.name}</span>
                    <span className="text-slate-400">:</span>
                    <span className="text-slate-300">{replyTo.content.substring(0, 50)}...</span>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-6 border-t border-slate-700">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={messageInputRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Team Panel */}
          <div className="w-80 border-l border-slate-700 bg-slate-900/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team ({teamMembers?.length || 0})
                </h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {teamMembers?.map((member) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white">{member.name}</p>
                          {(member.role as string) === 'owner' && (
                            <Crown className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400">{member.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            (member.role as string) === 'owner' ? 'bg-yellow-500/20 text-yellow-400' :
                            member.role === 'creator' ? 'bg-green-500/20 text-green-400' :
                            member.role === 'editor' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {(member.role as string) !== 'owner' && (
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-slate-400 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Role Descriptions */}
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
                <h3 className="text-sm font-semibold text-white mb-3">Role Permissions</h3>
                <div className="space-y-2 text-xs text-slate-400">
                  <div><span className="text-green-400">Creator:</span> Create assets</div>
                  <div><span className="text-blue-400">Editor:</span> Edit assets & schedules</div>
                  <div><span className="text-purple-400">Publisher:</span> Schedule & publish content</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent FAB */}
        <div className="fixed bottom-6 right-6">
          <div className="relative">
            {showAgentPanel && (
              <div className="absolute bottom-16 right-0 w-80 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-blue-400" />
                    AI Agent
                  </h3>
                  <button
                    onClick={() => setShowAgentPanel(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleAgentCommand("/suggest")}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <MessageSquare className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">Suggest Content</p>
                      <p className="text-slate-400 text-sm">Generate captions & hashtags</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAgentCommand("/summary")}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Chat Summary</p>
                      <p className="text-slate-400 text-sm">Summarize recent discussion</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAgentCommand("/schedule")}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Create Schedule</p>
                      <p className="text-slate-400 text-sm">Generate posting schedule</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAgentCommand("/brand")}
                    className="w-full flex items-center space-x-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-left"
                  >
                    <Palette className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-white font-medium">Apply Branding</p>
                      <p className="text-slate-400 text-sm">Generate brand guidelines</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setShowAgentPanel(!showAgentPanel)}
              className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Bot className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

// Invite Modal Component
function InviteModal({ projectId, onClose }: { projectId: Id<"projects">; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"creator" | "editor" | "publisher">("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inviteTeamMember = useMutation(api.teams.inviteTeamMember);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await inviteTeamMember({
        projectId,
        email: email.trim(),
        role,
      });
      
      toast.success("Team member invited successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-400"
              placeholder="colleague@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
            >
              <option value="creator">Creator - Can create assets</option>
              <option value="editor">Editor - Can edit assets & schedules</option>
              <option value="publisher">Publisher - Can schedule & publish</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!email.trim() || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
