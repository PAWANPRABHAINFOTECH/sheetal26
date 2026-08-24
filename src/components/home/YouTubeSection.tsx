import { useYoutubeVideos, useSiteSettings } from "@/lib/temple.hooks";
import { Youtube, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type Video = {
  id: string;
  youtube_id: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  published_at: string | null;
  source_type: string | null;
  is_active: boolean | null;
};

export function YouTubeSection() {
  const { data: syncedVideos } = useYoutubeVideos("synced");
  const { data: specialVideos } = useYoutubeVideos("special");
  const { data: settings } = useSiteSettings();
  const { t } = useI18n();
  const [displayCountSynced, setDisplayCountSynced] = useState(8);
  const [displayCountSpecial, setDisplayCountSpecial] = useState(8);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedVideo]);

  const renderVideoGrid = (videos: Video[], count: number, setCount: React.Dispatch<React.SetStateAction<number>>) => {
    const visibleVideos = videos.filter((video) => video.is_active !== false && video.youtube_id).slice(0, count);
    const hasMore = videos.filter((video) => video.is_active !== false && video.youtube_id).length > count;

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleVideos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedVideo(video)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-card text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              aria-label={`${video.title || "वीडियो"} चलाएं`}
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                  alt={video.title || "वीडियो"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Youtube className="h-6 w-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 font-hindi text-lg font-bold leading-snug transition-colors group-hover:text-primary">
                  {video.title || "वीडियो"}
                </h3>
                {video.description && <p className="mt-3 line-clamp-2 text-xs italic text-muted-foreground">{video.description}</p>}
                {video.published_at && <p className="mt-auto pt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{new Date(video.published_at).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
              </div>
            </button>
          ))}
        </div>
        {hasMore && <div className="mt-8 flex justify-center"><Button variant="outline" size="sm" onClick={() => setCount((prev) => prev + 8)}>{t("और वीडियो देखें")}</Button></div>}
      </>
    );
  };

  return (
    <div className="space-y-16">
      {syncedVideos && syncedVideos.length > 0 && <section className="container mx-auto border-b border-primary/5 px-4 py-16"><div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 pb-6"><div className="space-y-2"><div className="h-0.5 w-full bg-black" /><p className="font-hindi text-lg italic text-foreground/70">{settings?.youtube_channel_name || "शीतल शिवालय समिति"} - नवीनतम वीडियो</p></div>{settings?.youtube_channel_url && <Button variant="outline" className="gap-2" asChild><a href={settings.youtube_channel_url} target="_blank" rel="noopener noreferrer">{t("चैनल देखें")} <ExternalLink className="h-4 w-4" /></a></Button>}</div>{renderVideoGrid(syncedVideos as Video[], displayCountSynced, setDisplayCountSynced)}</section>}
      {specialVideos && specialVideos.length > 0 && <section className="container mx-auto mb-16 rounded-3xl bg-primary/5 px-4 py-16"><div className="mb-10 border-b border-primary/10 pb-6"><h2 className="font-hindi text-3xl font-bold text-primary md:text-4xl">{t("विशेष झलकियां")}</h2></div>{renderVideoGrid(specialVideos as Video[], displayCountSpecial, setDisplayCountSpecial)}</section>}
      {selectedVideo && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={selectedVideo.title || "वीडियो"} onClick={() => setSelectedVideo(null)}><div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}><Button variant="secondary" size="icon" className="absolute -right-2 -top-12 rounded-full sm:right-0" aria-label="बंद करें" onClick={() => setSelectedVideo(null)}><X className="h-5 w-5" /></Button><div className="aspect-video overflow-hidden rounded-lg bg-black"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selectedVideo.youtube_id)}?autoplay=1&rel=0`} title={selectedVideo.title || "वीडियो"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div></div></div>}
    </div>
  );
}
