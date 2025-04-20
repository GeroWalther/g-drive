/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { type FileProps } from "~/types/file";
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

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShareLinkDialog } from "~/components/ShareLinkDialog";

interface FileActionsProps {
  file: FileProps;
  fileActions?: ReturnType<typeof useFileActions>;
}

export function directShare(file: { id: string; name: string }) {
  console.log("Using direct share for file:", file);

  // Create share dialog immediately
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "10000";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";

  const dialog = document.createElement("div");
  dialog.style.backgroundColor = "#0f172a"; // Dark blue background
  dialog.style.color = "white";
  dialog.style.borderRadius = "8px";
  dialog.style.padding = "24px";
  dialog.style.width = "90%";
  dialog.style.maxWidth = "450px";
  dialog.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
  dialog.style.fontFamily = "system-ui, -apple-system, sans-serif";

  // Header section
  const header = document.createElement("div");
  header.style.marginBottom = "16px";

  const title = document.createElement("h2");
  title.style.margin = "0 0 8px 0";
  title.style.fontSize = "18px";
  title.style.fontWeight = "600";
  title.style.color = "white";
  title.textContent = `Share "${file.name}"`;

  const description = document.createElement("p");
  description.style.margin = "0";
  description.style.fontSize = "14px";
  description.style.color = "#94a3b8"; // Muted text color
  description.textContent =
    "Anyone with this link will be able to view this item";

  header.appendChild(title);
  header.appendChild(description);

  // Input section and loading state
  const inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";
  inputContainer.style.marginBottom = "24px";
  inputContainer.style.gap = "8px";

  const input = document.createElement("input");
  input.placeholder = "Generating share link...";
  input.readOnly = true;
  input.style.flex = "1";
  input.style.padding = "8px 12px";
  input.style.borderRadius = "6px";
  input.style.border = "1px solid #334155"; // Darker border
  input.style.fontSize = "14px";
  input.style.backgroundColor = "#1e293b"; // Dark input background
  input.style.color = "white";
  input.style.fontFamily = "monospace";
  input.style.outline = "none";
  input.onclick = () => input.select();

  const copyIconButton = document.createElement("button");
  copyIconButton.style.padding = "8px";
  copyIconButton.style.borderRadius = "6px";
  copyIconButton.style.border = "none";
  copyIconButton.style.backgroundColor = "#334155"; // Dark button background
  copyIconButton.style.color = "white";
  copyIconButton.style.cursor = "pointer";
  copyIconButton.style.display = "flex";
  copyIconButton.style.alignItems = "center";
  copyIconButton.style.justifyContent = "center";
  copyIconButton.style.opacity = "0.5"; // Initially disabled
  copyIconButton.disabled = true;
  copyIconButton.title = "Copy";
  copyIconButton.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

  inputContainer.appendChild(input);
  inputContainer.appendChild(copyIconButton);

  // Footer section
  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "flex-end";
  footer.style.gap = "8px";

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.padding = "8px 16px";
  closeButton.style.borderRadius = "6px";
  closeButton.style.border = "1px solid #334155";
  closeButton.style.backgroundColor = "#1e293b"; // Dark button background
  closeButton.style.color = "white";
  closeButton.style.fontSize = "14px";
  closeButton.style.fontWeight = "500";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => {
    document.body.removeChild(overlay);
  };

  footer.appendChild(closeButton);

  // Assemble dialog
  dialog.appendChild(header);
  dialog.appendChild(inputContainer);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  // Show the dialog
  document.body.appendChild(overlay);

  // Make API call to create share link
  fetch("/api/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileId: file.id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create share link");
      }
      return response.json();
    })
    .then((data) => {
      // Update the input with the share URL
      input.value = data.shareUrl;
      input.placeholder = "";

      // Enable copy button
      copyIconButton.disabled = false;
      copyIconButton.style.opacity = "1";

      // Setup copy button click handler
      copyIconButton.onclick = () => {
        try {
          void navigator.clipboard.writeText(data.shareUrl);
          toast.success("Link copied to clipboard!");

          // Visual feedback on copy
          copyIconButton.style.backgroundColor = "#0f766e"; // Success color
          setTimeout(() => {
            copyIconButton.style.backgroundColor = "#334155";
          }, 1000);
        } catch (error) {
          toast.error("Failed to copy link");
        }
      };
    })
    .catch((error) => {
      console.error("Error creating share link:", error);
      input.value = "Error creating share link";
      input.style.color = "#ef4444"; // Error text color
      toast.error("Failed to create share link");
    });
}

export function useFileActions() {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleRename = async (id: string, newName: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to rename item");
      }

      toast.success("Item renamed successfully");
      router.refresh();
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to rename item",
      );
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to delete item");
      }

      toast.success("Item deleted successfully");
      router.refresh();
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item",
      );
      return false;
    }
  };

  const handleDownload = (file: FileProps) => {
    // Only attempt to download if the file has a URL and is not a folder
    if (file.url && file.type !== "folder") {
      try {
        // Create a hidden anchor element
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name; // Set the filename to download as
        link.target = "_blank"; // Open in new tab (not strictly necessary for download)

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Downloading ${file.name}`);
      } catch (error) {
        toast.error("Failed to download file");
        console.error("Download error:", error);
      }
    } else if (file.type === "folder") {
      toast.error("Folders cannot be downloaded directly");
    } else {
      toast.error("No download URL available for this file");
    }
  };

  const handleShare = async (id: string) => {
    try {
      // Create a simple share URL using the current origin
      const origin = window.location.origin;
      const shareUrl = `${origin}/shared/${id}`;
      setShareUrl(shareUrl);
      return true;
    } catch (error) {
      toast.error("Failed to create share link");
      return false;
    }
  };

  const openRenameDialog = (file: FileProps) => {
    setSelectedFile(file);
    setIsRenaming(true);
  };

  const openDeleteDialog = (file: FileProps) => {
    setSelectedFile(file);
    setIsDeleting(true);
  };

  const openShareDialog = (file: FileProps) => {
    setSelectedFile(file);
    // Use directShare instead of relying on state management
    directShare(file);
    // Mark as sharing in state management
    setIsSharing(true);
  };

  const closeDialogs = () => {
    setIsRenaming(false);
    setIsDeleting(false);
    setIsSharing(false);
    setSelectedFile(null);
    setShareUrl(null);
  };

  return {
    isRenaming,
    isDeleting,
    isSharing,
    selectedFile,
    shareUrl,
    handleRename,
    handleDelete,
    handleDownload,
    handleShare,
    openRenameDialog,
    openDeleteDialog,
    openShareDialog,
    closeDialogs,
  };
}

export function FileActions({ file, fileActions }: FileActionsProps) {
  // Use provided fileActions or create a new instance
  const {
    isRenaming,
    isDeleting,
    isSharing,
    selectedFile,
    shareUrl,
    handleRename,
    handleDelete,
    handleDownload,
    handleShare,
    openRenameDialog,
    openDeleteDialog,
    openShareDialog,
    closeDialogs,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = fileActions ?? useFileActions();

  const [newName, setNewName] = useState(file.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onRename = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    const success = await handleRename(selectedFile.id, newName);
    setIsSubmitting(false);

    if (success) {
      closeDialogs();
    }
  };

  const onDelete = async () => {
    if (!selectedFile) return;

    setIsSubmitting(true);
    const success = await handleDelete(selectedFile.id);
    setIsSubmitting(false);

    if (success) {
      closeDialogs();
    }
  };

  return (
    <>
      {/* Rename Dialog */}
      <Dialog
        open={isRenaming && selectedFile?.id === file.id}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
          else openRenameDialog(file);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Rename {selectedFile?.type === "folder" ? "Folder" : "File"}
            </DialogTitle>
            <DialogDescription>
              Enter a new name for this{" "}
              {selectedFile?.type === "folder" ? "folder" : "file"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm font-medium">Name</div>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button
              onClick={onRename}
              disabled={isSubmitting || !newName.trim()}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={isDeleting && selectedFile?.id === file.id}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
          else openDeleteDialog(file);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {selectedFile?.type === "folder" ? "Folder" : "File"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedFile?.name} ?
              {selectedFile?.type === "folder" &&
                " This will also delete all files inside this folder."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialogs}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog - Not using this anymore, using directShare instead */}
      {/*
      <ShareLinkDialog
        open={isSharing && selectedFile?.id === file.id}
        onOpenChange={(open) => {
          if (!open) closeDialogs();
          else openShareDialog(file);
        }}
        shareUrl={shareUrl ?? ""}
        fileName={selectedFile?.name ?? ""}
      />
      */}
    </>
  );
}
