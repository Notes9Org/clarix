import { PlaceholderPage } from "../components/placeholder";
export default function LabPage() {
  return <PlaceholderPage title="Lab Samples" description="QC sample tracking, external lab coordination, and results" roles={["qc_technician", "qa_manager"]} features={["Sample tracker", "External lab coordination", "Result entry", "Pass/fail determinations", "Batch linkage"]} />;
}
