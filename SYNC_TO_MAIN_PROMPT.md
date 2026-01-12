# Sync Instructions: Custom Order Workflow

**Goal**: Sync the fully implemented Custom Order Workflow (Phases 2-6) from the `frontend5` reference repository to the `skyscale-main` production repository.

**Strategy**: Since both repositories are on the same machine, the most reliable method is to directly read the source files and write them to the target structure. This ensures no code is lost relative to a copy-paste context limit.

---

## 🚀 The Ultimate Prompt

Copy and paste the following prompt into your Agent/AI interface:

```markdown
You are an expert Senior DevOps & Full Stack Engineer. Your task is to synchronize a complex feature set from a reference repository to our target repository.

**Reference Repo Path**: `E:/PROJECTS/ANAVE/frontend5`
**Target Repo Path**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend`

### 1. Dependencies Check
First, ensure the target repository (`apps/frontend/package.json`) has these dependencies. Install if missing:
- `lucide-react`
- `sonner`
- `framer-motion`
- `clsx`
- `tailwind-merge`

### 2. File Synchronization
Please READ the content of each "Source" file below and WRITE it to the "Target" path. Ensure you create any missing directories (`components/admin`, `components/custom-order`, etc.).

#### A. Backend Logic & Server Actions
*   **Source**: `E:/PROJECTS/ANAVE/frontend5/app/actions/custom-order.ts`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/app/actions/custom-order.ts`

#### B. Admin Components
*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/admin/QuoteBuilder.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/admin/QuoteBuilder.tsx`

*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/admin/QuestionnaireBuilder.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/admin/QuestionnaireBuilder.tsx`

#### C. User UI Components
*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/custom-order/QuoteViewer.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/custom-order/QuoteViewer.tsx`

*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/custom-order/InvoiceViewer.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/custom-order/InvoiceViewer.tsx`

*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/custom-order/QuestionnaireResponder.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/custom-order/QuestionnaireResponder.tsx`

*   **Source**: `E:/PROJECTS/ANAVE/frontend5/components/custom-order/ProjectGallery.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/components/custom-order/ProjectGallery.tsx`

#### D. Page Implementations
*   **Source**: `E:/PROJECTS/ANAVE/frontend5/app/admin/custom-orders/[id]/page.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/app/admin/custom-orders/[id]/page.tsx`

*   **Source**: `E:/PROJECTS/ANAVE/frontend5/app/(public)/profile/page.tsx`
*   **Target**: `E:/PROJECTS/ANAVE/new/skyscale-main/apps/frontend/src/app/(public)/profile/page.tsx`

### 3. Post-Sync Verification
After transferring the files, please:
1.  Check `app/actions/custom-order.ts` for the `DB_PATH` constant. It likely points to `mock_db.json`. Ensure `mock_db.json` is created or copied to the target root if it relies on it.
2.  Verify import paths. The source uses `@/` alias. Ensure the target `tsconfig.json` paths mapping matches (usually `@/*` -> `./src/*`).
```

---

## 💡 Notes for Manual Sync (If preferred)

If you prefer to move files manually via terminal, you can use these PowerShell commands:

```powershell
$Source = "E:\PROJECTS\ANAVE\frontend5"
$Dest = "E:\PROJECTS\ANAVE\new\skyscale-main\apps\frontend\src"

# Create Dirs
New-Item -ItemType Directory -Force -Path "$Dest\app\actions"
New-Item -ItemType Directory -Force -Path "$Dest\components\admin"
New-Item -ItemType Directory -Force -Path "$Dest\components\custom-order"
New-Item -ItemType Directory -Force -Path "$Dest\app\admin\custom-orders\[id]"

# Copy Files
Copy-Item "$Source\app\actions\custom-order.ts" "$Dest\app\actions\" -Force
Copy-Item "$Source\components\admin\*" "$Dest\components\admin\" -Force
Copy-Item "$Source\components\custom-order\*" "$Dest\components\custom-order\" -Force
Copy-Item "$Source\app\admin\custom-orders\[id]\page.tsx" "$Dest\app\admin\custom-orders\[id]\" -Force
Copy-Item "$Source\app\(public)\profile\page.tsx" "$Dest\app\(public)\profile\" -Force
```
