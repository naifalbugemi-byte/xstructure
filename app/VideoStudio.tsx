import { useState, useRef } from "react";
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Download, 
  Scissors, 
  Volume2, 
  VolumeX,
  Settings,
  Layers,
  Type,
  Music,
  Image,
  Wand2,
  Sparkles,
  Clock,
  Zap,
  Filter,
  Palette,
  Move,
  RotateCw,
  Copy,
  Trash2,
  Save,
  Share2,
  Plus,
  Minus,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Camera,
  Mic,
  FileVideo,
  Blend,
  Crop,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Grid,
  Target,
  Sliders,
  Maximize,
  Minimize
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const videoTools = [
  { id: "trim", name: "Trim", icon: Scissors, description: "Cut video segments" },
  { id: "split", name: "Split", icon: Copy, description: "Split at playhead" },
  { id: "merge", name: "Merge", icon: Plus, description: "Combine clips" },
  { id: "speed", name: "Speed", icon: Zap, description: "Change playback speed" },
  { id: "reverse", name: "Reverse", icon: Rewind, description: "Reverse video" },
  { id: "crop", name: "Crop", icon: Crop, description: "Crop video frame" },
  { id: "rotate", name: "Rotate", icon: RotateCw, description: "Rotate video" },
  { id: "resize", name: "Resize", icon: Move, description: "Change dimensions" }
];

const aiEnhancements = [
  { id: "upscale", name: "AI Upscale", icon: Sparkles, description: "Enhance resolution", credits: 3 },
  { id: "stabilize", name: "Stabilize", icon: Target, description: "Remove camera shake", credits: 2 },
  { id: "denoise", name: "Denoise", icon: Filter, description: "Remove video noise", credits: 2 },
  { id: "colorgrade", name: "Auto Color", icon: Palette, description: "AI color grading", credits: 2 },
  { id: "slowmo", name: "AI Slow-Mo", icon: Clock, description: "Generate slow motion", credits: 3 },
  { id: "background", name: "Remove BG", icon: Eye, description: "Remove background", credits: 3 },
  { id: "enhance", name: "Enhance", icon: Wand2, description: "Overall enhancement", credits: 2 },
  { id: "restore", name: "Restore", icon: Sparkles, description: "Fix old videos", credits: 3 }
];

const videoTemplates = [
  { id: "promo", name: "Product Promo", duration: "15s", category: "marketing" },
  { id: "social", name: "Social Media", duration: "30s", category: "social" },
  { id: "story", name: "Instagram Story", duration: "15s", category: "social" },
  { id: "ad", name: "Video Ad", duration: "30s", category: "marketing" },
  { id: "tutorial", name: "Tutorial", duration: "60s", category: "education" },
  { id: "testimonial", name: "Testimonial", duration: "45s", category: "marketing" },
  { id: "explainer", name: "Explainer", duration: "90s", category: "business" },
  { id: "intro", name: "Channel Intro", duration: "10s", category: "branding" }
];

const effectsLibrary = [
  { id: "fade", name: "Fade In/Out", category: "transition" },
  { id: "slide", name: "Slide", category: "transition" },
  { id: "zoom", name: "Zoom", category: "transition" },
  { id: "blur", name: "Motion Blur", category: "effect" },
  { id: "glow", name: "Glow", category: "effect" },
  { id: "vintage", name: "Vintage", category: "filter" },
  { id: "cinematic", name: "Cinematic", category: "filter" },
  { id: "neon", name: "Neon", category: "effect" }
];

export default function VideoStudio() {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'enhance' | 'effects'>('create');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const profile = useQuery(api.profiles.getCurrentProfile);
  const generateVideo = useAction(api.ai.generateVideo);
  const addCredits = useMutation(api.profiles.addCredits);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success("Video uploaded successfully!");
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleAIGenerate = async (prompt: string) => {
    if (!profile || profile.credits < 5) {
      toast.error("Insufficient credits (5 required)");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await generateVideo({ 
        prompt,
        duration: 15,
        quality: "high"
      });
      setPreviewUrl(result.videoUrl);
      toast.success("Video generated successfully!");
    } catch (error) {
      toast.error("Failed to generate video");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIEnhancement = async (enhancementId: string) => {
    if (!selectedVideo || !profile) {
      toast.error("Please upload a video first");
      return;
    }

    const enhancement = aiEnhancements.find(e => e.id === enhancementId);
    if (!enhancement) return;

    if (profile.credits < enhancement.credits) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    try {
      // Mock processing - in real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Deduct credits
      await addCredits({
        amount: -enhancement.credits,
        description: `Applied ${enhancement.name} to video`,
      });
      
      toast.success(`${enhancement.name} applied successfully!`);
    } catch (error) {
      toast.error(`Failed to apply ${enhancement.name}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = videoTemplates.find(t => t.id === templateId);
    if (template) {
      toast.success(`${template.name} template selected`);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    toast.success("Video saved to project!");
  };

  const handleExport = () => {
    toast.success("Video export started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white font-inter flex items-center">
                <Video className="w-8 h-8 mr-3 text-purple-400" />
                AI Video Studio
              </h1>
              <p className="text-slate-300 mt-1 font-inter">
                Create, edit, and enhance videos with AI • Credits: {profile?.credits || 0}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={!previewUrl}
                className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-all font-inter font-semibold flex items-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleExport}
                disabled={!previewUrl}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-inter font-semibold flex items-center disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-120px)]">
          {/* Left Sidebar - Tools */}
          <div className="w-80 bg-slate-950/50 border-r border-blue-500/20 p-6 overflow-y-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 mb-6 bg-slate-800/50 rounded-lg p-1">
              {[
                { id: 'create', label: 'Create', icon: Sparkles },
                { id: 'edit', label: 'Edit', icon: Scissors },
                { id: 'enhance', label: 'AI Enhance', icon: Wand2 },
                { id: 'effects', label: 'Effects', icon: Filter }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center py-2 px-2 rounded-md transition-colors font-inter text-xs ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-3 h-3 mr-1" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Create Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                {/* Upload Section */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Upload Video</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-purple-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 font-inter">Click to upload video</p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>

                {/* Templates */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Video Templates</h3>
                  <div className="space-y-2">
                    {videoTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-white text-sm font-medium font-inter">{template.name}</p>
                          <span className="text-purple-400 text-xs font-inter">{template.duration}</span>
                        </div>
                        <p className="text-slate-400 text-xs font-inter capitalize">{template.category}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Generation */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">AI Video Generation</h3>
                  <div className="space-y-3">
                    <textarea
                      placeholder="Describe the video you want to create..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 font-inter text-sm resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => handleAIGenerate("professional product video")}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-inter font-semibold text-sm disabled:opacity-50"
                    >
                      {isProcessing ? 'Generating...' : 'Generate Video (5 credits)'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Tab */}
            {activeTab === 'edit' && (
              <div className="space-y-6">
                {/* Basic Tools */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Editing Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {videoTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          selectedTool === tool.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <tool.icon className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-white text-xs font-inter">{tool.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Tools */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Audio & Music</h3>
                  <div className="space-y-2">
                    <button className="w-full p-3 rounded-lg border border-slate-700 hover:border-slate-600 text-left">
                      <div className="flex items-center">
                        <Music className="w-5 h-5 text-green-400 mr-3" />
                        <div>
                          <p className="text-white text-sm font-inter">Add Background Music</p>
                          <p className="text-slate-400 text-xs font-inter">Choose from library</p>
                        </div>
                      </div>
                    </button>
                    <button className="w-full p-3 rounded-lg border border-slate-700 hover:border-slate-600 text-left">
                      <div className="flex items-center">
                        <Mic className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <p className="text-white text-sm font-inter">Record Voiceover</p>
                          <p className="text-slate-400 text-xs font-inter">Add narration</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Text & Graphics */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Text & Graphics</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <Type className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-inter">Add Text</p>
                    </button>
                    <button className="p-3 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <Image className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                      <p className="text-white text-xs font-inter">Add Image</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Enhance Tab */}
            {activeTab === 'enhance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">AI Enhancement Tools</h3>
                  <div className="space-y-3">
                    {aiEnhancements.map((enhancement) => (
                      <button
                        key={enhancement.id}
                        onClick={() => handleAIEnhancement(enhancement.id)}
                        disabled={isProcessing || !selectedVideo}
                        className="w-full p-3 rounded-lg border border-slate-700 hover:border-purple-500 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <enhancement.icon className="w-5 h-5 text-purple-400 mr-3" />
                            <span className="text-white font-medium font-inter">{enhancement.name}</span>
                          </div>
                          <span className="text-xs text-purple-400 font-inter">{enhancement.credits} credit{enhancement.credits > 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-inter">{enhancement.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Processing */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Batch Processing</h3>
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg text-green-400 font-inter text-sm">
                      Auto-Enhance All (5 credits)
                    </button>
                    <button className="w-full p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-purple-400 font-inter text-sm">
                      Professional Package (8 credits)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Visual Effects</h3>
                  <div className="space-y-3">
                    {effectsLibrary.map((effect) => (
                      <button
                        key={effect.id}
                        className="w-full p-3 rounded-lg border border-slate-700 hover:border-blue-500 text-left transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium font-inter">{effect.name}</span>
                          <span className="text-xs text-blue-400 font-inter capitalize">{effect.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transitions */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Transitions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <p className="text-white text-xs font-inter">Fade</p>
                    </button>
                    <button className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <p className="text-white text-xs font-inter">Slide</p>
                    </button>
                    <button className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <p className="text-white text-xs font-inter">Zoom</p>
                    </button>
                    <button className="p-2 rounded-lg border border-slate-700 hover:border-slate-600 text-center">
                      <p className="text-white text-xs font-inter">Wipe</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Preview */}
            <div className="flex-1 bg-slate-900/50 flex items-center justify-center p-8">
              {previewUrl ? (
                <div className="relative max-w-full max-h-full">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls={false}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                        <p className="text-white font-inter">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Video className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2 font-inter">No Video Selected</h3>
                  <p className="text-slate-500 font-inter">Upload a video or generate one with AI to get started</p>
                </div>
              )}
            </div>

            {/* Video Controls */}
            <div className="bg-slate-950/90 border-t border-blue-500/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    disabled={!previewUrl}
                    className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    disabled={!previewUrl}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex items-center space-x-2 text-slate-400 text-sm font-inter">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <SkipBack className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <SkipForward className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="text-slate-400 text-sm font-inter">|</span>
                  <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <Maximize className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-inter">Timeline</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoom(Math.max(25, zoom - 25))}
                      className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                    >
                      <Minus className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-slate-400 text-xs font-inter">{zoom}%</span>
                    <button
                      onClick={() => setZoom(Math.min(400, zoom + 25))}
                      className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                    >
                      <Plus className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="h-16 bg-slate-900 rounded border border-slate-700 relative">
                  {/* Timeline ruler */}
                  <div className="absolute top-0 left-0 right-0 h-4 border-b border-slate-600 flex items-center px-2">
                    <div className="flex-1 flex justify-between text-xs text-slate-500">
                      <span>0:00</span>
                      <span>0:15</span>
                      <span>0:30</span>
                      <span>0:45</span>
                      <span>1:00</span>
                    </div>
                  </div>
                  {/* Video track */}
                  {previewUrl && (
                    <div className="absolute top-4 left-2 right-2 h-8 bg-purple-600/30 border border-purple-500/50 rounded flex items-center px-2">
                      <FileVideo className="w-4 h-4 text-purple-400 mr-2" />
                      <span className="text-purple-300 text-xs font-inter">
                        {selectedVideo?.name || 'Video Track'}
                      </span>
                    </div>
                  )}
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
