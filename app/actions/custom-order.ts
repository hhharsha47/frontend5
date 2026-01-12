"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// DB FILE PATH
const DB_PATH = path.join(process.cwd(), "mock_db.json");

// DATA INTERFACE
interface ActivityLogItem {
    id: number;
    action: string;
    user: string;
    detail: string;
    amount?: string;
    timestamp: string;
    initials: string;
    color: string;
}

interface MockDB {
    orders: any[];
    questionnaires: any[];
    quotes: any[];
    queries: any[]; // Missing from initial interface but likely implicit or unused
    activityLog: ActivityLogItem[];
    // Gallery support
    gallery: { [orderId: string]: GalleryImage[] };
    designs: Design[];
    shipments: Shipment[];
    reviews: Review[];
}

interface Design {
    id: string;
    orderId: string;
    version: number;
    images: { url: string; note: string }[];
    notes: string;
    status: 'pending_approval' | 'approved' | 'changes_requested';
    feedback?: string;
    createdAt: string;
    approvedAt?: string;
}

interface GalleryImage {
    id: string;
    url: string;
    caption: string;
    uploadedAt: string;
}

interface Shipment {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    shippedAt: string;
    deliveredAt?: string;
}

interface Review {
    id: string;
    orderId: string;
    rating: number;
    comment: string;
    submittedAt: string;
}

// LOAD DATA helper
function loadData(): MockDB {
    let retries = 3;
    while (retries > 0) {
        try {
            if (fs.existsSync(DB_PATH)) {
                const data = fs.readFileSync(DB_PATH, "utf-8");
                if (data) return JSON.parse(data);
            }
            break; // File doesn't exist, use default
        } catch (error) {
            console.error(`Error loading mock DB (attempt ${4-retries}):`, error);
            retries--;
            const start = Date.now();
            while (Date.now() - start < 100) {} // 100ms delay
        }
    }
    
    // If we exhausted retries and the file EXISTS, we must throw to avoid overwriting data with defaults.
    if (fs.existsSync(DB_PATH)) {
        throw new Error("Failed to load database after multiple retries. Preventing data overwrite.");
    }

    // Only return default if file truly does not exist
    return {
        orders: [
          {
            id: 1,
            orderReference: "REQ-001",
            clientName: "Michael Chen",
            email: "michael.chen@example.com",
            subject: "1/48 F-14 Tomcat - Top Gun Maverick",
            description: "I want a detailed replica of Maverick's F-14 from the new movie. Heavy weathering required.",
            status: "pending_admin_review",
            submittedAt: "2024-03-15T10:00:00Z",
            budget: "$850 - $1,200",
            image: "/images/products/f14_tomcat_model.png",
            questionnaireSent: false,
            questionnaireCompleted: false,
          },
          {
            id: 2,
            orderReference: "REQ-002",
            clientName: "Sarah Johnson",
            email: "sarah.j@example.com",
            subject: "P-51D Mustang Restoration",
            description: "Restoration of a vintage kit my grandfather built. Needs new decals and paint.",
            status: "enquiry_received",
            submittedAt: "2024-03-14T14:30:00Z",
            budget: "$400 - $600",
            image: "/images/products/p51d_mustang_model.png",
            questionnaireSent: false,
            questionnaireCompleted: false,
          },
        ],
        questionnaires: [],
        quotes: [],
        activityLog: [],
        designs: [],
        gallery: {},
        queries: [],
        shipments: [],
        reviews: []
    };
}

// SAVE DATA helper
function saveData(data: MockDB) {
    let retries = 3;
    while (retries > 0) {
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
            return;
        } catch (error) {
            console.error(`Error saving mock DB (attempt ${4-retries}):`, error);
            retries--;
            const start = Date.now();
            while (Date.now() - start < 100) {} // 100ms delay
        }
    }
}

// HELPER: Log Activity
function logActivity(db: MockDB, action: string, user: string, detail: string, amount: string = "-", color: string = "bg-slate-100 text-slate-700") {
    if (!db.activityLog) db.activityLog = [];
    
    // Create new log item
    const newItem: ActivityLogItem = {
        id: Date.now(),
        action,
        user,
        detail,
        amount,
        timestamp: new Date().toISOString(),
        initials: user.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        color
    };
    
    // Add to beginning of array
    db.activityLog.unshift(newItem);
    
    // Keep only last 50 items
    if (db.activityLog.length > 50) {
        db.activityLog = db.activityLog.slice(0, 50);
    }
    
    return db;
}

// Fetch Activity Log
export async function getRecentActivity() {
    const db = loadData();
    return db.activityLog || [];
}

export async function getCustomOrderDetails(id: string) {
  const db = loadData();

  // Try to find by ID or Reference
  const order = db.orders.find(o => o.orderReference === id || o.id.toString() === id);
  
  if (order) return order;

  // FALLBACK for Demo: If looking for a specific ID that doesn't exist, return a generic mock
  // This helps when navigating to /admin/custom-orders/CO-2026-679 without backend
  if (id.startsWith("CO-") || id.startsWith("REQ-")) {
      return {
        id: 999,
        orderReference: id,
        clientName: "Guest User",
        email: "guest@example.com",
        subject: "New Custom Project",
        description: "Project details...",
        status: "enquiry_received",
        submittedAt: new Date().toISOString(),
        budget: "TBD",
        image: null,
        questionnaireSent: false,
        questionnaireCompleted: false
      };
  }

  return null;
}

export async function updateCustomOrderStatus(orderId: string, status: string) {
  const db = loadData();

  
  const index = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
  if (index !== -1) {
    db.orders[index].status = status;
    saveData(db); // PERSIST
    
    revalidatePath(`/admin/custom-design/${orderId}`);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    return { success: true };
  }
  
  return { success: true };
}

export async function createQuestionnaire(orderId: string, data: any) {
  try {
    const db = loadData();

    
    console.log("Creating Questionnaire for", orderId, data);
    
    // Check if order mock exists
    let orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    
    // If not found, create a stub for it so the flow continues
    if (orderIndex === -1) {
        const newOrder = {
            id: db.orders.length + 100,
            orderReference: orderId,
            status: "questionnaire_sent", // Auto update status
            questionnaireSent: true, 
            clientName: "Guest",
            email: "guest@example.com",
            subject: "Auto-Created Order",
            description: "...",
            submittedAt: new Date().toISOString(),
            questionnaireCompleted: false
        };
        db.orders.push(newOrder);
        orderIndex = db.orders.length - 1;
    } else {
        // Update existing
        db.orders[orderIndex].status = "questionnaire_sent";
        db.orders[orderIndex].questionnaireSent = true;
    }
    
    // Save mock questionnaire
    const newQ = {
      id: db.questionnaires.length + 1,
      customOrderId: db.orders[orderIndex].id || orderId,
      orderReference: orderId,
      ...data,
      createdAt: new Date().toISOString()
    };
    db.questionnaires.push(newQ);
    
    saveData(db); // PERSIST

    revalidatePath(`/admin/custom-design/${orderId}`);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    
    return { success: true, questionnaireId: newQ.id };
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    return { success: false, error: "Failed to create questionnaire" };
  }
}

export async function submitQuestionnaireResponse(questionnaireId: number, responses: any) {
    const db = loadData();

    console.log("Submitting responses", questionnaireId, responses);
    
    // Find questionnaire
    const qIndex = db.questionnaires.findIndex(q => q.id === questionnaireId || q.orderReference === questionnaireId);
    
    if (qIndex !== -1) {
        // Save responses to the questionnaire
        db.questionnaires[qIndex].responses = responses;
        db.questionnaires[qIndex].respondedAt = new Date().toISOString();

        // Mark order as completed
        const orderRef = db.questionnaires[qIndex].orderReference;
        const oIndex = db.orders.findIndex(o => o.orderReference === orderRef);
        if (oIndex !== -1) {
            db.orders[oIndex].status = "questionnaire_completed";
            db.orders[oIndex].questionnaireCompleted = true;

            // Log Activity
            logActivity(
                db, 
                "Questionnaire Received", 
                db.orders[oIndex].clientName || "Guest User", 
                `completed questionnaire for ${db.orders[oIndex].orderReference}`,
                "-",
                "bg-blue-100 text-blue-700"
            );
        }
    }
    
    saveData(db); // PERSIST
    
    return { success: true };
}

// Helper to get ALL questionnaires for a user
export async function getOrderQuestionnaires(orderId: string) {
    const db = loadData();
    // Return ALL questionnaires for this order, sorted by creation (newest first)
    const questionnaires = db.questionnaires
        .filter(q => q.orderReference === orderId || q.customOrderId === orderId)
        .sort((a, b) => b.id - a.id);
    
    return questionnaires;
}

// Helper to get pending questionnaires for a user (Mocked)
export async function getPendingQuestionnaire(orderId: string) {
    const db = loadData();
    // Return the latest questionnaire for this order
    // We sort by ID desc to get latest if multiple
    const q = db.questionnaires
        .filter(q => q.orderReference === orderId || q.customOrderId === orderId)
        .sort((a, b) => b.id - a.id)[0];
    
    if (q) return q;

    return null;
}

// --- Phase 3: Quote Negotiation ---

export async function createQuote(orderId: string, data: any) {
    const db = loadData();
    if (!db.quotes) db.quotes = [];

    const newQuote = {
        id: db.quotes.length + 1,
        orderReference: orderId,
        version: 1, // Logic to increment version if previous quotes exist could be added here
        status: 'sent', // sent, accepted, rejected, expired
        amount: parseFloat(data.amount),
        currency: 'USD', // Default for now
        timeline: data.timeline, // e.g. "14 Days"
        validUntil: data.validUntil,
        scopeOfWork: data.scopeOfWork, // Array of strings
        terms: data.terms,
        createdAt: new Date().toISOString()
    };

    // Calculate version number
    const existingQuotes = db.quotes.filter((q: any) => q.orderReference === orderId);
    if (existingQuotes.length > 0) {
        newQuote.version = existingQuotes.length + 1;
    }

    db.quotes.push(newQuote);

    // Update Order Status
    const oIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id === orderId);
    if (oIndex !== -1) {
        db.orders[oIndex].status = "quote_sent";
        db.orders[oIndex].quoteSent = true;
        // Optimization: Store latest quote ID on order for easy access
        db.orders[oIndex].latestQuoteId = newQuote.id;
    }

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true, quote: newQuote };
}

export async function getQuotesForOrder(orderId: string) {
    const db = loadData();
    if (!db.quotes) return [];
    return db.quotes.filter(q => q.orderReference === orderId || q.customOrderId === orderId).sort((a,b) => b.id - a.id);
}

export async function acceptQuote(quoteId: number) {
    const db = loadData();
    const qIndex = db.quotes.findIndex(q => q.id === quoteId);
    if (qIndex === -1) return { success: false, error: 'Quote not found' };

    // Update Quote Status
    db.quotes[qIndex].status = 'accepted';
    db.quotes[qIndex].acceptedAt = new Date().toISOString();

    // Reject all other open quotes for this order
    const orderRef = db.quotes[qIndex].orderReference;
    db.quotes.forEach(q => {
        if (q.orderReference === orderRef && q.id !== quoteId && q.status === 'sent') {
            q.status = 'superseded';
        }
    });

    // Update Order Status
    const oIndex = db.orders.findIndex(o => o.orderReference === orderRef || o.id === orderRef);
    if (oIndex !== -1) {
        db.orders[oIndex].status = "quote_accepted";
        db.orders[oIndex].paymentPending = true;

        // Log Activity
        logActivity(
            db,
            "Quote Accepted",
            db.orders[oIndex].clientName || "Guest User",
            `accepted quote #${quoteId} for ${db.quotes[qIndex].currency} ${db.quotes[qIndex].amount}`,
            "Pending Payment",
            "bg-green-100 text-green-700"
        );
    }

    saveData(db);
    revalidatePath(`/profile`);
    revalidatePath(`/admin/custom-orders/${orderRef}`);
    return { success: true };
}

export async function rejectQuote(quoteId: number, reason: string) {
    const db = loadData();
    const qIndex = db.quotes.findIndex(q => q.id === quoteId);
    if (qIndex === -1) return { success: false, error: 'Quote not found' };

    // Update Quote Status
    db.quotes[qIndex].status = 'rejected';
    db.quotes[qIndex].rejectionReason = reason;

    // Update Order Status
    const orderRef = db.quotes[qIndex].orderReference;
    const oIndex = db.orders.findIndex(o => o.orderReference === orderRef || o.id === orderRef);
    if (oIndex !== -1) {
        db.orders[oIndex].status = "quote_revision_requested";

        // Log Activity
        logActivity(
            db,
            "Quote Rejected",
            db.orders[oIndex].clientName || "Guest User",
            `requested changes: "${reason}"`,
            "Revision Needed",
            "bg-red-100 text-red-700"
        );
    }

    saveData(db);
    revalidatePath(`/profile`);
    revalidatePath(`/admin/custom-orders/${orderRef}`);
    return { success: true };
}


// --- Phase 4: Invoice & Payment ---

export async function generateInvoice(orderId: string) {
  try {
    const db = await loadData();
    // Support finding by orderReference (mock usage) or direct ID
    const orderIndex = db.orders.findIndex((o) => o.id === orderId || o.orderReference === orderId);

    if (orderIndex === -1) {
      return { success: false, error: "Order not found" };
    }
    const order = db.orders[orderIndex];

    // In a real app, 'quote' would be linked. Here we assume the latest quote in db.quotes matches
    // Or we look at the 'quote' attached to the order if we persisted it.
    // For this mock, let's look up the accepted quote.
    const quote = db.quotes?.find(q => (q.orderReference === order.id || q.orderReference === order.orderReference) && q.status === 'accepted');

    if (!quote) {
        return { success: false, error: "No accepted quote found for this order" };
    }

    // Mock Invoice Generation
    const invoice = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        items: [
            { desc: "Custom Model Fabrication", qty: 1, price: quote.amount || 0 }
        ],
        subtotal: quote.amount || 0,
        tax: (quote.amount || 0) * 0.1, // 10% tax
        total: (quote.amount || 0) * 1.1,
        status: "unpaid"
    };

    db.orders[orderIndex].invoice = invoice;
    db.orders[orderIndex].status = "invoice_generated";
    
    await saveData(db);
    revalidatePath("/admin/custom-orders/[id]");
    revalidatePath("/(public)/profile");
    
    return { success: true, invoice };

  } catch (error) {
    console.error("Error generating invoice:", error);
    return { success: false, error: "Failed to generate invoice" };
  }
}

export async function processPayment(orderId: string, paymentMethod: string) {
    try {
        const db = await loadData();
        const orderIndex = db.orders.findIndex((o) => o.id === orderId || o.orderReference === orderId);
        
        if (orderIndex === -1) {
            return { success: false, error: "Order not found" };
        }
        
        const order = db.orders[orderIndex];

        if (!order.invoice) {
             return { success: false, error: "Invoice not found" };
        }

        // Simulate Processing Delay managed by UI
        order.invoice.status = "paid";
        order.invoice.paidAt = new Date().toISOString();
        order.invoice.paymentMethod = paymentMethod;
        order.status = "processing"; // Move to production phase
        order.paymentPending = false;

        // Log Activity
        logActivity(
            db,
            "Payment Received",
            order.clientName || "Guest User",
            `paid ${order.invoice.total.toFixed(2)} via ${paymentMethod}`,
            `$${order.invoice.total.toFixed(2)}`,
            "bg-emerald-100 text-emerald-700"
        );

        db.orders[orderIndex] = order;

        await saveData(db);
        revalidatePath("/(public)/profile");
        
        return { success: true };

    } catch (e) {
        console.error("Payment error", e);
        return { success: false, error: "Payment failed" };
    }
}

export async function syncOrderUpdates(orderIds: string[]) {
    const db = loadData();
    const updates: Record<string, any> = {};

    for (const id of orderIds) {
        // Find order
        const o = db.orders.find(ord => ord.orderReference === id || ord.id === id);
        if (!o) continue;

        const updateData: any = {
            id: id,
            status: o.status,
            quote: null,
            questionnaireStatus: null,
            questionnaire: null
        };

        // Check Questionnaire
        const qIndex = db.questionnaires.findIndex(q => q.orderReference === id || q.customOrderId === id);
        if (qIndex !== -1) {
            const q = db.questionnaires[qIndex];
            updateData.questionnaire = q;
            if (q.responses && Object.keys(q.responses).length > 0) {
                updateData.questionnaireStatus = "completed";
            } else {
                updateData.questionnaireStatus = "sent";
            }
        }

        // Check Quotes
        const quotes = db.quotes.filter(q => q.orderReference === id || q.customOrderId === id).sort((a,b) => b.id - a.id);
        if (quotes.length > 0) {
            updateData.quote = quotes[0];
        }

        updates[id] = updateData;
    }
    
    return updates;
}

// --- Phase 5: WIP Gallery ---

export async function uploadGalleryImage(orderId: string, url: string, caption: string) {
    const db = loadData();
    if (!db.gallery) db.gallery = {};
    if (!db.gallery[orderId]) db.gallery[orderId] = [];

    const newImage: GalleryImage = {
        id: Date.now().toString(),
        url,
        caption,
        uploadedAt: new Date().toISOString()
    };

    db.gallery[orderId].unshift(newImage); // Add to top
    
    // Log Activity
    logActivity(
        db,
        "Production Update",
        "Admin", 
        `uploaded a new WIP photo: "${caption}"`,
        "-",
        "bg-purple-100 text-purple-700"
    );

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true, image: newImage };
}

export async function getProjectGallery(orderId: string) {
    const db = loadData();
    if (!db.gallery || !db.gallery[orderId]) return [];
    return db.gallery[orderId];
    return db.gallery[orderId];
}

// --- Phase 6: Design & Approval ---

export async function uploadDesign(orderId: string, images: { url: string; note: string }[], notes: string) {
    const db = loadData();
    if (!db.designs) db.designs = [];

    // Calculate Version
    const existingDesigns = db.designs.filter(d => d.orderId === orderId);
    const version = existingDesigns.length + 1;

    const newDesign: Design = {
        id: Date.now().toString(),
        orderId,
        version,
        images, // Array of { url, note }
        notes,
        status: 'pending_approval',
        createdAt: new Date().toISOString()
    };

    db.designs.push(newDesign);

    // Update Order Status
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = "design_uploaded";
        // Log Activity
        logActivity(
            db,
            "Design Uploaded",
            "Admin",
            `uploaded Design V${version}`,
            "-",
            "bg-blue-100 text-blue-700"
        );
    }

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true, design: newDesign };
}

export async function approveDesign(designId: string) {
    const db = loadData();
    if (!db.designs) return { success: false, error: "No designs found" };

    const designIndex = db.designs.findIndex(d => d.id === designId);
    if (designIndex === -1) return { success: false, error: "Design not found" };

    // Update Design Status
    db.designs[designIndex].status = "approved";
    db.designs[designIndex].approvedAt = new Date().toISOString();

    // Update Order Status
    const orderId = db.designs[designIndex].orderId;
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = "design_approved";
        // Unlock next phase triggers here if needed
        logActivity(
            db,
            "Design Approved",
            db.orders[orderIndex].clientName || "User",
            `approved Design V${db.designs[designIndex].version}`,
            "-",
            "bg-green-100 text-green-700"
        );
    }

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true };
}

export async function requestDesignChanges(designId: string, feedback: string) {
    const db = loadData();
    if (!db.designs) return { success: false, error: "No designs found" };

    const designIndex = db.designs.findIndex(d => d.id === designId);
    if (designIndex === -1) return { success: false, error: "Design not found" };

    // Update Design Status
    db.designs[designIndex].status = "changes_requested";
    db.designs[designIndex].feedback = feedback;

    // Update Order Status
    const orderId = db.designs[designIndex].orderId;
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = "design_changes_requested";
        logActivity(
            db,
            "Changes Requested",
            db.orders[orderIndex].clientName || "User",
            `requested changes on V${db.designs[designIndex].version}`,
            "-",
            "bg-orange-100 text-orange-700"
        );
    }

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true };
}

export async function getDesigns(orderId: string) {
    const db = loadData();
    if (!db.designs) return [];
    // Return sorted by version desc
    return db.designs.filter(d => d.orderId === orderId).sort((a,b) => b.version - a.version);
}

// --- Phase 6: Delivery & Reviews ---

export async function markAsShipped(orderId: string, trackingNumber: string, carrier: string) {
    const db = loadData();
    if (!db.shipments) db.shipments = [];

    // Check if order exists
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    if (orderIndex === -1) return { success: false, error: "Order not found" };

    // Create Shipment Record
    const newShipment: Shipment = {
        orderId,
        trackingNumber,
        carrier,
        shippedAt: new Date().toISOString()
    };
    db.shipments.push(newShipment);

    // Update Order Status
    db.orders[orderIndex].status = "shipped";
    
    // Log Activity
    logActivity(
        db,
        "Order Shipped",
        "Admin",
        `shipped via ${carrier} (Tracking: ${trackingNumber})`,
        "-",
        "bg-indigo-100 text-indigo-700"
    );

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true };
}

export async function markAsDelivered(orderId: string) {
    const db = loadData();
    
    // Find Shipment
    const shipmentIndex = db.shipments ? db.shipments.findIndex(s => s.orderId === orderId) : -1;
    if (shipmentIndex !== -1) {
        db.shipments[shipmentIndex].deliveredAt = new Date().toISOString();
    }

    // Update Order Status
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = "delivered";
        
        logActivity(
            db,
            "Delivered",
            "System",
            `marked as delivered`,
            "-",
            "bg-teal-100 text-teal-700"
        );
    }

    saveData(db);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    revalidatePath(`/profile`);
    return { success: true };
}

export async function submitReview(orderId: string, rating: number, comment: string) {
    const db = loadData();
    if (!db.reviews) db.reviews = [];

    const newReview: Review = {
        id: Date.now().toString(),
        orderId,
        rating,
        comment,
        submittedAt: new Date().toISOString()
    };
    db.reviews.push(newReview);

    // Update Status to Completed
    const orderIndex = db.orders.findIndex(o => o.orderReference === orderId || o.id.toString() === orderId);
    if (orderIndex !== -1) {
        db.orders[orderIndex].status = "completed";
        
        logActivity(
            db,
            "Review Submitted",
            db.orders[orderIndex].clientName || "User",
            `rated ${rating}/5 stars`,
            "-",
            "bg-yellow-100 text-yellow-700"
        );
    }

    saveData(db);
    revalidatePath(`/profile`);
    revalidatePath(`/admin/custom-orders/${orderId}`);
    return { success: true };
}

export async function getShipmentDetails(orderId: string) {
    const db = loadData();
    if (!db.shipments) return null;
    return db.shipments.find(s => s.orderId === orderId) || null;
}

export async function getReview(orderId: string) {
    const db = loadData();
    if (!db.reviews) return null;
    return db.reviews.find(r => r.orderId === orderId) || null;
}
