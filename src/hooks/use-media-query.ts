import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = () => setMatches(media.matches);
    
    updateMatch();
    
    if (media.addEventListener) {
      media.addEventListener("change", updateMatch);
      return () => media.removeEventListener("change", updateMatch);
    } else {
      media.addListener(updateMatch);
      return () => media.removeListener(updateMatch);
    }
  }, [query]);

  return matches;
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

export function useIsMobile(): boolean {
  return !useIsDesktop();
}