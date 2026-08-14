# Implementation Flow — Student Development Passport (Vertical PPT Layout)

This vertical flowchart is optimized to fit cleanly into presentation slides or document columns.

---

## 📊 Vertical Flowchart

```mermaid
graph TD
    %% 1. Inputs (Stacked Vertically)
    subgraph Inputs ["1. Core Application Inputs"]
        A1["Academic Stats (GPA / Attendance)"]
        --> A2["Activity Details (Events / Hackathons)"]
        --> A3["Project Contributions (Role / Stack)"]
        --> A4["Evidence Proofs (PDF / Images)"]
    end

    %% 2. Processing Routing Engine
    B["2. Deterministic Routing Engine"]
    A4 --> B

    %% 3. Trust Classification (Stacked Vertically)
    subgraph Routes ["3. Trust Classification Routes"]
        C1["Institutional Route (Direct Sync)"]
        --> C2["Event / SIG Route (SIG Coordinator)"]
        --> C3["Faculty / TG Route (Teacher Guardian)"]
        --> C4["Self-Declared Route (Direct Log)"]
    end
    B --> C1

    %% 4. Fusion and Review
    D["4. Consolidated Review Queue"]
    C4 --> D

    E["5. Audit Record Assessment"]
    D --> E

    %% 5. Decision Diamond
    F{"6. Audit Decision"}
    E --> F

    %% 6. Decision Outflows (Stacked Vertically)
    F -->|Verify| G1["Verified (Commit to Ledger)"]
    F -->|Return| G2["Returned (Request Revision)"]
    F -->|Reject| G3["Rejected (Log Status)"]
    F -->|Bypass| G4["Self-Declared (Direct Log)"]

    %% Re-evaluate loop
    G2 -.->|Sends to Student| B

    %% 7. Sync Logger
    H["7. Audit Logger & State Sync"]
    G1 & G3 & G4 --> H

    %% 8. Ledger State
    I["8. Student Passport Ledger"]
    H --> I

    %% 9. Outputs (Stacked Vertically)
    subgraph Outputs ["9. Data Reuse Layer"]
        J1["HOD Institutional Search Registry"]
        --> J2["Print-Ready PDF Transcript"]
        --> J3["Future Extensions (Resume / e-Portfolio)"]
    end
    I --> J1

    %% Styling
    style B fill:#fef08a,stroke:#eab308,stroke-width:2px,color:#000
    style F fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#000
    style I fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#000
    style J3 stroke-dasharray: 5 5
```
