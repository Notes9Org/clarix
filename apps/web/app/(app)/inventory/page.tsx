import { PlaceholderPage } from "../components/placeholder";
export default function InventoryPage() {
  return <PlaceholderPage title="Inventory" description="Stock levels, lot tracking, and expiry management" roles={["warehouse_clerk", "procurement_manager", "production_manager"]} features={["Stock level dashboard", "Lot tracking with COA", "FIFO enforcement", "Expiry alerts", "Receiving workflow", "Low stock notifications"]} />;
}
