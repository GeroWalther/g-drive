import { folders } from "~/data/mockData";
import { AppLayout } from "~/components/layout/AppLayout";
import { Breadcrumbs } from "~/components/ui/Breadcrumbs";
import { FilesContainer } from "~/components/FilesContainer";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <Breadcrumbs
          items={[{ label: "My Drive", href: "/" }]}
          className="mb-6"
        />

        <section>
          <h1 className="mb-6 text-2xl font-bold">My Drive</h1>
          <FilesContainer files={folders} />
        </section>
      </div>
    </AppLayout>
  );
}
