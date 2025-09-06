import LoadingSplash from "./loading-splash";

interface GelatoLoadingProps {
  /**
   * Optional custom image source URL
   * Defaults to "/gelato.png"
   */
  imageSrc?: string;
  /**
   * Optional custom alt text
   * Defaults to "Gelato loading"
   */
  imageAlt?: string;
}

export default function GelatoLoading({ 
  imageSrc = "/gelato.png", 
  imageAlt = "Gelato loading" 
}: GelatoLoadingProps = {}) {
  return <LoadingSplash imageSrc={imageSrc} imageAlt={imageAlt} />;
}