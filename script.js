
"use strict";

// -----------------------------------
// 1. APPLICATION STATE
// -----------------------------------

let currentRole = null;
let activityLogs = [];

// Virtual system permissions
const permissions = {
    user: ["read"],
    admin: [
        "read",
        "protected",
        "install",
        "users",
        "settings"
    ]
};

// Operation descriptions
const operations = {
    read: "Read Personal Files",
    protected: "Read Protected System Files",
    install: "Install System Software",
    users: "Manage User Accounts",
    settings: "Modify System Settings"
};


// -----------------------------------
// 2. LOGIN FUNCTION
// -----------------------------------

function login(role) {
    if (role !== "user" && role !== "admin") {
        return;
    }

    currentRole = role;

    document.getElementById("loginScreen")
        .classList.add("hidden");

    document.getElementById("dashboard")
        .classList.remove("hidden");

    document.getElementById("misconfiguration")
        .checked = false;

    updateDashboard();

    showResult(
        "Logged in as " + getRoleName(),
        "info"
    );

    addLog("LOGIN", "SUCCESS");
}


// -----------------------------------
// 3. UPDATE DASHBOARD
// -----------------------------------

function getRoleName() {
    return currentRole === "admin"
        ? "Administrator / Root"
        : "Normal User";
}

function updateDashboard() {
    document.getElementById("currentRole")
        .textContent = getRoleName();

    document.getElementById("privilegeLevel")
        .textContent = currentRole === "admin"
            ? "HIGH"
            : "LOW";
}


// -----------------------------------
// 4. PERMISSION VERIFICATION
// -----------------------------------

function hasPermission(action) {
    if (!currentRole) {
        return false;
    }

    return permissions[currentRole]
        .includes(action);
}


// -----------------------------------
// 5. EXECUTE SYSTEM OPERATIONS
// -----------------------------------

function executeAction(action) {
    if (!currentRole || !operations[action]) {
        return;
    }

    const operationName = operations[action];

    if (hasPermission(action)) {
        showResult(
            "ACCESS GRANTED: " +
            operationName +
            " completed successfully in the simulation.",
            "success"
        );

        addLog(operationName, "ALLOWED");
    } else {
        showResult(
            "ACCESS DENIED: " +
            operationName +
            " requires administrator privileges.",
            "error"
        );

        addLog(operationName, "DENIED");
    }
}


// -----------------------------------
// 6. PRIVILEGE ESCALATION SIMULATION
// -----------------------------------

function attemptEscalation() {
    if (!currentRole) {
        return;
    }

    const insecure = document.getElementById(
        "misconfiguration"
    ).checked;

    if (currentRole === "admin") {
        showResult(
            "You already have administrator privileges.",
            "info"
        );

        addLog("Privilege Escalation", "NOT REQUIRED");
        return;
    }

    if (!insecure) {
        showResult(
            "ESCALATION BLOCKED: The virtual system " +
            "is correctly configured.",
            "error"
        );

        addLog("Privilege Escalation", "BLOCKED");
        return;
    }

    // Simulated role change only.
    // No actual OS permissions are modified.

    currentRole = "admin";

    updateDashboard();

    showResult(
        "SIMULATED ESCALATION SUCCESSFUL! " +
        "An insecure configuration allowed the " +
        "normal user to obtain virtual administrator " +
        "privileges.",
        "success"
    );

    addLog(
        "Privilege Escalation",
        "SIMULATED SUCCESS"
    );
}


// -----------------------------------
// 7. DISPLAY RESULTS
// -----------------------------------

function showResult(message, type) {
    const result = document.getElementById("result");

    result.textContent = message;
    result.className = type;
}


// -----------------------------------
// 8. SECURITY ACTIVITY LOG
// -----------------------------------

function addLog(action, status) {
    const time = new Date().toLocaleTimeString();

    const entry = {
        time: time,
        role: getRoleName(),
        action: action,
        status: status
    };

    activityLogs.unshift(entry);

    displayLogs();
}

function displayLogs() {
    const logContainer = document.getElementById(
        "activityLog"
    );

    logContainer.replaceChildren();

    activityLogs.forEach(log => {
        const entry = document.createElement("div");

        entry.className = "log-entry";

        entry.textContent =
            "[" + log.time + "] " +
            log.role + " | " +
            log.action + " | " +
            log.status;

        logContainer.appendChild(entry);
    });
}


// -----------------------------------
// 9. CLEAR LOGS
// -----------------------------------

function clearLogs() {
    activityLogs = [];

    displayLogs();

    showResult(
        "Activity logs cleared.",
        "info"
    );
}


// -----------------------------------
// 10. LOGOUT
// -----------------------------------

function logout() {
    if (currentRole) {
        addLog("LOGOUT", "SUCCESS");
    }

    currentRole = null;

    document.getElementById("dashboard")
        .classList.add("hidden");

    document.getElementById("loginScreen")
        .classList.remove("hidden");
}