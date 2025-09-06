import Image from "next/image";

export default function LoadingSplash() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="animate-pulse [animation-duration:2.5s]" aria-busy>
        <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-sm bg-card/20">
          <Image
            src="/gelato.png"
            alt="Gelato loading"
            width={96}
            height={96}
            priority
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
