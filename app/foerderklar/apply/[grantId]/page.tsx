import ApplyPage from "../../_components/apply-page";

export default async function Page({
  params,
}: {
  params: Promise<{ grantId: string }>;
}) {
  const { grantId } = await params;
  return <ApplyPage grantId={grantId} />;
}
