"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface ShareLinkProps {
  link: string;
  fileId: string;
  fileName: string;
}

export function ShareLink({ link, fileName }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        toast.success("Link copied to clipboard!");

        // Reset copied state after 3 seconds
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch(() => setError("Failed to copy link to clipboard"));
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setCopied(false);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share &quot;{fileName}&quot;</DialogTitle>
          <DialogDescription>
            Anyone with this link will be able to view this item
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
        {copied && <p className="text-sm text-green-500">Link copied!</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
