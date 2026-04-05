import { PlaceholderPage } from "../components/placeholder";
export default function ProductionPage() {
  return <PlaceholderPage title="Production Dashboard" description="Active batches, scheduling, and technician assignments" roles={["production_manager", "pharmacist_in_charge", "pharmacist"]} features={["Kanban batch board", "Scheduling calendar", "Technician assignment", "Real-time batch status"]} />;
}
