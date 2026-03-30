import { pgEnum } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

// =============================================================================
// 1.1 User & Auth Enums
// =============================================================================

export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "pharmacist_in_charge",
  "pharmacist",
  "production_manager",
  "qa_manager",
  "qa_specialist",
  "qc_technician",
  "compounding_technician",
  "compounding_supervisor",
  "warehouse_clerk",
  "procurement_manager",
  "training_coordinator",
  "maintenance_technician",
  "executive",
  "read_only",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
  "pending_activation",
]);

export const qualificationStatusEnum = pgEnum("qualification_status", [
  "qualified",
  "in_training",
  "expired",
  "suspended",
  "not_applicable",
]);

export const signatureMeaningEnum = pgEnum("signature_meaning", [
  "performed_by",
  "verified_by",
  "reviewed_by",
  "approved_by",
  "witnessed_by",
  "released_by",
  "rejected_by",
  "acknowledged",
]);

// =============================================================================
// 1.2 Batch & Formula Enums
// =============================================================================

export const formulaStatusEnum = pgEnum("formula_status", [
  "draft",
  "pending_review",
  "approved",
  "superseded",
  "retired",
  "rejected",
]);

export const batchStatusEnum = pgEnum("batch_status", [
  "draft",
  "scheduled",
  "in_progress",
  "pending_qc_review",
  "pending_qa_review",
  "pending_pic_release",
  "released",
  "rejected",
  "quarantined",
  "recalled",
  "voided",
]);

export const stepTypeEnum = pgEnum("step_type", [
  "instruction",
  "data_entry",
  "measurement",
  "checklist",
  "verification",
  "calculation",
  "barcode_scan",
  "photo_capture",
  "timer",
  "signature",
  "supply_gathering",
  "label_verification",
]);

export const stepDataTypeEnum = pgEnum("step_data_type", [
  "text",
  "number",
  "integer",
  "decimal",
  "boolean",
  "date",
  "time",
  "datetime",
  "select",
  "multi_select",
  "temperature",
  "weight",
  "volume",
  "pressure",
  "percentage",
]);

export const stepStatusEnum = pgEnum("step_status", [
  "pending",
  "in_progress",
  "completed",
  "skipped_approved",
  "failed",
  "deviation_raised",
]);

export const dosageFormEnum = pgEnum("dosage_form", [
  "injectable",
  "ophthalmic",
  "topical",
  "oral_solution",
  "nasal",
  "inhalation",
  "suppository",
  "other",
]);

export const fillMethodEnum = pgEnum("fill_method", [
  "manual",
  "colonnar_auto",
  "peristaltic_pump",
  "other",
]);

// =============================================================================
// 1.3 Inventory Enums
// =============================================================================

export const itemCategoryEnum = pgEnum("item_category", [
  "api",
  "excipient",
  "container",
  "closure",
  "label",
  "consumable",
  "chemical_reagent",
  "filter",
  "packaging",
  "other",
]);

export const lotStatusEnum = pgEnum("lot_status", [
  "quarantined",
  "released",
  "in_use",
  "depleted",
  "expired",
  "rejected",
  "recalled",
  "returned",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "received",
  "released_by_qc",
  "issued_to_batch",
  "returned_to_stock",
  "adjusted",
  "quarantined",
  "disposed",
  "transferred",
]);

export const unitOfMeasureEnum = pgEnum("unit_of_measure", [
  "mg",
  "g",
  "kg",
  "mcg",
  "ml",
  "l",
  "units",
  "meq",
  "mmol",
  "each",
  "vial",
  "syringe",
  "bag",
  "bottle",
  "box",
  "case",
]);

// =============================================================================
// 1.4 Quality & Compliance Enums
// =============================================================================

export const deviationSourceEnum = pgEnum("deviation_source", [
  "batch_production",
  "environmental_monitoring",
  "equipment_failure",
  "supply_chain",
  "personnel",
  "facility",
  "complaint",
  "audit_finding",
  "other",
]);

export const deviationSeverityEnum = pgEnum("deviation_severity", [
  "critical",
  "major",
  "minor",
]);

export const deviationStatusEnum = pgEnum("deviation_status", [
  "open",
  "under_investigation",
  "root_cause_identified",
  "capa_assigned",
  "capa_in_progress",
  "pending_effectiveness",
  "closed",
  "closed_no_action",
]);

export const capaTypeEnum = pgEnum("capa_type", [
  "corrective",
  "preventive",
  "both",
]);

export const capaStatusEnum = pgEnum("capa_status", [
  "open",
  "in_progress",
  "pending_verification",
  "effective",
  "not_effective",
  "closed",
]);

export const isoClassificationEnum = pgEnum("iso_classification", [
  "iso_5",
  "iso_7",
  "iso_8",
  "unclassified",
]);

export const roomTypeEnum = pgEnum("room_type", [
  "compounding",
  "ante_room",
  "warehouse",
  "dock",
  "lab",
  "office",
  "storage",
]);

export const sampleTypeEnum = pgEnum("sample_type", [
  "viable_air",
  "non_viable_air",
  "surface",
  "personnel_glove",
  "personnel_gown",
]);

export const sampleStatusEnum = pgEnum("sample_status", [
  "scheduled",
  "collected",
  "incubating",
  "results_entered",
  "within_limits",
  "alert_limit",
  "action_limit",
  "excursion_opened",
]);

export const equipmentStatusEnum = pgEnum("equipment_status", [
  "qualified",
  "in_use",
  "calibration_due",
  "out_of_calibration",
  "under_maintenance",
  "out_of_service",
  "retired",
]);

export const equipmentTypeEnum = pgEnum("equipment_type", [
  "ph_meter",
  "balance",
  "autoclave",
  "laminar_flow_hood",
  "isolator",
  "colonnar_filler",
  "peristaltic_pump",
  "particle_counter",
  "pressure_gauge",
  "temperature_probe",
  "humidity_sensor",
  "refrigerator",
  "freezer",
  "mixer",
  "sonicator",
  "other",
]);

export const cleaningStatusEnum = pgEnum("cleaning_status", [
  "scheduled",
  "in_progress",
  "completed",
  "overdue",
  "skipped_approved",
]);

export const scheduleFrequencyEnum = pgEnum("schedule_frequency", [
  "after_each_batch",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
]);

export const trainingTypeEnum = pgEnum("training_type", [
  "initial",
  "annual_requalification",
  "media_fill",
  "garbing_qualification",
  "aseptic_technique",
  "sop_specific",
  "gmp_general",
  "safety",
  "equipment_specific",
  "hazardous_drug",
]);

export const trainingStatusEnum = pgEnum("training_status", [
  "assigned",
  "in_progress",
  "completed",
  "failed",
  "expired",
  "waived",
]);

export const testTypeEnum = pgEnum("test_type", [
  "potency",
  "sterility",
  "endotoxin",
  "particulate_matter",
  "ph",
  "osmolality",
  "visual_inspection",
  "container_closure",
  "stability",
  "other",
]);

export const labSampleStatusEnum = pgEnum("lab_sample_status", [
  "sampled",
  "awaiting_shipment",
  "shipped",
  "received_by_lab",
  "in_testing",
  "results_received",
  "pass",
  "fail",
  "retest_required",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "soft_delete",
  "restore",
  "sign",
  "login",
  "logout",
  "login_failed",
  "role_change",
  "permission_change",
  "export",
  "print",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "batch_assigned",
  "batch_pending_review",
  "batch_released",
  "batch_rejected",
  "deviation_opened",
  "capa_assigned",
  "capa_due_soon",
  "capa_overdue",
  "calibration_due",
  "calibration_overdue",
  "em_alert_limit",
  "em_action_limit",
  "inventory_low_stock",
  "inventory_expired",
  "training_due",
  "training_overdue",
  "cleaning_overdue",
  "document_approval_needed",
  "signature_required",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "pending_approval",
  "approved",
  "superseded",
  "retired",
]);

export const documentTypeEnumPg = pgEnum("document_type_enum", [
  "sop",
  "coa",
  "protocol",
  "report",
  "certificate",
  "policy",
]);

export const excursionStatusEnum = pgEnum("excursion_status", [
  "open",
  "under_investigation",
  "pending_closure",
  "closed",
]);

// =============================================================================
// Zod Schemas (for form validation + API contracts)
// =============================================================================

export const userRoleSchema = createSelectSchema(userRoleEnum);
export const userStatusSchema = createSelectSchema(userStatusEnum);
export const batchStatusSchema = createSelectSchema(batchStatusEnum);
export const formulaStatusSchema = createSelectSchema(formulaStatusEnum);
export const stepStatusSchema = createSelectSchema(stepStatusEnum);
export const lotStatusSchema = createSelectSchema(lotStatusEnum);
export const deviationSeveritySchema = createSelectSchema(deviationSeverityEnum);

// =============================================================================
// TypeScript Types
// =============================================================================

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type BatchStatus = z.infer<typeof batchStatusSchema>;
export type FormulaStatus = z.infer<typeof formulaStatusSchema>;
export type StepStatus = z.infer<typeof stepStatusSchema>;
export type LotStatus = z.infer<typeof lotStatusSchema>;
export type DeviationSeverity = z.infer<typeof deviationSeveritySchema>;
