"use client";

import { cn } from "../../lib/utils";
import { truncateAddress } from "../../utils/address";
import { Check, Copy, LogOut } from "lucide-react";
import { useState } from "react";

interface WalletPillProps {
  address: string;
  className?: string;
  /**
   * Optional callback when logout button is clicked
   * If not provided, the logout button will not be displayed
   */
  onLogoutClick?: (e: React.MouseEvent) => void;
  /**
   * Optional callback when copy button is clicked
   * If not provided, uses default clipboard copy behavior
   */
  onCopyClick?: (e: React.MouseEvent, address: string) => void;
}

export const WalletPill = ({
  address,
  className,
  onLogoutClick,
  onCopyClick,
}: WalletPillProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopyClick) {
      onCopyClick(e, address);
    } else {
      navigator.clipboard.writeText(address);
    }
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLogoutClick) {
      onLogoutClick(e);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 h-7 rounded-full w-fit leading-none",
        "bg-background border border-border",
        "text-xs font-mono text-foreground",
        "shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Address with copy functionality */}
      <button
        onClick={handleCopy}
        className={cn(
          "flex items-center gap-1.5 px-1.5 py-0 h-full rounded-full leading-none",
          "transition-colors duration-200 ease-in-out",
          "hover:bg-secondary/50",
          isCopied ? "text-green-600" : "text-foreground hover:text-primary"
        )}
      >
        <span className="text-[11px] leading-none">
          {truncateAddress(address)}
        </span>
        <div className="transition-transform duration-200 ease-in-out">
          {isCopied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </div>
      </button>

      {onLogoutClick && (
        <>
          {/* Separator */}
          <div className="w-px h-3 bg-border" />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0 h-full rounded-full leading-none",
              "text-xs font-medium",
              "text-muted-foreground hover:text-destructive",
              "hover:bg-destructive/10",
              "transition-colors duration-200"
            )}
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </>
      )}
    </div>
  );
};