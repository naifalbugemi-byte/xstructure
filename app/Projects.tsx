import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  BarChart3, 
  Settings, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  MoreVertical,
  Edit,
  Trash2,
  Calendar
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function Projects() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  
  const projects = useQuery(api.projects.listUserProjects);
  const createProject = useMutation(api.projects.createProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDescription || undefined,
      });
      toast.success("Project created successfully!");
      setShowCreateModal(false);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject({ projectId: projectId as any });
      toast.success("Project deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter">Projects</h1>
              <p className="text-slate-300 mt-1 font-inter">Organize and manage your content projects</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center font-inter font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </header>

        <div className="p-8">
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="glass-morphism rounded-2xl p-6 border border-blue-500/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="relative">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 font-inter">{project.name}</h3>
                    <p className="text-slate-300 text-sm font-inter">{project.description || "No description"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-blue-400 mb-1">
                        <Eye className="w-4 h-4 mr-1" />
                      </div>
                      <p className="text-sm font-semibold text-white font-inter">{project.stats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 font-inter">Views</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-cyan-400 mb-1">
                        <Heart className="w-4 h-4 mr-1" />
                      </div>
                      <p className="text-sm font-semibold text-white font-inter">{project.stats.totalLikes.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 font-inter">Likes</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all text-center font-inter"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-inter">No Projects Yet</h3>
              <p className="text-slate-300 mb-8 max-w-md mx-auto font-inter">
                Create your first project to start organizing your content and tracking performance.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto font-inter font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-morphism rounded-2xl p-8 w-full max-w-md mx-4 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 font-inter">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-slate-400 font-inter"
                  placeholder="Enter project name..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2 font-inter">
                  Description (Optional)
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all text-white placeholder-slate-400 font-inter resize-none"
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-600 transition-colors font-inter"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all font-inter"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
