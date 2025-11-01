import { useState } from "react";
import { Play } from "lucide-react";

const videos = [
  {
    id: "video1",
    title: "Platform Overview",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=450&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "video2", 
    title: "AI Features Demo",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "video3",
    title: "Success Stories",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted shadow-lg">
        {!isPlaying ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            <img 
              src={activeVideo.thumbnail} 
              alt={activeVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-6 group-hover:scale-110 transition-transform">
                <Play className="w-12 h-12 fill-current" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={activeVideo.embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => {
              setActiveVideo(video);
              setIsPlaying(false);
            }}
            className={`relative aspect-video rounded-md overflow-hidden transition-all ${
              activeVideo.id === video.id 
                ? "ring-2 ring-primary scale-105" 
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img 
              src={video.thumbnail} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-xs text-white font-medium truncate">{video.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};