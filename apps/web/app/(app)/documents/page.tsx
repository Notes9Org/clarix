import { PlaceholderPage } from "../components/placeholder";
export default function DocumentsPage() {
  return <PlaceholderPage title="Documents" description="SOP repository, version control, and approval workflows" roles={["qa_specialist", "qa_manager", "pharmacist_in_charge"]} features={["SOP repository", "Version control", "Approval workflows", "Document lifecycle (Draft → Approved → Retired)", "Full-text search"]} />;
}
