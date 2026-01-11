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
        questionnaires: []
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
