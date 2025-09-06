import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { WalletCard } from "../../../src/components/wallet/wallet-card";

describe("WalletCard", () => {
  const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7";
  const formattedAddress = "0x742d...bEb7";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders wallet card with formatted address", () => {
      render(<WalletCard address={mockAddress} />);

      expect(screen.getByText("Your Wallet")).toBeInTheDocument();
      expect(screen.getByText(formattedAddress)).toBeInTheDocument();
    });

    it("shows logout button only when callback provided", () => {
      const { rerender } = render(<WalletCard address={mockAddress} />);

      // Without callback - no logout button
      let buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1); // Only copy button

      // With callback - logout button appears
      const mockLogout = vi.fn();
      rerender(<WalletCard address={mockAddress} onLogoutClick={mockLogout} />);

      buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2); // Copy and logout buttons
    });
  });

  describe("Copy Functionality", () => {
    it("copies address to clipboard on click", async () => {
      render(<WalletCard address={mockAddress} />);

      const copyButton = screen.getByRole("button");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockAddress);
      });
    });

    it("shows visual feedback after copy", async () => {
      render(<WalletCard address={mockAddress} />);

      const copyButton = screen.getByRole("button");

      // Check initial state
      expect(copyButton.querySelector(".lucide-copy")).toBeInTheDocument();

      // Click and check for feedback
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(copyButton.querySelector(".lucide-check")).toBeInTheDocument();
      });
    });

    it("reverts icon after timeout", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      render(<WalletCard address={mockAddress} />);

      const copyButton = screen.getByRole("button");

      // Click to copy
      await act(async () => {
        fireEvent.click(copyButton);
      });

      // Should show check icon immediately
      await waitFor(() => {
        expect(copyButton.querySelector(".lucide-check")).toBeInTheDocument();
      });

      // Fast-forward time and wait for updates
      await act(async () => {
        vi.advanceTimersByTime(2500);
      });

      // Should revert to copy icon
      await waitFor(() => {
        expect(copyButton.querySelector(".lucide-copy")).toBeInTheDocument();
      });
    });

    it("uses custom copy handler when provided", () => {
      const mockCopyClick = vi.fn();
      render(<WalletCard address={mockAddress} onCopyClick={mockCopyClick} />);

      const copyButton = screen.getByRole("button");
      fireEvent.click(copyButton);

      expect(mockCopyClick).toHaveBeenCalledWith(mockAddress);
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe("Logout Functionality", () => {
    it("calls logout handler when clicked", () => {
      const mockLogout = vi.fn();
      render(<WalletCard address={mockAddress} onLogoutClick={mockLogout} />);

      const buttons = screen.getAllByRole("button");
      const logoutButton = buttons.find((btn) =>
        btn.querySelector(".lucide-log-out")
      );

      expect(logoutButton).toBeDefined();
      fireEvent.click(logoutButton!);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("supports keyboard navigation", async () => {
      const mockLogout = vi.fn();

      render(
        <WalletCard
          address={mockAddress}
          onLogoutClick={mockLogout}
        />,
      );

      const buttons = screen.getAllByRole("button");
      // With logout, we have two buttons. The order in DOM is logout first, copy second
      const logoutButton = buttons.find(btn => btn.querySelector('.lucide-log-out'));
      const copyButton = buttons.find(btn => btn.querySelector('.lucide-copy'));

      expect(copyButton).toBeDefined();
      expect(logoutButton).toBeDefined();

      // Focus and click copy button (uses default clipboard behavior)
      copyButton!.focus();
      expect(copyButton).toHaveFocus();
      
      // Click the copy button
      fireEvent.click(copyButton!);
      
      // Wait for async clipboard operation
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockAddress);
      });

      // Focus and click logout button
      logoutButton!.focus();
      expect(logoutButton).toHaveFocus();
      fireEvent.click(logoutButton!);
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty address gracefully", () => {
      render(<WalletCard address="" />);
      // Component should render without crashing
      expect(screen.getByText("Your Wallet")).toBeInTheDocument();
    });

    it("handles clipboard failure gracefully", async () => {
      const clipboardError = new Error("Clipboard access denied");
      const originalWriteText = navigator.clipboard.writeText;

      // Mock clipboard to reject
      navigator.clipboard.writeText = vi.fn().mockRejectedValueOnce(
        clipboardError,
      );

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(
        () => {},
      );

      render(<WalletCard address={mockAddress} />);

      const copyButton = screen.getByRole("button");
      fireEvent.click(copyButton);

      // Wait a bit for the promise to reject
      await waitFor(() => {
        // Component should not crash
        expect(screen.getByText(formattedAddress)).toBeInTheDocument();
      });

      // Restore
      navigator.clipboard.writeText = originalWriteText;
      consoleErrorSpy.mockRestore();
    });

    it("maintains independence between multiple instances", async () => {
      render(
        <>
          <WalletCard address="0x1111111111111111111111111111111111111111" />
          <WalletCard address="0x2222222222222222222222222222222222222222" />
        </>,
      );

      const copyButtons = screen.getAllByRole("button");

      // Click first card's copy button
      await act(async () => {
        fireEvent.click(copyButtons[0]);
      });

      // Only first card should show check icon
      await waitFor(() => {
        expect(copyButtons[0].querySelector(".lucide-check")).toBeInTheDocument();
      });
      expect(copyButtons[1].querySelector(".lucide-copy")).toBeInTheDocument();
    });
  });
});
