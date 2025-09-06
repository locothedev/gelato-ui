interface LoadingSplashProps {
  /**
   * Image source URL for the loading icon
   */
  imageSrc?: string;
  /**
   * Alt text for the loading image
   */
  imageAlt?: string;
}

export default function LoadingSplash({
  imageSrc,
  imageAlt = "Loading",
}: LoadingSplashProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="animate-pulse [animation-duration:2.5s]" aria-busy>
        {imageSrc
          ? (
            <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-sm bg-card/20">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          )
          : (
            <div className="h-24 w-24 rounded-2xl bg-card/20 shadow-sm animate-pulse" />
          )}
      </div>
    </div>
  );
}
