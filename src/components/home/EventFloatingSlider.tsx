import { useState, useEffect } from "react";
import { useAdvertisements } from "@/lib/temple.hooks";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type Advertisement = {
  id: string;
  image_url: string;
  title: string | null;
};

export function EventFloatingSlider() {
  const { data: ads, isLoading } = useAdvertisements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  const activeAds = ads?.filter(ad => ad.is_active) || [];

  useEffect(() => {
    const dismissedAt = window.localStorage.getItem("poster-dismissed-at");
    if (!dismissedAt) return;

    const remaining = Math.max(0, 40000 - (Date.now() - Number(dismissedAt)));
    if (remaining === 0) {
      window.localStorage.removeItem("poster-dismissed-at");
      return;
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => {
      window.localStorage.removeItem("poster-dismissed-at");
      setIsVisible(true);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeAds.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 5000); // 5 seconds rotation as per plan

    return () => clearInterval(timer);
  }, [activeAds.length]);

  useEffect(() => {
    document.body.style.overflow = selectedAd ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAd]);

  if (isLoading || activeAds.length === 0 || !isVisible) return null;

  const currentAd = activeAds[currentIndex];
  if (!currentAd) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 w-40 sm:w-56 lg:w-64">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-2xl border-2 border-accent/20 bg-card shadow-2xl group"
        >
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-1 top-1 z-50 h-6 w-6 rounded-full bg-background/50 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVisible(false);
            }}
          >
            <X className="h-3 w-3" />
          </Button>

          <button
            type="button"
            className="block h-full w-full cursor-zoom-in text-left"
            aria-label="पोस्टर बड़ा करके देखें"
            onClick={() => setSelectedAd(currentAd)}
          >
            <img
              src={currentAd.image_url}
              alt={currentAd.title || "Event"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {currentAd.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                <p className="line-clamp-2 font-hindi text-sm font-bold text-white sm:text-base">
                  {currentAd.title}
                </p>
              </div>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex justify-center gap-1.5">
        {activeAds.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-4 bg-accent" : "w-1 bg-accent/30"
            )}
          />
        ))}
      </div>
      {selectedAd && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="पोस्टर"
          onClick={() => setSelectedAd(null)}
        >
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full"
            aria-label="बंद करें"
            onClick={() => setSelectedAd(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={selectedAd.image_url}
            alt={selectedAd.title || "Event"}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}