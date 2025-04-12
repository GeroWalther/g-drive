import { starredFiles } from "~/data/mockData";
import { PageLayout } from "~/components/layouts/PageLayout";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";
import { StarIcon } from "~/components/ui/Icons";

export default function StarredPage() {
  return (
    <PageLayout
      title="Starred"
      description="Files and folders you've marked as important"
    >
      <Breadcrumbs
        items={[{ label: "Starred", href: "/starred" }]}
        className="mb-6"
      />

      {starredFiles.length > 0 ? (
        <FilesContainer files={starredFiles} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <StarIcon className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-1 text-lg font-medium">No starred files</h3>
          <p className="max-w-md text-gray-500">
            Star your most important files and folders to quickly access them
            later
          </p>
        </div>
      )}
    </PageLayout>
  );
}
