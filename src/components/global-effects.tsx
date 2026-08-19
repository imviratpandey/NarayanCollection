import { useQuery } from "@tanstack/react-query";
import { FestivalEffects } from "./festival-effects";
import { OfferBanner } from "./offer-banner";

export function GlobalEffects() {
  const { data: settings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return res.json() as Promise<{
        festival: string;
        offerActive: boolean;
        offerText: string;
        customEmoji?: string;
        customColor?: string;
      }>;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  if (!settings) return null;

  return (
    <>
      <FestivalEffects
        festival={settings.festival}
        customEmoji={settings.customEmoji}
        customColor={settings.customColor}
      />
      <OfferBanner active={settings.offerActive} text={settings.offerText} />
    </>
  );
}
