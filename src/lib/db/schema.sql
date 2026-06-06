-- StockLock OS relational schema blueprint.
-- The current application runs on in-memory demo data, but these tables map the
-- business modules to a future Postgres/MySQL/Supabase backend.

CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gst_number TEXT,
  phone TEXT,
  address TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  manager_user_id TEXT,
  is_main_branch BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  branch_id TEXT REFERENCES branches(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES categories(id),
  brand_id TEXT REFERENCES brands(id),
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  compatible_vehicles TEXT NOT NULL,
  purchase_cost NUMERIC(12,2) NOT NULL,
  selling_price NUMERIC(12,2) NOT NULL,
  minimum_selling_price NUMERIC(12,2) NOT NULL,
  reorder_level INTEGER NOT NULL,
  has_warranty BOOLEAN NOT NULL DEFAULT FALSE,
  warranty_months INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE inventory_balances (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity_on_hand INTEGER NOT NULL,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  quantity_available INTEGER NOT NULL,
  last_updated_at TIMESTAMP NOT NULL,
  UNIQUE(branch_id, product_id)
);

CREATE TABLE stock_ledger (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  movement_type TEXT NOT NULL,
  quantity_change INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  reason TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE stock_requests (
  id TEXT PRIMARY KEY,
  requesting_branch_id TEXT NOT NULL REFERENCES branches(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  requested_qty INTEGER NOT NULL,
  urgency TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL,
  requested_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE stock_request_responses (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES stock_requests(id),
  responding_branch_id TEXT NOT NULL REFERENCES branches(id),
  available_qty INTEGER NOT NULL,
  promised_qty INTEGER NOT NULL,
  message TEXT,
  responded_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE stock_transfers (
  id TEXT PRIMARY KEY,
  source_branch_id TEXT NOT NULL REFERENCES branches(id),
  destination_branch_id TEXT NOT NULL REFERENCES branches(id),
  status TEXT NOT NULL,
  requested_by_user_id TEXT NOT NULL REFERENCES users(id),
  dispatched_by_user_id TEXT REFERENCES users(id),
  received_by_user_id TEXT REFERENCES users(id),
  requested_at TIMESTAMP NOT NULL,
  dispatched_at TIMESTAMP,
  received_at TIMESTAMP,
  eod_blocking BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE stock_transfer_items (
  id TEXT PRIMARY KEY,
  transfer_id TEXT NOT NULL REFERENCES stock_transfers(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  requested_qty INTEGER NOT NULL,
  dispatched_qty INTEGER NOT NULL DEFAULT 0,
  received_qty INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  vehicle_number TEXT,
  vehicle_model TEXT,
  total_spend NUMERIC(12,2) NOT NULL DEFAULT 0,
  outstanding_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  tags TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE bills (
  id TEXT PRIMARY KEY,
  bill_number TEXT NOT NULL UNIQUE,
  branch_id TEXT NOT NULL REFERENCES branches(id),
  customer_id TEXT REFERENCES customers(id),
  status TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  discount_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  business_date DATE NOT NULL,
  printed_at TIMESTAMP,
  finalized_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE bill_items (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL REFERENCES bills(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12,2) NOT NULL
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL REFERENCES bills(id),
  mode TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  reference_number TEXT,
  status TEXT NOT NULL,
  received_by_user_id TEXT NOT NULL REFERENCES users(id),
  received_at TIMESTAMP NOT NULL
);

CREATE TABLE returns (
  id TEXT PRIMARY KEY,
  original_bill_id TEXT NOT NULL REFERENCES bills(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  reason TEXT NOT NULL,
  refund_mode TEXT NOT NULL,
  status TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE credit_notes (
  id TEXT PRIMARY KEY,
  credit_note_number TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES customers(id),
  original_bill_id TEXT REFERENCES bills(id),
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  gst_number TEXT,
  payment_terms TEXT,
  due_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT NOT NULL UNIQUE,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  status TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE purchase_bills (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  status TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  received_by_user_id TEXT NOT NULL REFERENCES users(id),
  received_at TIMESTAMP NOT NULL
);

CREATE TABLE staff_statuses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  skill TEXT NOT NULL,
  status TEXT NOT NULL,
  current_task TEXT,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE staff_requests (
  id TEXT PRIMARY KEY,
  requesting_branch_id TEXT NOT NULL REFERENCES branches(id),
  requested_skill TEXT NOT NULL,
  urgency TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE service_jobs (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id),
  customer_id TEXT REFERENCES customers(id),
  vehicle_number TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  assigned_staff_user_id TEXT REFERENCES users(id),
  estimated_amount NUMERIC(12,2) NOT NULL,
  final_amount NUMERIC(12,2),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE serial_numbers (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  branch_id TEXT NOT NULL REFERENCES branches(id),
  serial_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  bill_id TEXT REFERENCES bills(id),
  warranty_start_date DATE,
  warranty_end_date DATE
);

CREATE TABLE warranty_claims (
  id TEXT PRIMARY KEY,
  serial_number_id TEXT NOT NULL REFERENCES serial_numbers(id),
  customer_id TEXT REFERENCES customers(id),
  issue TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  resolved_at TIMESTAMP
);

CREATE TABLE eod_sessions (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL REFERENCES branches(id),
  business_date DATE NOT NULL,
  status TEXT NOT NULL,
  expected_cash NUMERIC(12,2) NOT NULL,
  counted_cash NUMERIC(12,2) NOT NULL,
  cash_variance NUMERIC(12,2) NOT NULL,
  pending_printed_bills INTEGER NOT NULL DEFAULT 0,
  pending_transfers INTEGER NOT NULL DEFAULT 0,
  blocking_reasons TEXT,
  closed_by_user_id TEXT REFERENCES users(id),
  closed_at TIMESTAMP,
  UNIQUE(branch_id, business_date)
);

CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  requested_by_user_id TEXT NOT NULL REFERENCES users(id),
  requested_to_user_id TEXT NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  decided_at TIMESTAMP
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  branch_id TEXT REFERENCES branches(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  reference_id TEXT,
  before_json JSON,
  after_json JSON,
  reason TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  branch_id TEXT REFERENCES branches(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE business_settings (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  bill_prefix TEXT NOT NULL,
  next_bill_number INTEGER NOT NULL,
  allow_negative_stock BOOLEAN NOT NULL DEFAULT FALSE,
  max_discount_percent_without_approval NUMERIC(5,2) NOT NULL,
  eod_cash_variance_threshold NUMERIC(12,2) NOT NULL,
  draft_bill_expiry_minutes INTEGER NOT NULL,
  transfer_receive_required_before_eod BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP NOT NULL
);

