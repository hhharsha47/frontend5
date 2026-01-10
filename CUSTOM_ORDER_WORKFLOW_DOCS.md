# SKYSCALE CUSTOM ORDER WORKFLOW - COMPLETE DOCUMENTATION

## 📋 Overview
**Schema Version**: 5.0 - Production Ready  
**Total Models**: 150+  
**Total Lines**: 3,307  
**Database**: PostgreSQL  

This documentation provides a complete guide to the custom order workflow system implemented in SkyScale.

---

## 🎯 **Custom Order Flow - Complete Journey**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: AI CONVERSATION & REQUIREMENT EXTRACTION                       │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Customer interacts with AI chatbot                                   │
│ 2. AI extracts requirements → JSON format                               │
│    - Model name, scale, colors, features, timeline, budget              │
│    - Reference images from customer                                      │
│ 3. System creates CustomOrder record                                    │
│    Status: enquiry_received                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: ADMIN REVIEW & OPTIONAL QUESTIONNAIRE                          │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Admin reviews extracted requirements                                 │
│    Status: pending_admin_review                                         │
│                                                                          │
│ 2. [OPTIONAL] Admin creates questionnaire if clarification needed       │
│    - Dynamic form creation (Google Forms style)                         │
│    - Question types: text, textarea, select, multi-select, file,       │
│      number, date, email, phone, url, rating, boolean                   │
│    Status: questionnaire_sent                                           │
│    Notification: Email to customer                                       │
│                                                                          │
│ 3. Customer answers questions on platform                               │
│    - Receives email notification                                        │
│    - Logs into account                                                   │
│    - Submits answers                                                     │
│    Status: questionnaire_completed                                      │
│                                                                          │
│ 4. Process can repeat if more clarification needed (iterative)          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: QUOTE NEGOTIATION (ITERATIVE)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Admin creates quote                                                  │
│    - Quoted amount (excluding shipping)                                 │
│    - Estimated timeline (days)                                           │
│    - Itemized breakdown (optional)                                       │
│    - Terms & conditions                                                  │
│    - Valid until date                                                    │
│    Status: quote_drafted → quote_sent                                   │
│    Notification: Email to customer                                       │
│                                                                          │
│ 2. Customer reviews quote                                               │
│    Options:                                                              │
│    a) Accept → Status: quote_accepted → Proceed to Phase 4             │
│    b) Reject with feedback                                               │
│       - Price modification request                                       │
│       - Timeline modification request                                    │
│       - General feedback                                                 │
│       Status: quote_revision_requested                                  │
│                                                                          │
│ 3. Admin creates revised quote (Version 2, 3, etc.)                    │
│    - All previous versions visible to both parties                      │
│    - Repeat until agreement                                              │
│                                                                          │
│ 4. Quote can expire if time-sensitive                                   │
│    Status: quote_expired                                                │
│    - Prevents zombie quotes being accepted months later                 │
│    - Material costs change, workload capacity changes                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: INVOICE & PAYMENT PLAN CREATION                                │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Admin generates invoice                                              │
│    - Base amount (order cost ONLY, no shipping)                        │
│    - Tax amount                                                          │
│    - Total amount (base + tax)                                          │
│    - Estimated timeline                                                  │
│    - Expected completion date                                            │
│    - PDF invoice uploaded                                                │
│    Status: invoice_generated                                            │
│                                                                          │
│ 2. Admin creates payment plan                                           │
│    Status: payment_plan_created                                         │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────────┐ │
│    │ OPTION A: FULL PAYMENT                                          │ │
│    ├─────────────────────────────────────────────────────────────────┤ │
│    │ Customer pays:                                                   │ │
│    │ 1. Order cost (100%) + Shipping cost (customer selects)        │ │
│    │    - Customer selects shipping method (Shiprocket/Manual)       │ │
│    │    - Pays full amount upfront                                   │ │
│    │ Status: awaiting_first_payment                                  │ │
│    └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│    ┌─────────────────────────────────────────────────────────────────┐ │
│    │ OPTION B: SPLIT PAYMENT (Admin-defined phases)                 │ │
│    ├─────────────────────────────────────────────────────────────────┤ │
│    │ Admin creates multiple payment phases:                          │ │
│    │                                                                  │ │
│    │ Phase 1: Design Phase                                           │ │
│    │   - 30% of order cost (or fixed amount)                        │ │
│    │   - Type: order_cost                                            │ │
│    │   - Customer pays to start design work                          │ │
│    │                                                                  │ │
│    │ Phase 2: Manufacturing Phase                                    │ │
│    │   - 40% of order cost                                           │ │
│    │   - Type: order_cost                                            │ │
│    │   - Unlocked after design approved                              │ │
│    │                                                                  │ │
│    │ Phase 3: Final Payment                                          │ │
│    │   - 30% of order cost                                           │ │
│    │   - Type: order_cost                                            │ │
│    │   - Before quality check                                        │ │
│    │                                                                  │ │
│    │ Phase 4: Shipping Payment                                       │ │
│    │   - 100% of shipping cost                                       │ │
│    │   - Type: shipping_cost                                         │ │
│    │   - Customer selects method (Shiprocket/Manual)                │ │
│    │   - Paid before dispatch                                        │ │
│    │                                                                  │ │
│    │ Total: 100% order + 100% shipping (split across phases)        │ │
│    │ Status: awaiting_first_payment                                  │ │
│    └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│ 3. Notification: Email to customer with invoice & payment plan         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 5: PAYMENT PROCESSING                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Customer makes payment                                               │
│    - Gateway: Razorpay or PayPal (No COD for custom orders)           │
│    - Payment tracked in OrderPayment table                              │
│    - isCustomOrderPayment flag = true                                   │
│    - Links to CustomOrderPaymentPhase                                   │
│                                                                          │
│ 2. Payment status updates:                                              │
│    Success:                                                              │
│    - PaymentPhaseStatus: paid                                           │
│    - PaymentStatus: paid                                                │
│    - Next phase unlocked (if split payment)                             │
│                                                                          │
│    Failure:                                                              │
│    - Status: payment_failed                                             │
│    - Customer can retry                                                  │
│    - Admin gets notification for follow-up                              │
│                                                                          │
│ 3. Admin tracks all payments in dashboard                               │
│    - Phase completion triggers next payment request                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 6: DESIGN & APPROVAL (ITERATIVE)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Admin starts design work                                             │
│    Status: design_phase_started                                         │
│    - Payment must be received before starting                           │
│                                                                          │
│ 2. Admin uploads design file (Version 1)                                │
│    - File formats: STL, OBJ, PNG, PDF, any format                      │
│    - Title, description, change notes                                    │
│    - Thumbnail generated (for images)                                    │
│    Status: design_uploaded → awaiting_design_approval                  │
│    Notification: Email to customer                                       │
│                                                                          │
│ 3. Customer reviews design on platform                                  │
│    - Can view/download file                                              │
│    - Images displayed on screen                                         │
│    - Other files: download to view                                      │
│                                                                          │
│ 4. Customer provides feedback                                           │
│    Options:                                                              │
│    a) Approve                                                            │
│       - Status: design_approved                                         │
│       - Proceed to manufacturing                                        │
│                                                                          │
│    b) Request Changes                                                    │
│       - Feedback text                                                    │
│       - Specific change requests                                        │
│       - Status: design_changes_requested                                │
│       - Notification: Email to admin                                     │
│                                                                          │
│ 5. Admin uploads revised design (Version 2, 3, etc.)                   │
│    - Version control maintained                                         │
│    - Change notes explain what was modified                             │
│    - Customer can see all versions and history                          │
│    - Repeat until customer approves                                     │
│                                                                          │
│ 6. No hard limit on iterations                                          │
│    - Customer satisfaction is priority                                   │
│    - Admin can "pull the plug" if unreasonable                          │
│    - All communication tracked                                           │
│                                                                          │
│ 7. [OPTIONAL] If split payment: Next payment unlocked                   │
│    Status: awaiting_next_payment                                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 7: MANUFACTURING & QUALITY                                        │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Manufacturing begins                                                  │
│    Status: manufacturing_started → manufacturing_in_progress            │
│    - Status updates visible to customer                                 │
│    - Email notifications for major milestones                           │
│                                                                          │
│ 2. Quality check                                                         │
│    Status: quality_check                                                │
│                                                                          │
│ 3. [OPTIONAL] If split payment: Final payment request                   │
│    Status: awaiting_final_payment                                       │
│    - Customer pays remaining balance                                     │
│                                                                          │
│ 4. Ready for shipping                                                   │
│    Status: ready_to_ship                                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 8: SHIPPING & DELIVERY                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Shipping payment (if not already paid)                               │
│    Status: awaiting_shipping_payment                                    │
│    - Customer selects shipping method                                    │
│    - Options: Shiprocket / Manual SkyScale shipping                     │
│    - Pays for shipping                                                   │
│                                                                          │
│ 2. Order packed and shipped                                             │
│    Status: shipped                                                       │
│    - Tracking number provided                                            │
│    - Real-time tracking updates                                         │
│    - Email notifications                                                 │
│                                                                          │
│ 3. Delivery                                                              │
│    Status: delivered                                                     │
│    - Delivery confirmation                                               │
│                                                                          │
│ 4. Order completion                                                      │
│    Status: completed                                                     │
│    - Customer satisfaction survey                                        │
│    - Review request                                                      │
└─────────────────────────────────────────────────────────────────────────┘

SPECIAL CASES:
┌─────────────────────────────────────────────────────────────────────────┐
│ ON HOLD                                                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ Status: on_hold                                                          │
│ Status Reason:                                                           │
│   - Customer unresponsive                                                │
│   - Payment delayed                                                       │
│   - Supplier dependency                                                   │
│   - Admin temporarily pauses work                                        │
│                                                                          │
│ Admin can resume at any time                                            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ CANCELLATION                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ Status: cancelled_by_admin                                              │
│ - Only admin can cancel (customer cannot)                               │
│ - Customer must raise support ticket if cancellation needed             │
│ - Cancellation reason tracked                                            │
│ - Refund policy applied (admin discretion)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 **Database Tables - Complete List**

### **Custom Order Core Tables** (11 tables)

1. **CustomOrder**
   - Main custom order record
   - Links to AI conversation and thread
   - Tracks overall status and timeline
   - Stores extracted requirements from AI

2. **CustomOrderQuote** (Versioned)
   - Quote details with version control
   - Quoted amount, timeline, breakdown
   - Valid until date (expiration tracking)
   - Multiple versions for iterations

3. **CustomOrderQuoteResponse**
   - Customer feedback on quotes
   - Accept/reject decision
   - Price/timeline modification requests
   - Tracked per quote version

4. **CustomOrderQuestionnaire**
   - Dynamic form creation by admin
   - Title, description, sent/completed timestamps
   - Links to multiple questions

5. **CustomOrderQuestion**
   - Individual questions in questionnaire
   - Question type (12 supported types)
   - Validation rules, options, help text
   - Sort order for display

6. **CustomOrderQuestionnaireResponse**
   - Customer answers to questions
   - Text, JSON, or file URLs
   - Timestamp tracking

7. **CustomOrderInvoice**
   - Invoice with PDF URL
   - Base amount (no shipping)
   - Tax, total amounts
   - Timeline estimates

8. **CustomOrderPaymentPlan**
   - Full or split payment selection
   - Shipping method and cost
   - Links to multiple phases

9. **CustomOrderPaymentPhase**
   - Individual payment phases
   - Amount (fixed or percentage)
   - Phase type (order_cost or shipping_cost)
   - Due dates, payment status

10. **CustomOrderDesign** (Versioned)
    - Design files with version control
    - File URL, type, size, thumbnail
    - Change notes for each version
    - Status tracking (draft → approved)

11. **CustomOrderDesignFeedback**
    - Customer feedback on designs
    - Approve/reject decision
    - Requested changes
    - Timestamp tracking

### **Supporting Tables** (6 tables)

12. **CustomOrderNote**
    - Customer notes during process
    - Admin replies to notes
    - Related to specific phases
    - Timestamp tracking

13. **CustomOrderStatusHistory**
    - Complete audit trail
    - From/to status transitions
    - Changed by (admin ID)
    - Status reason field
    - Change metadata

14. **AdminAuditLog**
    - **COMPREHENSIVE LOGGING**
    - Every admin action tracked
    - Entity type and ID
    - Old/new values (JSON)
    - IP address, user agent
    - Action type categorization

15. **Notification**
    - Email/SMS notifications
    - Customer and admin notifications
    - Delivery status tracking
    - Priority levels

16. **OrderPayment** (Enhanced)
    - Discriminator: `isCustomOrderPayment`
    - Links to `CustomOrderPaymentPhase`
    - Razorpay/PayPal integration
    - Transaction tracking

17. **Order** (Enhanced)
    - Discriminator: `orderType`
    - Values: `custom_order` or `regular_order`
    - Separates custom from regular orders

---

## 🔐 **Key Design Decisions**

### **1. Separation of Concerns**
- **Regular orders** and **custom orders** are separate
- Use `orderType` discriminator in Order table
- Custom order has its own comprehensive workflow

### **2. Version Control**
- **Quotes**: Version 1, 2, 3... (all visible)
- **Designs**: Version 1, 2, 3... (with change notes)
- Complete history maintained

### **3. Payment Flexibility**
- **Full payment**: Pay everything upfront
- **Split payment**: Admin-defined phases
- **Shipping**: Always separate (customer selects)
- **No COD**: Razorpay/PayPal only

### **4. Iterative Processes**
- **Questionnaires**: Can repeat
- **Quotes**: Negotiation until agreement
- **Designs**: Unlimited iterations (customer satisfaction)

### **5. Status + Reason Pattern**
```prisma
status: CustomOrderStatus      // Where in lifecycle
statusReason: String?          // Why (context)
```
Example:
```
status: on_hold
statusReason: "Awaiting customer clarification on tail number"
```

### **6. Customer Note System**
- Individual notes with timestamps
- Admin can reply to each note
- Tracked per custom order
- Related to specific phases

### **7. Admin Audit Logging**
- **EVERYTHING is logged**
- Not just custom orders
- All admin actions tracked:
  - Order actions
  - Product management
  - Discounts, campaigns
  - Loyalty, affiliate
  - Even "breathing" in admin panel 😄

### **8. Notification System**
- **Customer events**:
  - Order accepted
  - Questionnaire sent
  - Quote sent/accepted
  - Invoice ready
  - Payment due
  - Design uploaded
  - Design approved
  - Status updates
  - Order shipped

- **Admin events**:
  - New order
  - Questionnaire answered
  - Quote response
  - Payment received
  - Design feedback

### **9. No Cancellation for Customers**
- Only admin can cancel
- Customer must raise support ticket
- Cancellation reason tracked
- Refund at admin discretion

### **10. Shipping Logic**
- **Excluded from invoice** (order cost only)
- **Separate payment phase** (split payment)
- **Customer choice**: Shiprocket vs Manual
- **Full payment**: Shipping selected upfront
- **Split payment**: Shipping paid before dispatch

---

## 📈 **Status Transitions - Complete List**

```
CustomOrderStatus enum:

1.  enquiry_received              → AI extracted requirements
2.  pending_admin_review          → Admin reviewing
3.  questionnaire_sent            → [OPTIONAL] Questions sent
4.  questionnaire_completed       → Customer answered
5.  quote_drafted                 → Admin creating quote
6.  quote_sent                    → Quote sent to customer
7.  quote_revision_requested      → Customer wants changes
8.  quote_accepted                → Customer agreed
9.  quote_expired                 → Time-sensitive quote expired
10. invoice_generated             → Invoice created
11. payment_plan_created          → Payment plan set
12. awaiting_first_payment        → Waiting for initial payment
13. payment_failed                → Payment gateway failed
14. design_phase_started          → Design work begins
15. design_uploaded               → Design file uploaded
16. awaiting_design_approval      → Customer reviewing design
17. design_changes_requested      → Customer wants changes
18. design_approved               → Customer approved design
19. awaiting_next_payment         → Next phase payment due (split)
20. manufacturing_started         → Production begins
21. manufacturing_in_progress     → Work in progress
22. quality_check                 → QC phase
23. awaiting_final_payment        → Final payment due (split)
24. awaiting_shipping_payment     → Shipping payment due (split)
25. ready_to_ship                 → Ready for dispatch
26. shipped                       → Order dispatched
27. delivered                     → Order delivered
28. completed                     → Order complete
29. cancelled_by_admin            → Admin cancelled
30. on_hold                       → Paused (various reasons)
```

---

## 💾 **Question Types Supported**

```prisma
enum QuestionType {
  text              // Short text input
  textarea          // Long text input
  single_select     // Radio buttons
  multi_select      // Checkboxes
  file_upload       // File attachment
  number            // Number input
  date              // Date picker
  email             // Email input
  phone             // Phone number input
  url               // URL input
  rating            // Star rating (1-5)
  boolean           // Yes/No toggle
}
```

---

## 🔗 **Key Relations**

```
CustomOrder
├── quotes: CustomOrderQuote[]
├── questionnaires: CustomOrderQuestionnaire[]
├── invoice: CustomOrderInvoice (1:1)
├── designs: CustomOrderDesign[]
├── notes: CustomOrderNote[]
├── statusHistory: CustomOrderStatusHistory[]
├── conversation: AiConversation
├── thread: AiThread
└── user: AuthUser

CustomOrderInvoice
└── paymentPlan: CustomOrderPaymentPlan (1:1)
    └── phases: CustomOrderPaymentPhase[]

CustomOrderQuote
└── responses: CustomOrderQuoteResponse[]

CustomOrderQuestionnaire
└── questions: CustomOrderQuestion[]
    └── responses: CustomOrderQuestionnaireResponse[]

CustomOrderDesign
└── feedback: CustomOrderDesignFeedback[]

OrderPayment (Enhanced)
├── isCustomOrderPayment: Boolean
└── customOrderPaymentPhaseId: Int?
```

---

## 🎨 **UI/UX Flow**

### **Customer Dashboard**
1. **My Custom Orders** section
2. Order card showing:
   - Order reference
   - Current status
   - Next action required
   - Timeline progress
3. Click to view details:
   - Requirements
   - Quote history
   - Invoice
   - Payment plan
   - Design versions
   - Notes/communication
   - Status history

### **Admin Panel**
1. **Custom Orders Queue**
2. Filters by status
3. Order details page:
   - Customer info
   - Requirements
   - Create questionnaire
   - Create/revise quote
   - Generate invoice
   - Set payment plan
   - Upload designs
   - Reply to notes
   - Update status
   - View audit log

---

## 🚀 **Next Steps**

1. **Run Prisma Migrations**
   ```bash
   npx prisma migrate dev --name custom_order_workflow
   ```

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Seed Initial Data**
   - Question types configuration
   - Status transition rules
   - Notification templates

4. **Implement Business Logic**
   - Payment phase unlocking
   - Status transition validation
   - Notification triggers
   - Email templates

5. **Build Admin UI**
   - Custom order queue
   - Questionnaire builder
   - Quote management
   - Invoice generation
   - Design upload interface

6. **Build Customer UI**
   - Order tracking
   - Questionnaire submission
   - Quote review
   - Payment processing
   - Design approval

---

## 📝 **Important Notes**

1. **AI is only for initial order taking**
   - After enquiry received, it's all software
   - No AI involvement in workflow

2. **Everything is tracked**
   - Status history
   - Admin actions
   - Customer feedback
   - Payment attempts
   - Communication

3. **Email notifications everywhere**
   - Every status change
   - Every action from admin/customer
   - Payment reminders
   - Design approvals

4. **Version control is key**
   - Quotes (multiple versions)
   - Designs (multiple versions)
   - All visible to both parties

5. **Customer satisfaction priority**
   - No hard limits on iterations
   - Design approval is iterative
   - Admin can pull plug if needed

6. **Security**
   - Customer can only view own orders
   - Admin audit log comprehensive
   - Payment gateway integration secure

---

## ✅ **Schema Completeness Checklist**

- [x] Custom order main table
- [x] Quote system (versioned, iterative)
- [x] Questionnaire system (dynamic forms)
- [x] Invoice & payment plan
- [x] Design version control
- [x] Customer notes & communication
- [x] Status history tracking
- [x] Admin audit logging (comprehensive)
- [x] Notification system
- [x] Payment integration
- [x] Shipping integration
- [x] AI conversation linkage
- [x] Regular e-commerce features
- [x] Analytics & behavior tracking
- [x] Support ticketing
- [x] Affiliate & loyalty programs
- [x] All enums defined
- [x] All indexes created
- [x] All relations mapped

**Result**: ✅ **PRODUCTION READY**

---

**Schema File**: `skyscale_final_complete.prisma` (3,307 lines)
**Documentation**: This file
**Date**: January 9, 2026
**Version**: 5.0 - Final
