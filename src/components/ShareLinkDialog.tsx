/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  fileName: string;
}

export function ShareLinkDialog({
  open,
  onOpenChange,
  shareUrl,
  fileName,
}: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");

        // Reset copied state after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy link to clipboard");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share &quot;{fileName}&quot;</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view this item
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-xs" />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
        {copied && <p className="text-sm text-green-500">Link copied!</p>}
      </DialogContent>
    </Dialog>
  );
}
