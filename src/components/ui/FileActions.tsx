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

interface FileActionsProps {
  file: FileProps;
  fileActions?: ReturnType<typeof useFileActions>;
}

export function useFileActions() {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileProps | null>(null);
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const errorData = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new Error(errorData.error ?? "Failed to rename item");
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      toast.success("Item renamed successfully");
      router.refresh();
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const errorData = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        throw new Error(errorData.error ?? "Failed to delete item");
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      toast.success("Item deleted successfully");
      router.refresh();
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item",
      );
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

  const closeDialogs = () => {
    setIsRenaming(false);
    setIsDeleting(false);
    setSelectedFile(null);
  };

  return {
    isRenaming,
    isDeleting,
    selectedFile,
    handleRename,
    handleDelete,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  };
}

export function FileActions({ file, fileActions }: FileActionsProps) {
  // Use provided fileActions or create a new instance
  const {
    isRenaming,
    isDeleting,
    selectedFile,
    handleRename,
    handleDelete,
    openRenameDialog,
    openDeleteDialog,
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
    </>
  );
}
