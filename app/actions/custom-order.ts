"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// DB FILE PATH
const DB_PATH = path.join(process.cwd(), "mock_db.json");

// DATA INTERFACE
interface MockDB {
    orders: any[];
    questionnaires: any[];
    quotes: any[];
}

// LOAD DATA helper
function loadData(): MockDB {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, "utf-8");
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading mock DB:", error);
    }
    // Default initial data if no file
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
        quotes: []
    };
}

// SAVE DATA helper
function saveData(data: MockDB) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving mock DB:", error);
    }
}

// Initialize In-Memory access (will refresh on file change/reload if needed, but here we load on access mostly or simpler)
// For simplicity in this "use server" context, we'll load on every write, and maybe read.
// Actually, let's keep a module-level cache but reload if empty?
// Better: Load at start of action, save at end.

export async function getCustomOrderDetails(id: string) {
  const db = loadData();
  
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
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
  await new Promise((resolve) => setTimeout(resolve, 300));
  
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    
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
    await new Promise((resolve) => setTimeout(resolve, 500));
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

        db.orders[orderIndex] = order;

        await saveData(db);
        revalidatePath("/(public)/profile");
        
        return { success: true };

    } catch (e) {
        console.error("Payment error", e);
        return { success: false, error: "Payment failed" };
    }
}
