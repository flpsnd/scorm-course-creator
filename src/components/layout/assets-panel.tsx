import { useState } from 'react';
import { Upload, Image, Video, FileText, Music, File, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  name: string;
  url: string;
  thumbnail?: string;
  size: number;
  uploadedAt: Date;
}

export function AssetsPanel() {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos' | 'audio' | 'documents'>('all');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    // Here you would typically upload the files to your server
    // For now, we'll just create local assets
    const newAssets = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      type: getAssetType(file.type),
      name: file.name,
      url: URL.createObjectURL(file),
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      size: file.size,
      uploadedAt: new Date()
    }));

    setAssets(prev => [...prev, ...newAssets]);
  };

  const getAssetType = (mimeType: string): Asset['type'] => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8" />;
      case 'video':
        return <Video className="w-8 h-8" />;
      case 'audio':
        return <Music className="w-8 h-8" />;
      case 'document':
        return <FileText className="w-8 h-8" />;
      default:
        return <File className="w-8 h-8" />;
    }
  };

  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredAssets = assets.filter(asset => 
    activeTab === 'all' || asset.type === activeTab.slice(0, -1)
  );

  return (
    <div className="space-y-4">
      <div className="font-medium">Media Library</div>
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-8
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center text-center">
          <Upload className="w-8 h-8 mb-2 text-gray-400" />
          <p className="text-sm mb-2">Drag and drop files here</p>
          <p className="text-xs text-gray-500 mb-4">or</p>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileInput}
            />
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="documents">Docs</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredAssets.map(asset => (
              <Card key={asset.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getAssetIcon(asset.type)
                    )}
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-medium truncate" title={asset.name}>
                      {asset.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatSize(asset.size)}
                    </div>
                  </div>
                  <div className="border-t p-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setAssets(prev => prev.filter(a => a.id !== asset.id));
                        URL.revokeObjectURL(asset.url);
                        if (asset.thumbnail) URL.revokeObjectURL(asset.thumbnail);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 