# Codebase Audit Report V4 (Market Aligned)
**Date**: December 11, 2025  
**Scope**: Application vs. Industry Standards (Philippines)  
**Status**: ⚠️ MVP Good, but missing "Boarding House" specifics.

---

## 🔍 Market Research vs. Current Reality

I compared our app against top features of "Boarding House Management Systems" in the Philippines.

| Market Standard Feature | Our App | Gap Severity |
| :--- | :--- | :--- |
| **Rent Collection (Automated)** | Manual Invoices only | 🔴 **CRITICAL** |
| **Utility Billing (Sub-meters)** | Generic "Expense" only | 🟠 **HIGH** (Common in PH) |
| **Bed Management** | Room-level only | 🟡 **MEDIUM** (For dorms) |
| **Lease Renewal** | "Evict" only | 🔴 **CRITICAL** |
| **Visitor Log** | Missing | 🟢 **LOW** (Nice to have) |
| **Online Reservations** | Tenant Assignment only | 🟡 **MEDIUM** |

---

## 🚨 The "Big Four" Missing Features

### 1. Lease Renewal (Operational Blocker)
**Why**: You cannot run a business if you can't extend a tenant's stay without deleting them.
**Plan**: Implement `RenewLeaseDialog` immediately.

### 2. Recursive Billing (Efficiency Blocker)
**Why**: Manually creating 50 invoices every 1st of the month is not scalable.
**Plan**: Implement Cron Jobs for automatic invoice generation.

### 3. Utility Meter Readings (Revenue Blocker)
**Why**: Boarding houses usually charge for Water/Electricity based on sub-meter readings ($/kWh).
**Plan**: Create `MeterReadings` table and "Generate Utility Invoice" feature.

### 4. Bed-Level Assignment (Accuracy Blocker)
**Why**: Currently we assign to "Room". If Room 101 has 4 beds, we can't specify "Bed A".
**Plan**: Update schema to support `bed_id` (Future Phase).

---

## ✅ Recommended Roadmap

1.  **Fix the Basics (Now)**: Implement **Lease Renewal**.
2.  **Automate (Next)**: Implement **Recurring Rent**.
3.  **Specialize (Later)**: Implement **Utility Meter Readings**.

This prioritizes "Running the business" over "Niche features".
