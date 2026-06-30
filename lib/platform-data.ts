export type UserRole =
  | "Super Admin"
  | "Organization Admin"
  | "Engineer"
  | "Technician"
  | "Viewer";

export type TransferStatus = "Draft" | "Approval" | "In Progress" | "Complete" | "Blocked";

export type EngineeringPart = {
  id: string;
  name: string;
  system: string;
  revision: string;
  material: string;
  massKg: number;
  tolerance: string;
  supplier: string;
  file: string;
  status: "Released" | "Review" | "Quarantine" | "Prototype";
  risk: string;
};

export type Recommendation = {
  id: string;
  partId: string;
  title: string;
  category: "Cost" | "Weight" | "Manufacturing" | "Material" | "Dimension";
  impact: string;
  confidence: number;
  owner: string;
};

export type TransferPackage = {
  id: string;
  title: string;
  from: string;
  to: string;
  classification: string;
  status: TransferStatus;
  progress: number;
  approver: string;
  due: string;
  files: Array<{
    name: string;
    type: "STEP" | "STL" | "OBJ" | "GLB" | "3D PDF" | "Drawing" | "Process" | "BOM";
    size: string;
    status: "Encrypted" | "Approved" | "Pending";
  }>;
};

export type RevisionEvent = {
  id: string;
  asset: string;
  actor: string;
  role: UserRole;
  previous: string;
  updated: string;
  reason: string;
  timestamp: string;
};

export type RepairStep = {
  id: string;
  label: string;
  owner: "Remote Engineer" | "Plant Technician" | "Quality Lead";
  status: "Done" | "Active" | "Waiting";
  instruction: string;
};

export const roles: UserRole[] = [
  "Super Admin",
  "Organization Admin",
  "Engineer",
  "Technician",
  "Viewer"
];

export const roleCapabilities: Record<UserRole, string[]> = {
  "Super Admin": ["Cross-org audit", "Policy control", "Tenant isolation"],
  "Organization Admin": ["Approvals", "User access", "Transfer oversight"],
  Engineer: ["3D review", "AI analysis", "Change requests"],
  Technician: ["Repair execution", "Fault feedback", "Photo evidence"],
  Viewer: ["Read-only assets", "Export logs", "Review comments"]
};

export const engineeringParts: EngineeringPart[] = [
  {
    id: "fan-rotor",
    name: "Fan rotor",
    system: "Compressor assembly",
    revision: "REV-C",
    material: "Ti-6Al-4V",
    massKg: 18.4,
    tolerance: "+/- 0.03 mm",
    supplier: "AeroForge Systems",
    file: "fan_rotor_rev_c.step",
    status: "Review",
    risk: "Blade root thermal fatigue"
  },
  {
    id: "bearing-cartridge",
    name: "Bearing cartridge",
    system: "Rotating core",
    revision: "REV-B",
    material: "M50 tool steel",
    massKg: 6.8,
    tolerance: "+/- 0.01 mm",
    supplier: "Precision Axis Ltd.",
    file: "bearing_cartridge_rev_b.stl",
    status: "Released",
    risk: "Lubrication channel blockage"
  },
  {
    id: "thermal-casing",
    name: "Thermal casing",
    system: "Outer shell",
    revision: "REV-D",
    material: "Inconel 718",
    massKg: 42.2,
    tolerance: "+/- 0.08 mm",
    supplier: "NorthStar Defence",
    file: "thermal_casing_rev_d.glb",
    status: "Prototype",
    risk: "Excess wall thickness"
  },
  {
    id: "hydraulic-manifold",
    name: "Hydraulic manifold",
    system: "Control hardware",
    revision: "REV-A",
    material: "7075-T6 aluminum",
    massKg: 4.9,
    tolerance: "+/- 0.02 mm",
    supplier: "ForgeLine Mobility",
    file: "hydraulic_manifold_rev_a.obj",
    status: "Quarantine",
    risk: "Leak path near seal ring"
  }
];

export const recommendations: Recommendation[] = [
  {
    id: "AI-1082",
    partId: "fan-rotor",
    title: "Reduce blade root fillet stress concentration by 12 percent",
    category: "Dimension",
    impact: "Expected fatigue life increase of 18 percent with no machining penalty.",
    confidence: 91,
    owner: "Dr. Meera Iyer"
  },
  {
    id: "AI-1091",
    partId: "thermal-casing",
    title: "Replace two low-load casing ribs with lattice supports",
    category: "Weight",
    impact: "Estimated 6.4 kg weight reduction and 3.8 percent lower material cost.",
    confidence: 86,
    owner: "A. Raman"
  },
  {
    id: "AI-1114",
    partId: "bearing-cartridge",
    title: "Change drilling sequence for lubrication ports",
    category: "Manufacturing",
    impact: "Reduces fixture swaps from 4 to 2 and shortens cycle time by 22 minutes.",
    confidence: 88,
    owner: "L. Hartmann"
  },
  {
    id: "AI-1120",
    partId: "hydraulic-manifold",
    title: "Evaluate 7050-T7451 as alternate billet stock",
    category: "Material",
    impact: "Comparable strength with projected 7 percent procurement savings.",
    confidence: 79,
    owner: "N. Alvarez"
  }
];

export const transferPackages: TransferPackage[] = [
  {
    id: "TT-2409",
    title: "Turbofan compressor transfer",
    from: "AeroForge Systems",
    to: "NorthStar Defence",
    classification: "Controlled technical data",
    status: "Approval",
    progress: 72,
    approver: "S. Kapoor",
    due: "2026-07-08",
    files: [
      { name: "compressor_assembly_rev_c.step", type: "STEP", size: "244 MB", status: "Encrypted" },
      { name: "assembly_drawing_rev_c.pdf", type: "3D PDF", size: "38 MB", status: "Approved" },
      { name: "manufacturing_plan.xlsx", type: "Process", size: "4.8 MB", status: "Pending" },
      { name: "controlled_bom_rev_c.csv", type: "BOM", size: "1.2 MB", status: "Approved" }
    ]
  },
  {
    id: "TT-2417",
    title: "Hydraulic press retrofit package",
    from: "ForgeLine Mobility",
    to: "Atlas Heavy Machinery",
    classification: "Supplier confidential",
    status: "In Progress",
    progress: 48,
    approver: "M. Sen",
    due: "2026-07-12",
    files: [
      { name: "press_frame_scan.glb", type: "GLB", size: "184 MB", status: "Encrypted" },
      { name: "seal_replacement_workflow.pdf", type: "Drawing", size: "16 MB", status: "Approved" },
      { name: "maintenance_checklist.xlsx", type: "Process", size: "2.1 MB", status: "Pending" }
    ]
  },
  {
    id: "TT-2421",
    title: "EV gearbox validation release",
    from: "NorthStar Defence",
    to: "ForgeLine Mobility",
    classification: "Partner restricted",
    status: "Complete",
    progress: 100,
    approver: "D. Rao",
    due: "2026-06-29",
    files: [
      { name: "gearbox_housing_rev_f.stl", type: "STL", size: "91 MB", status: "Approved" },
      { name: "inspection_report_rev_f.pdf", type: "Drawing", size: "12 MB", status: "Approved" }
    ]
  }
];

export const revisionEvents: RevisionEvent[] = [
  {
    id: "ECM-9081",
    asset: "Fan rotor",
    actor: "Dr. Meera Iyer",
    role: "Engineer",
    previous: "REV-B",
    updated: "REV-C",
    reason: "Blade root radius increased after AI fatigue recommendation.",
    timestamp: "2026-06-30 09:42 IST"
  },
  {
    id: "ECM-9074",
    asset: "Hydraulic manifold",
    actor: "R. Nair",
    role: "Technician",
    previous: "REV-A",
    updated: "REV-A.1",
    reason: "Field leak marker added near seal ring port.",
    timestamp: "2026-06-29 18:16 IST"
  },
  {
    id: "ECM-9062",
    asset: "Thermal casing",
    actor: "S. Kapoor",
    role: "Organization Admin",
    previous: "REV-C",
    updated: "REV-D",
    reason: "Supplier drawing package approved for prototype lot.",
    timestamp: "2026-06-28 14:05 IST"
  }
];

export const repairSteps: RepairStep[] = [
  {
    id: "RS-1",
    label: "Lockout and isolate hydraulic feed",
    owner: "Plant Technician",
    status: "Done",
    instruction: "Confirm zero pressure at HPU-14 before removing the access panel."
  },
  {
    id: "RS-2",
    label: "Inspect seal ring and leak path",
    owner: "Remote Engineer",
    status: "Active",
    instruction: "Use live model marker F-22 and compare actual gap to 0.35 mm limit."
  },
  {
    id: "RS-3",
    label: "Replace cartridge and retorque cover",
    owner: "Plant Technician",
    status: "Waiting",
    instruction: "Install cartridge kit BC-77 and torque fasteners in cross pattern."
  },
  {
    id: "RS-4",
    label: "Run vibration acceptance test",
    owner: "Quality Lead",
    status: "Waiting",
    instruction: "Accept only if bearing vibration stays below 2.8 mm/s for 12 minutes."
  }
];

export const collaborationMessages = [
  {
    id: "CM-1",
    sender: "Remote Engineer",
    message: "Leak marker is pinned to the seal ring shoulder. Rotate 18 degrees clockwise.",
    time: "09:55"
  },
  {
    id: "CM-2",
    sender: "Technician",
    message: "Visual confirms residue at F-22. Sending thermal image now.",
    time: "09:57"
  },
  {
    id: "CM-3",
    sender: "Remote Engineer",
    message: "Proceed with cartridge replacement. Keep the casing open for inspection signoff.",
    time: "10:01"
  }
];

export const healthMetrics = [
  { label: "OEE", value: 84, target: 88, unit: "%" },
  { label: "Downtime Risk", value: 21, target: 15, unit: "%" },
  { label: "Cycle Time", value: 42, target: 38, unit: "min" },
  { label: "First Pass Yield", value: 93, target: 96, unit: "%" }
];

export const auditEvents = [
  "AES-256 encrypted package opened by NorthStar Defence viewer",
  "Approval gate completed by Organization Admin S. Kapoor",
  "Watermarked 3D PDF downloaded from verified IP range",
  "Technician annotation converted into engineering change request",
  "AI recommendation accepted with engineering justification"
];

export const productionInsights = [
  { label: "Transfer packages", value: "38", change: "+12 this month" },
  { label: "Open revisions", value: "14", change: "5 awaiting signoff" },
  { label: "Repair MTTR", value: "3.6h", change: "18 percent faster" },
  { label: "AI savings", value: "$428k", change: "Projected annualized" }
];
