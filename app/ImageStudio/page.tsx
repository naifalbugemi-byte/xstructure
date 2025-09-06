import { useState, useRef } from "react";
import { 
  Image, 
  Upload, 
  Wand2, 
  Download, 
  Palette, 
  Layers, 
  Sparkles,
  Settings,
  Crop,
  Filter,
  Type,
  Brush,
  Eraser,
  Move,
  RotateCw,
  Zap,
  Eye,
  Copy,
  Trash2,
  Save,
  Share2,
  Sparkles as Magic,
  Blend,
  Contrast,
  Sun,
  Droplets,
  Scissors,
  PaintBucket,
  Grid,
  Target,
  Layers3,
  Sliders
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

const aiTools = [
  { id: "enhance", name: "AI Enhance", icon: Sparkles, description: "Auto-enhance image quality", credits: 1 },
  { id: "upscale", name: "AI Upscale", icon: Zap, description: "Increase resolution 4x", credits: 2 },
  { id: "background", name: "Remove Background", icon: Scissors, description: "AI background removal", credits: 1 },
  { id: "recolor", name: "AI Recolor", icon: PaintBucket, description: "Smart color replacement", credits: 1 },
  { id: "style", name: "Style Transfer", icon: Brush, description: "Apply artistic styles", credits: 2 },
  { id: "restore", name: "Photo Restore", icon: Magic, description: "Fix old/damaged photos", credits: 2 },
  { id: "colorize", name: "Colorize B&W", icon: Palette, description: "Add color to B&W photos", credits: 2 },
  { id: "denoise", name: "Noise Reduction", icon: Filter, description: "Remove image noise", credits: 1 },
  { id: "sharpen", name: "AI Sharpen", icon: Target, description: "Enhance image sharpness", credits: 1 },
  { id: "blur", name: "Smart Blur", icon: Droplets, description: "Selective background blur", credits: 1 }
];

const editingTools = [
  { id: "crop", name: "Crop", icon: Crop },
  { id: "rotate", name: "Rotate", icon: RotateCw },
  { id: "resize", name: "Resize", icon: Move },
  { id: "filters", name: "Filters", icon: Filter },
  { id: "adjust", name: "Adjustments", icon: Sliders },
  { id: "text", name: "Add Text", icon: Type },
  { id: "layers", name: "Layers", icon: Layers3 },
  { id: "blend", name: "Blend Modes", icon: Blend }
];

const templates = [
  { id: "social", name: "Social Media Post", size: "1080x1080", category: "social" },
  { id: "story", name: "Instagram Story", size: "1080x1920", category: "social" },
  { id: "banner", name: "Web Banner", size: "1200x400", category: "web" },
  { id: "thumbnail", name: "YouTube Thumbnail", size: "1280x720", category: "video" },
  { id: "poster", name: "Event Poster", size: "1080x1350", category: "print" },
  { id: "card", name: "Business Card", size: "1050x600", category: "print" },
  { id: "flyer", name: "Flyer", size: "1080x1440", category: "print" },
  { id: "cover", name: "Facebook Cover", size: "1200x630", category: "social" }
];

const brandingOptions = [
  { id: "logo", name: "Apply Logo", icon: Image },
  { id: "colors", name: "Brand Colors", icon: Palette },
  { id: "fonts", name: "Brand Fonts", icon: Type },
  { id: "watermark", name: "Watermark", icon: Eye }
];

export default function ImageStudio() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'enhance'>('create');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profile = useQuery(api.profiles.getCurrentProfile);
  const generateImage = useAction(api.ai.generateImage);
  const addCredits = useMutation(api.profiles.addCredits);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success("Image uploaded successfully!");
    }
  };

  const handleAIGenerate = async (prompt: string) => {
    if (!profile || profile.credits < 1) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await generateImage({ 
        prompt,
        style: "professional",
        aspectRatio: "1:1"
      });
      setPreviewUrl(result.imageUrl);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAITool = async (toolId: string) => {
    if (!selectedImage || !profile) {
      toast.error("Please upload an image first");
      return;
    }

    const tool = aiTools.find(t => t.id === toolId);
    if (!tool) return;

    if (profile.credits < tool.credits) {
      toast.error("Insufficient credits");
      return;
    }

    setIsProcessing(true);
    try {
      // Mock processing - in real app this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Deduct credits
      await addCredits({
        amount: -tool.credits,
        description: `Applied ${tool.name} to image`,
      });
      
      toast.success(`${tool.name} applied successfully!`);
    } catch (error) {
      toast.error(`Failed to apply ${tool.name}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      toast.success(`${template.name} template selected`);
    }
  };

  const handleSave = () => {
    toast.success("Image saved to project!");
  };

  const handleExport = () => {
    toast.success("Image exported successfully!");
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
                <Image className="w-8 h-8 mr-3 text-blue-400" />
                AI Image Studio
              </h1>
              <p className="text-slate-300 mt-1 font-inter">
                Create, edit, and enhance images with AI • Credits: {profile?.credits || 0}
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
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all font-inter font-semibold flex items-center disabled:opacity-50"
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
            <div className="flex space-x-1 mb-6 bg-slate-800/50 rounded-lg p-1">
              {[
                { id: 'create', label: 'Create', icon: Sparkles },
                { id: 'edit', label: 'Edit', icon: Settings },
                { id: 'enhance', label: 'AI Enhance', icon: Wand2 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md transition-colors font-inter text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-1" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Create Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                {/* Upload Section */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Upload Image</h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400 font-inter">Click to upload image</p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Templates */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Templates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <p className="text-white text-sm font-medium font-inter">{template.name}</p>
                        <p className="text-slate-400 text-xs font-inter">{template.size}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Generation */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">AI Generation</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Describe the image you want to create..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 font-inter text-sm"
                    />
                    <button
                      onClick={() => handleAIGenerate("professional product photo")}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:shadow-lg transition-all font-inter font-semibold text-sm disabled:opacity-50"
                    >
                      {isProcessing ? 'Generating...' : 'Generate Image (1 credit)'}
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
                  <h3 className="text-white font-semibold mb-3 font-inter">Basic Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {editingTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          selectedTool === tool.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <tool.icon className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-white text-xs font-inter">{tool.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branding Tools */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Brand Assets</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {brandingOptions.map((option) => (
                      <button
                        key={option.id}
                        className="p-3 rounded-lg border border-slate-700 hover:border-slate-600 text-center transition-all"
                      >
                        <option.icon className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-white text-xs font-inter">{option.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layers Panel */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Layers</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-white text-sm font-inter">Background</span>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-1 hover:bg-slate-700 rounded">
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                        <button className="p-1 hover:bg-slate-700 rounded">
                          <Trash2 className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    </div>
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
                    {aiTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleAITool(tool.id)}
                        disabled={isProcessing || !selectedImage}
                        className="w-full p-3 rounded-lg border border-slate-700 hover:border-blue-500 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <tool.icon className="w-5 h-5 text-blue-400 mr-3" />
                            <span className="text-white font-medium font-inter">{tool.name}</span>
                          </div>
                          <span className="text-xs text-blue-400 font-inter">{tool.credits} credit{tool.credits > 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-slate-400 text-sm font-inter">{tool.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-white font-semibold mb-3 font-inter">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full p-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg text-green-400 font-inter text-sm">
                      Auto-Fix Everything (3 credits)
                    </button>
                    <button className="w-full p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg text-purple-400 font-inter text-sm">
                      Professional Touch-up (2 credits)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas */}
            <div className="flex-1 bg-slate-900/50 flex items-center justify-center p-8">
              {previewUrl ? (
                <div className="relative max-w-full max-h-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        <p className="text-white font-inter">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Image className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400 mb-2 font-inter">No Image Selected</h3>
                  <p className="text-slate-500 font-inter">Upload an image or generate one with AI to get started</p>
                </div>
              )}
            </div>

            {/* Bottom Toolbar */}
            <div className="bg-slate-950/90 border-t border-blue-500/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                      <Grid className="w-4 h-4 text-slate-400" />
                    </button>
                    <span className="text-slate-400 text-sm font-inter">100%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      disabled={currentStep === 0}
                      className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <span className="text-slate-400 text-sm font-inter">Undo</span>
                    </button>
                    <button 
                      disabled={currentStep === history.length - 1}
                      className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <span className="text-slate-400 text-sm font-inter">Redo</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <Share2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="text-slate-400 text-sm font-inter">|</span>
                  <span className="text-slate-400 text-sm font-inter">
                    {selectedImage ? `${selectedImage.name}` : 'Untitled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
