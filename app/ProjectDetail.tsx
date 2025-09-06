import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  BarChart3,
  Image,
  Video,
  Calendar,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = useQuery(api.projects.getProject, { 
    projectId: id as any 
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.stats.totalLikes.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.stats.totalComments.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Shares</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project.stats.totalShares.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Share2 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assets */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Assets</h2>
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
                <p className="text-gray-600 mb-6">Start creating content for this project</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/studio/image"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Create Image
                  </Link>
                  <Link
                    to="/studio/video"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Create Video
                  </Link>
                </div>
              </div>
            </div>

            {/* Project Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto Post</p>
                    <p className="text-sm text-gray-600">Automatically publish content</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full ${project.settings.autoPost ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${project.settings.autoPost ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">AI Scheduling</p>
                    <p className="text-sm text-gray-600">Let AI optimize posting times</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full ${project.settings.aiScheduling ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${project.settings.aiScheduling ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Branding</p>
                    <p className="text-sm text-gray-600">Apply brand colors and fonts</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full ${project.settings.brandingEnabled ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${project.settings.brandingEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
