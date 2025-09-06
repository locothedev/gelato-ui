"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, Check, LogOut } from "lucide-react";
import { formatAddress } from "../../utils/address";

interface WalletCardProps {
  address: string;
  /**
   * Optional callback when logout button is clicked
   * If not provided, the logout button will not be displayed
   */
  onLogoutClick?: () => void;
  /**
   * Optional callback when copy button is clicked
   * If not provided, uses default clipboard copy behavior
   */
  onCopyClick?: (address: string) => void;
}

export function WalletCard({ address, onLogoutClick, onCopyClick }: WalletCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopyClick) {
      onCopyClick(address);
    } else {
      navigator.clipboard.writeText(address);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Your Wallet</h3>
        {onLogoutClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogoutClick}
            className="text-muted-foreground hover:text-foreground -mr-2"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <code className="text-lg font-mono">{formatAddress(address)}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  );
}