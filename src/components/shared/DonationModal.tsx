import { useSiteSettings } from "@/lib/temple.hooks";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/logo.png.asset.json";
import { useState, useEffect, useRef } from "react";
import { Copy, Check, QrCode, Building2, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";


// Hook-like event listener for opening the modal from anywhere
export function useDonationModal() {
  const openModal = () => {
    window.dispatchEvent(new CustomEvent("open-donation-modal"));
  };
  return { openModal };
}

export function DonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'bank'>('qr');
  const [copied, setCopied] = useState(false);
  const historyEntryAdded = useRef(false);
  const { data: settings } = useSiteSettings();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOpen = () => {
      if (historyEntryAdded.current) return;
      window.history.pushState({ donationModal: true }, "");
      historyEntryAdded.current = true;
      setIsOpen(true);
    };
    const handlePopState = () => {
      if (!historyEntryAdded.current) return;
      historyEntryAdded.current = false;
      setIsOpen(false);
    };
    window.addEventListener("open-donation-modal", handleOpen);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("open-donation-modal", handleOpen);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const closeModal = () => {
    if (historyEntryAdded.current) {
      historyEntryAdded.current = false;
      window.history.back();
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : closeModal())}>
      <DialogContent className="max-w-2xl w-[calc(100%-1rem)] max-h-[calc(100dvh-1rem)] sm:max-h-[90vh] overflow-hidden rounded-3xl p-0 border-none bg-background">
        <div className="flex max-h-[calc(100dvh-1rem)] flex-col overflow-hidden sm:max-h-[90vh]">
        <div className="shrink-0 bg-primary text-primary-foreground p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          
          <img src={logoAsset.url} alt="Logo" className="h-20 w-20 mx-auto mb-4 bg-white dark:bg-primary/20 rounded-full p-2 relative z-10" />
          <DialogTitle className="font-hindi text-3xl font-bold mb-2 relative z-10">शीतल शिवालय समिति</DialogTitle>
          <p className="font-hindi text-sm text-primary-foreground/80 relative z-10">
            शीतल सिटी, मंडीदीप, जिला-रायसेन (मध्यप्रदेश) – 462046
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="font-hindi text-2xl font-bold text-primary underline decoration-secondary decoration-4 underline-offset-8">{t('donation.title')}</h3>
            <p className="font-hindi text-foreground/80 leading-relaxed italic">
              {t('donation.msg')}
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={activeTab === 'qr' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'qr' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('qr')}
            >
              <QrCode className="mr-2 h-6 w-6" />
              {t('donation.qrTab')}
            </Button>
            <Button 
              variant={activeTab === 'bank' ? 'default' : 'outline'} 
              className={`font-hindi rounded-2xl h-16 text-lg ${activeTab === 'bank' ? 'bg-primary' : 'border-primary text-primary'}`}
              onClick={() => setActiveTab('bank')}
            >
              <Building2 className="mr-2 h-6 w-6" />
              {t('donation.bankTab')}
            </Button>
          </div>

          {activeTab === 'qr' ? (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
              <div className="bg-white dark:bg-primary/5 p-6 rounded-3xl shadow-2xl border-4 border-secondary/20">
                {settings?.donation_qr_url ? (
                  <img
                    src={settings.donation_qr_url}
                    alt="Donation QR"
                    className="w-48 h-48 md:w-64 md:h-64 object-contain"
                  />
                ) : (
                  <p className="flex h-48 w-48 items-center justify-center text-center font-hindi text-sm text-muted-foreground md:h-64 md:w-64">
                    QR कोड उपलब्ध नहीं है
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="font-hindi text-lg font-bold text-primary mb-2">{t('donation.qrMethod')}</p>
                {settings?.upi_id && (
                  <Button 
                    variant="ghost" 
                    className="font-inter text-muted-foreground hover:text-primary gap-2"
                    onClick={() => copyToClipboard(settings.upi_id || "")}
                  >
                    {settings.upi_id}
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="bg-secondary/5 border-2 border-secondary/20 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.holder')}</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_account_name || "उपलब्ध नहीं"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.bankName')}</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_name || "उपलब्ध नहीं"}</p>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.accountNo')}</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-lg font-bold text-primary tracking-wider">{settings?.bank_account_number || "उपलब्ध नहीं"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_account_number || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">{t('donation.ifsc')}</label>
                    <div className="flex items-center justify-between">
                      <p className="font-inter text-lg font-bold text-primary">{settings?.bank_ifsc || "उपलब्ध नहीं"}</p>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(settings?.bank_ifsc || "")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                     </div>
                  <div>
                    <label className="font-hindi text-xs text-muted-foreground uppercase tracking-widest">शाखा</label>
                    <p className="font-hindi text-lg font-bold text-primary">{settings?.bank_branch || "उपलब्ध नहीं"}</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-6 rounded-3xl text-center space-y-2">
             <p className="font-hindi text-sm font-bold text-primary">{t('donation.importance')}</p>
             <p className="font-hindi text-xs text-foreground/70 leading-relaxed">
               {t('donation.importanceMsg')}
             </p>
          </div>
           <footer className="border-t border-border pt-4 text-center text-xs font-semibold tracking-[0.08em] text-muted-foreground">
             <p>DESIGNED &amp; DEVELOPED BY PAWANPRABHA INFOTECH</p>
             <a
               href="https://wa.me/916262013335?text=नमस्कार%2C%20शीतल%20शिवालय%20समिति"
               target="_blank"
               rel="noreferrer"
               className="mt-2 inline-flex max-w-full flex-wrap items-center justify-center gap-2 text-green-600 hover:underline"
             >
               <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
               <span>+91-6262013335</span>
             </a>
           </footer>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
