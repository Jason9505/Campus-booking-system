const authManager = {
  getUsers() {
    const users = localStorage.getItem("crbsUsers");
    return users ? JSON.parse(users) : [];
  },

  saveUsers(users) {
    localStorage.setItem("crbsUsers", JSON.stringify(users));
  },

  userExists(email) {
    return this.getUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  registerUser(email, password, fullName, userId, department, role) {
    if (this.userExists(email)) {
      return { success: false, message: "Email already registered. Please login or use a different email." };
    }

    const users = this.getUsers();
    users.push({
      email: email.toLowerCase(),
      password,
      fullName,
      userId,
      department,
      role,
    });
    this.saveUsers(users);
    return { success: true, message: "Registration successful! Redirecting to login..." };
  },

  validateLogin(email, password) {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: "Email not registered. Please create an account first." };
    }

    if (user.password !== password) {
      return { success: false, message: "Incorrect password. Please try again." };
    }

    return { success: true, user };
  },

  loginUser(user) {
    localStorage.setItem("crbsRole", user.role);
    localStorage.setItem("crbsName", user.fullName);
    localStorage.setItem("crbsEmail", user.email);
    localStorage.setItem("crbsCurrentUser", JSON.stringify(user));
  },

  getCurrentUser() {
    const user = localStorage.getItem("crbsCurrentUser");
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem("crbsRole");
    localStorage.removeItem("crbsName");
    localStorage.removeItem("crbsEmail");
    localStorage.removeItem("crbsCurrentUser");
  },
};

const dashboardData = {
  student: {
    initials: "ST",
    title: "Student Dashboard",
    subtitle: "Booking access",
    eyebrow: "Student view",
    heading: "Student Dashboard",
    description: "Search resources, create bookings, and manage personal booking history.",
    stats: [
      ["Upcoming Bookings", "3", "This week"],
      ["Pending Approval", "1", "Waiting decision"],
      ["Available Rooms", "18", "Today"],
      ["Notifications", "5", "Unread"],
    ],
    primary: `
      <h2>Quick Book</h2>
      <form data-form="quick-book">
        <div class="form-grid">
          <label>Resource type<select required><option value="">Choose resource</option><option>Meeting Room</option><option>Computer Lab</option><option>Projector</option></select></label>
          <label>Date<input type="date" required /></label>
          <label>Time<input type="time" required /></label>
          <label>Capacity<input type="number" min="1" placeholder="20" required /></label>
        </div>
        <button class="primary-btn" type="submit">Search Available Resources</button>
        <p class="form-message"></p>
      </form>
    `,
    secondary: `
      <h2>Student Access</h2>
      <p>Visible screens: Search Resources, Create Booking, My Bookings, Notifications, and Profile.</p>
      <p>Hidden screens: Resource Management, Reports, and Policy Configuration.</p>
    `,
  },
  staff: {
    initials: "SF",
    title: "Staff Dashboard",
    subtitle: "Booking and approval access",
    eyebrow: "Staff view",
    heading: "Staff Dashboard",
    description: "Book resources, request specialised equipment, and review approval-related requests.",
    stats: [
      ["Upcoming Bookings", "5", "This week"],
      ["Special Requests", "2", "Pending review"],
      ["Available Labs", "8", "Today"],
      ["Notifications", "9", "Unread"],
    ],
    primary: `
      <h2>Staff Booking Panel</h2>
      <form data-form="quick-book">
        <div class="form-grid">
          <label>Resource type<select required><option value="">Choose resource</option><option>Meeting Room</option><option>Computer Lab</option><option>Projector</option><option>AV Equipment</option></select></label>
          <label>Date<input type="date" required /></label>
          <label>Time<input type="time" required /></label>
          <label>Booking type<select><option>Single</option><option>Recurring</option></select></label>
        </div>
        <button class="primary-btn" type="submit">Search Staff Resources</button>
        <p class="form-message"></p>
      </form>
    `,
    secondary: `
      <h2>Staff Access</h2>
      <p>Visible screens: Search Resources, Create Booking, My Bookings, and Pending Approvals.</p>
      <p>Staff can request recurring bookings and specialised equipment.</p>
    `,
  },
  admin: {
    initials: "AD",
    title: "Admin Dashboard",
    subtitle: "System management access",
    eyebrow: "Admin view",
    heading: "Admin Dashboard",
    description: "Manage resources, approvals, reports, booking policies, and system-wide activity.",
    stats: [
      ["Total Bookings", "128", "This month"],
      ["Active Users", "86", "Registered"],
      ["Pending Requests", "7", "Needs review"],
      ["Resources", "42", "Managed"],
    ],
    primary: `
      <h2>Administrative Summary</h2>
      <p><strong>Most used resource:</strong> Computer Lab 1</p>
      <p><strong>Peak booking day:</strong> Thursday</p>
      <p><strong>Policy status:</strong> Active</p>
      <p><strong>No-show rate:</strong> 4%</p>
    `,
    secondary: `
      <h2>Admin Access</h2>
      <p>Visible screens: Resource Management, Pending Approvals, Reports & Analytics, and Booking Policy Configuration.</p>
      <p>Student booking-only screens are hidden from the Admin navigation.</p>
    `,
  },
};

const getStoredRole = () => localStorage.getItem("crbsRole") || "student";

const setMessage = (form, text, isError = false) => {
  const message = form.querySelector(".form-message");

  if (!message) return;

  message.textContent = text;
  message.classList.toggle("error", isError);
};

const bindForms = () => {
  document.querySelectorAll("[data-form]").forEach((form) => {
    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setMessage(form, "Please complete the required fields correctly.", true);
        return;
      }

      if (form.dataset.form === "register") {
        const fullName = document.querySelector("#full-name").value.trim();
        const userId = document.querySelector("#user-id").value.trim();
        const department = document.querySelector("#department").value.trim();
        const email = document.querySelector("#register-email").value.trim();
        const role = document.querySelector("#register-role").value;
        const password = document.querySelector("#register-password").value;

        const result = authManager.registerUser(email, password, fullName, userId, department, role);
        setMessage(form, result.message, !result.success);

        if (result.success) {
          form.reset();
          updatePasswordStrength();
          window.setTimeout(() => {
            window.location.href = "login.html";
          }, 650);
        }
        return;
      }

      if (form.dataset.form === "login") {
        const email = document.querySelector("#login-email").value.trim();
        const password = document.querySelector("#login-password").value;

        const result = authManager.validateLogin(email, password);
        setMessage(form, result.message, !result.success);

        if (result.success) {
          authManager.loginUser(result.user);
          setMessage(form, "Login successful. Opening dashboard...");
          window.setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 550);
        }
        return;
      }

      const messages = {
        "quick-book": "Search criteria accepted. Available resources are ready.",
        search: "Resources filtered successfully.",
        "create-booking": "Booking request submitted successfully.",
        resource: "Resource information saved.",
        reports: "Report generated. Export options are available.",
        policy: "Booking policy saved and audit log updated.",
      };

      setMessage(form, messages[form.dataset.form] || "Action completed successfully.");

      if (form.dataset.form === "create-booking") {
        window.setTimeout(() => showScreen("my-bookings"), 450);
      }
    });
  });
};

const updatePasswordStrength = () => {
  const input = document.querySelector("#register-password");
  const meter = document.querySelector(".strength");

  if (!input || !meter) return;

  let score = 0;
  const value = input.value;

  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;

  const strength = !value ? "empty" : score <= 1 ? "weak" : score === 2 ? "medium" : "strong";
  meter.dataset.strength = strength;
  meter.querySelector("small").textContent = strength === "empty"
    ? "Password strength"
    : `${strength.charAt(0).toUpperCase()}${strength.slice(1)} password`;
};

const showScreen = (screenId) => {
  const target = document.getElementById(screenId);
  if (!target) return;

  document.querySelectorAll(".screen").forEach((section) => {
    section.classList.toggle("active", section.id === screenId);
  });

  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const applyRoleVisibility = (role) => {
  document.querySelectorAll(".role-student, .role-staff, .role-admin").forEach((element) => {
    element.classList.toggle("role-hidden", !element.classList.contains(`role-${role}`));
  });
};

const renderDashboard = () => {
  const role = getStoredRole();
  const data = dashboardData[role] || dashboardData.student;

  applyRoleVisibility(role);

  document.querySelector("#avatarInitials").textContent = data.initials;
  document.querySelector("#roleTitle").textContent = data.title;
  document.querySelector("#roleSubtitle").textContent = data.subtitle;
  document.querySelector("#dashboardEyebrow").textContent = data.eyebrow;
  document.querySelector("#dashboardHeading").textContent = data.heading;
  document.querySelector("#dashboardDescription").textContent = data.description;

  document.querySelector("#statGrid").innerHTML = data.stats.map(([label, value, note]) => `
    <article class="stat-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>
  `).join("");

  document.querySelector("#primaryPanel").innerHTML = data.primary;
  document.querySelector("#secondaryPanel").innerHTML = data.secondary;

  bindForms();
};

const bindDashboardActions = () => {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    authManager.logout();
    window.location.href = "login.html";
  });

  document.querySelectorAll(".approve-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".approval-card");
      card.querySelector("p").textContent = "Approved. User notification has been sent.";
      button.textContent = "Approved";
      button.disabled = true;
      card.querySelector(".reject-btn").disabled = true;
    });
  });

  document.querySelectorAll(".reject-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".approval-card");
      card.querySelector("p").textContent = "Rejected. Remarks would be recorded for the user.";
      button.textContent = "Rejected";
      button.disabled = true;
      card.querySelector(".approve-btn").disabled = true;
    });
  });

  document.querySelectorAll(".tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
    });
  });
};

const resourceManager = {
  resources: [
    { id: 1, name: "Meeting Room A", type: "Room", location: "Library Block", capacity: 12, status: "Available" },
    { id: 2, name: "Computer Lab 1", type: "Lab", location: "FCI Building", capacity: 30, status: "Available" },
    { id: 3, name: "AV Kit 2", type: "Equipment", location: "Equipment Desk", capacity: "", status: "Maintenance" },
    { id: 4, name: "Projector Set B", type: "Equipment", location: "Main Auditorium", capacity: "", status: "Available" },
  ],
  currentResourceId: null,

  init() {
    this.bindButtons();
    this.bindTableRows();
    this.bindFormSubmit();
    this.bindCloseButtons();
  },

  bindButtons() {
    document.getElementById("addResourceBtn")?.addEventListener("click", () => {
      this.currentResourceId = null;
      this.openPanel("Add Resource");
      this.clearForm();
    });

    document.querySelectorAll(".maintenance-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const resourceId = btn.closest(".resource-row").dataset.resourceId;
        this.openMaintenanceModal(resourceId);
      });
    });

    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const resourceId = btn.closest(".resource-row").dataset.resourceId;
        this.editResource(resourceId);
      });
    });
  },

  bindTableRows() {
    document.querySelectorAll(".resource-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          const resourceId = row.dataset.resourceId;
          this.editResource(resourceId);
        }
      });
    });
  },

  editResource(resourceId) {
    const resource = this.resources.find((r) => r.id == resourceId);
    if (!resource) return;

    this.currentResourceId = resourceId;
    this.openPanel("Edit Resource");
    document.getElementById("resourceName").value = resource.name;
    document.getElementById("resourceType").value = resource.type;
    document.getElementById("resourceLocation").value = resource.location;
    document.getElementById("resourceCapacity").value = resource.capacity || "";
    document.getElementById("resourceStatus").value = resource.status;
  },

  openPanel(title) {
    document.getElementById("panelTitle").textContent = title;
    document.getElementById("resourcePanel").classList.add("open");
    document.body.style.overflow = "hidden";
  },

  closePanel() {
    document.getElementById("resourcePanel").classList.remove("open");
    document.body.style.overflow = "";
  },

  bindFormSubmit() {
    document.getElementById("resourceForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("resourceName").value.trim();
      const type = document.getElementById("resourceType").value;
      const location = document.getElementById("resourceLocation").value.trim();
      const capacity = document.getElementById("resourceCapacity").value || "";
      const status = document.getElementById("resourceStatus").value;

      if (!name || !type || !location) {
        setMessage(e.target, "Please fill in all required fields.", true);
        return;
      }

      if (this.currentResourceId) {
        const resource = this.resources.find((r) => r.id == this.currentResourceId);
        if (resource) {
          resource.name = name;
          resource.type = type;
          resource.location = location;
          resource.capacity = capacity;
          resource.status = status;
          setMessage(e.target, "Resource updated successfully.");
        }
      } else {
        const newId = Math.max(...this.resources.map((r) => r.id), 0) + 1;
        this.resources.push({ id: newId, name, type, location, capacity, status });
        setMessage(e.target, "Resource added successfully.");
      }

      window.setTimeout(() => {
        this.closePanel();
        this.renderTable();
      }, 400);
    });
  },

  bindCloseButtons() {
    document.querySelectorAll(".close-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (btn.closest(".side-panel")) {
          this.closePanel();
        } else if (btn.closest(".modal")) {
          this.closeMaintenanceModal();
        }
      });
    });

    document.querySelectorAll('[data-action="cancel"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeMaintenanceModal();
      });
    });

    document.getElementById("maintenanceModal")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.closeMaintenanceModal();
      }
    });

    document.getElementById("resourcePanel")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.closePanel();
      }
    });
  },

  openMaintenanceModal(resourceId) {
    const resource = this.resources.find((r) => r.id == resourceId);
    if (!resource) return;

    this.currentResourceId = resourceId;
    document.getElementById("maintenanceResource").value = resource.name;
    document.getElementById("maintenanceStart").value = "";
    document.getElementById("maintenanceEnd").value = "";
    document.getElementById("maintenanceNotes").value = "";
    document.getElementById("maintenanceModal").classList.add("open");
    document.body.style.overflow = "hidden";

    const form = document.getElementById("maintenanceForm");
    form.onsubmit = (e) => this.scheduleMaintenanceSubmit(e);
  },

  closeMaintenanceModal() {
    document.getElementById("maintenanceModal").classList.remove("open");
    document.body.style.overflow = "";
  },

  scheduleMaintenanceSubmit(e) {
    e.preventDefault();

    const startDate = document.getElementById("maintenanceStart").value;
    const endDate = document.getElementById("maintenanceEnd").value;
    const notes = document.getElementById("maintenanceNotes").value;

    if (!startDate || !endDate) {
      setMessage(e.target, "Please select both start and end dates.", true);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setMessage(e.target, "End date must be after start date.", true);
      return;
    }

    const resource = this.resources.find((r) => r.id == this.currentResourceId);
    if (resource) {
      resource.status = "Maintenance";
      setMessage(e.target, `Maintenance scheduled from ${startDate} to ${endDate}.`);
      window.setTimeout(() => {
        this.closeMaintenanceModal();
        this.renderTable();
      }, 400);
    }
  },

  renderTable() {
    const tbody = document.getElementById("resourcesBody");
    tbody.innerHTML = this.resources.map((resource) => `
      <tr data-resource-id="${resource.id}" class="resource-row">
        <td><strong>${resource.name}</strong></td>
        <td>${resource.type}</td>
        <td>${resource.location}</td>
        <td>${resource.capacity || "-"}</td>
        <td><span class="badge ${this.getStatusClass(resource.status)}">${resource.status}</span></td>
        <td><button class="action-btn" type="button">Edit</button><button class="maintenance-btn" type="button">Maintenance</button></td>
      </tr>
    `).join("");

    this.bindTableRows();
    document.querySelectorAll(".maintenance-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const resourceId = btn.closest(".resource-row").dataset.resourceId;
        this.openMaintenanceModal(resourceId);
      });
    });

    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const resourceId = btn.closest(".resource-row").dataset.resourceId;
        this.editResource(resourceId);
      });
    });
  },

  getStatusClass(status) {
    return status === "Available" ? "ok" : status === "Maintenance" ? "warn" : "wait";
  },

  clearForm() {
    document.getElementById("resourceForm").reset();
    const message = document.getElementById("resourceForm").querySelector(".form-message");
    if (message) message.textContent = "";
  },
};

if (document.getElementById("resource-management")) {
  resourceManager.init();
}

const reportsManager = {
  currentReport: null,

  init() {
    this.setDefaultDates();
    this.bindFormSubmit();
    this.bindExportButtons();
  },

  setDefaultDates() {
    const today = new Date();
    const startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    document.getElementById("reportStart").value = this.formatDate(startDate);
    document.getElementById("reportEnd").value = this.formatDate(today);
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  bindFormSubmit() {
    document.getElementById("reportsForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const reportType = document.getElementById("reportType").value;
      const startDate = document.getElementById("reportStart").value;
      const endDate = document.getElementById("reportEnd").value;
      const resourceType = document.getElementById("reportResourceType").value;
      const department = document.getElementById("reportDepartment")?.value || "";

      if (!reportType || !startDate || !endDate) {
        setMessage(e.target, "Please fill in all required fields.", true);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setMessage(e.target, "End date must be after start date.", true);
        return;
      }

      setMessage(e.target, "Generating report...");

      window.setTimeout(() => {
        this.generateReport(reportType, startDate, endDate, resourceType, department);
        setMessage(e.target, "Report generated successfully.");
      }, 300);
    });
  },

  generateReport(type, startDate, endDate, resourceType, department) {
    const data = this.generateReportData(type, startDate, endDate, resourceType, department);
    this.currentReport = { type, startDate, endDate, resourceType, department, data };

    document.getElementById("reportContainer").style.display = "block";
    document.getElementById("reportTitle").textContent = data.title;
    document.getElementById("reportContent").innerHTML = this.renderReport(type, data);
  },

  generateReportData(type, startDate, endDate, resourceType, department) {
    const daysCount = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));

    if (type === "heatmap") {
      return this.generateHeatmapData(daysCount, resourceType);
    } else if (type === "trends") {
      return this.generateTrendsData(daysCount, resourceType);
    } else if (type === "summary") {
      return this.generateSummaryData(daysCount, resourceType, department);
    }
  },

  generateHeatmapData(days, resourceType) {
    const resources = [
      "Meeting Room A",
      "Meeting Room B",
      "Computer Lab 1",
      "Computer Lab 2",
      "Projector Set B",
      "AV Kit 2",
    ];

    const heatmap = resources.map((resource) => ({
      name: resource,
      utilization: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
    }));

    return {
      title: "Utilisation Heatmap",
      heatmap,
      avgUtilization: Math.round(
        heatmap.reduce((sum, r) => sum + r.utilization.reduce((a, b) => a + b, 0), 0) /
          (heatmap.length * 7)
      ),
      peakDay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
        Math.floor(Math.random() * 7)
      ],
    };
  },

  generateTrendsData(days, resourceType) {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const bookings = Array.from({ length: 7 }, (_, i) => ({
      day: weekDays[i],
      count: Math.floor(Math.random() * 40 + 20),
      cancelled: Math.floor(Math.random() * 5),
      noShow: Math.floor(Math.random() * 3),
    }));

    const totalBookings = bookings.reduce((sum, b) => sum + b.count, 0);
    const totalCancelled = bookings.reduce((sum, b) => sum + b.cancelled, 0);
    const totalNoShow = bookings.reduce((sum, b) => sum + b.noShow, 0);

    return {
      title: "Booking Trends",
      bookings,
      totalBookings,
      totalCancelled,
      totalNoShow,
      cancellationRate: Math.round((totalCancelled / (totalBookings + totalCancelled)) * 100),
      noShowRate: Math.round((totalNoShow / totalBookings) * 100),
    };
  },

  generateSummaryData(days, resourceType, department) {
    const departments = ["Engineering", "Science", "Business"];
    const summaryData = departments.map((dept) => ({
      department: dept,
      totalBookings: Math.floor(Math.random() * 200 + 100),
      noShows: Math.floor(Math.random() * 20),
      cancellations: Math.floor(Math.random() * 15),
    }));

    const totalBookings = summaryData.reduce((sum, d) => sum + d.totalBookings, 0);
    const totalNoShows = summaryData.reduce((sum, d) => sum + d.noShows, 0);

    return {
      title: "No-show Summary",
      summaryData,
      totalBookings,
      totalNoShows,
      noShowRate: Math.round((totalNoShows / totalBookings) * 100),
    };
  },

  renderReport(type, data) {
    if (type === "heatmap") {
      return this.renderHeatmapReport(data);
    } else if (type === "trends") {
      return this.renderTrendsReport(data);
    } else if (type === "summary") {
      return this.renderSummaryReport(data);
    }
  },

  renderHeatmapReport(data) {
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let html = `
      <div class="report-stats">
        <div class="report-stat">
          <strong>${data.avgUtilization}%</strong>
          <span>Average Utilization</span>
        </div>
        <div class="report-stat">
          <strong>${data.peakDay}</strong>
          <span>Peak Day</span>
        </div>
        <div class="report-stat">
          <strong>${data.heatmap.length}</strong>
          <span>Resources Tracked</span>
        </div>
      </div>
      <h3 class="report-title">Utilisation by Resource</h3>
    `;

    data.heatmap.forEach((resource) => {
      html += `<div style="margin-bottom: 20px;">
        <p style="margin: 0 0 10px; font-weight: 800; color: var(--ink);">${resource.name}</p>
        <div class="heatmap-grid">`;

      dayLabels.forEach((day, index) => {
        const value = resource.utilization[index];
        let className = "heatmap-low";
        if (value >= 70) className = "heatmap-very-high";
        else if (value >= 50) className = "heatmap-high";
        else if (value >= 30) className = "heatmap-medium";

        html += `<div class="heatmap-label ${className}" title="${day}: ${value}%">${value}%</div>`;
      });

      html += `</div></div>`;
    });

    html += `<div class="chart-legend">
      <div class="legend-item"><span class="legend-color heatmap-low"></span> 0-29%</div>
      <div class="legend-item"><span class="legend-color heatmap-medium"></span> 30-49%</div>
      <div class="legend-item"><span class="legend-color heatmap-high"></span> 50-69%</div>
      <div class="legend-item"><span class="legend-color heatmap-very-high"></span> 70%+</div>
    </div>`;

    return html;
  },

  renderTrendsReport(data) {
    const maxBookings = Math.max(...data.bookings.map((b) => b.count));
    const minHeight = 20;

    let html = `
      <div class="report-stats">
        <div class="report-stat">
          <strong>${data.totalBookings}</strong>
          <span>Total Bookings</span>
        </div>
        <div class="report-stat">
          <strong>${data.cancellationRate}%</strong>
          <span>Cancellation Rate</span>
        </div>
        <div class="report-stat">
          <strong>${data.noShowRate}%</strong>
          <span>No-show Rate</span>
        </div>
      </div>
      <h3 class="report-title">Weekly Booking Trends</h3>
      <div class="line-chart">`;

    data.bookings.forEach((booking) => {
      const heightPercent = Math.max(minHeight, (booking.count / maxBookings) * 260);
      html += `
        <div class="line-chart-point">
          <div class="line-chart-bar" style="height: ${heightPercent}px" title="${booking.day}: ${booking.count} bookings">
            <div class="line-chart-tooltip">
              ${booking.count}
            </div>
          </div>
        </div>`;
    });

    html += `</div>
      <div class="chart-labels">
        ${data.bookings.map((b) => `<span>${b.day}</span>`).join("")}
      </div>
      <h3 class="report-title">Detailed Breakdown</h3>
      <table class="report-table">
        <thead>
          <tr><th>Day</th><th>Confirmed</th><th>Cancelled</th><th>No-show</th><th>Total</th></tr>
        </thead>
        <tbody>
          ${data.bookings.map((b) => `
            <tr>
              <td><strong>${b.day}</strong></td>
              <td>${b.count - b.cancelled - b.noShow}</td>
              <td>${b.cancelled}</td>
              <td>${b.noShow}</td>
              <td>${b.count}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;

    return html;
  },

  renderSummaryReport(data) {
    let html = `
      <div class="report-stats">
        <div class="report-stat">
          <strong>${data.totalBookings}</strong>
          <span>Total Bookings</span>
        </div>
        <div class="report-stat">
          <strong>${data.totalNoShows}</strong>
          <span>Total No-shows</span>
        </div>
        <div class="report-stat">
          <strong>${data.noShowRate}%</strong>
          <span>No-show Rate</span>
        </div>
      </div>
      <h3 class="report-title">No-show Summary by Department</h3>
      <table class="report-table">
        <thead>
          <tr><th>Department</th><th>Total Bookings</th><th>No-shows</th><th>Cancellations</th><th>No-show Rate</th></tr>
        </thead>
        <tbody>
          ${data.summaryData.map((d) => `
            <tr>
              <td><strong>${d.department}</strong></td>
              <td>${d.totalBookings}</td>
              <td>${d.noShows}</td>
              <td>${d.cancellations}</td>
              <td>${Math.round((d.noShows / d.totalBookings) * 100)}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;

    return html;
  },

  bindExportButtons() {
    document.getElementById("exportPdfBtn").addEventListener("click", () => {
      this.exportPdf();
    });

    document.getElementById("exportCsvBtn").addEventListener("click", () => {
      this.exportCsv();
    });
  },

  exportPdf() {
    if (!this.currentReport) return;

    const title = `${this.currentReport.data.title} Report`;
    const content = document.getElementById("reportContent").innerText;
    const exportData = `${title}\n\nGenerated: ${new Date().toLocaleDateString()}\nDate Range: ${this.currentReport.startDate} to ${this.currentReport.endDate}\n\n${content}`;

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(exportData));
    element.setAttribute("download", `${title.replace(/ /g, "_")}_${Date.now()}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  exportCsv() {
    if (!this.currentReport) return;

    let csv = "";
    const table = document.querySelector(".report-table");

    if (table) {
      table.querySelectorAll("tr").forEach((row) => {
        const cols = row.querySelectorAll("td, th");
        const rowData = Array.from(cols).map((col) => `"${col.innerText}"`).join(",");
        csv += rowData + "\n";
      });
    }

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `Report_${this.currentReport.type}_${Date.now()}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
};

if (document.getElementById("reports")) {
  reportsManager.init();
}

document.querySelector("#register-password")?.addEventListener("input", updatePasswordStrength);

if (document.body.contains(document.querySelector("#dashboard"))) {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
  } else {
    renderDashboard();
    bindDashboardActions();
  }
}

updatePasswordStrength();
bindForms();
