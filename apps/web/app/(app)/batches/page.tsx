import { PlaceholderPage } from "../components/placeholder";
export default function BatchesPage() {
  return <PlaceholderPage title="Batch Records" description="Digital batch records with step-by-step execution tracking" roles={["production_manager", "pharmacist_in_charge", "pharmacist", "qa_manager", "qa_specialist"]} features={["Filterable batch table", "Status pipeline (Draft → Released)", "Step-by-step execution", "E-signature capture", "Deviation linking"]} />;
}
