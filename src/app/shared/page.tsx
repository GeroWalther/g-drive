import { sharedFiles } from "~/data/mockData";
import { PageLayout } from "~/components/layouts/PageLayout";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";

export default function SharedPage() {
  return (
    <PageLayout
      title="Shared with me"
      description="Files and folders others have shared with you"
    >
      <Breadcrumbs
        items={[{ label: "Shared with me", href: "/shared" }]}
        className="mb-6"
      />
      <FilesContainer files={sharedFiles} />
    </PageLayout>
  );
}
