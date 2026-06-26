const ROLE_MAP = {
  Student: 'student',
  FacultyStaff: 'staff',
  ResourceManager: 'staff',
  Admin: 'admin',
};

const API = {
  async request(method, path, body) {
    const token = localStorage.getItem('crbsToken');
    const res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!json.success) {
      const err = new Error(json.message || 'Request failed');
      err.data = json;
      throw err;
    }
    return json.data;
  },
  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },
};

const authManager = {
  async registerUser(email, password, fullName, campusId, department, role) {
    const roleMap = { student: 'Student', staff: 'FacultyStaff', admin: 'Admin' };
    const result = await API.post('/api/auth/register', {
      name: fullName,
      email,
      password,
      role: roleMap[role] || 'Student',
      department,
      campusId,
    });
    return { success: true, message: 'Registration successful! Redirecting to login...' };
  },

  async loginUser(email, password) {
    const result = await API.post('/api/auth/login', { email, password });
    const mappedRole = ROLE_MAP[result.user.role] || 'student';
    localStorage.setItem('crbsToken', result.token);
    localStorage.setItem('crbsRole', mappedRole);
    localStorage.setItem('crbsName', result.user.name);
    localStorage.setItem('crbsEmail', result.user.email);
    localStorage.setItem('crbsCurrentUser', JSON.stringify(result.user));
    return result;
  },

  getCurrentUser() {
    const user = localStorage.getItem('crbsCurrentUser');
    return user ? JSON.parse(user) : null;
  },

  async logout() {
    try {
      await API.post('/api/auth/logout');
    } catch (_) {
      // Proceed with local cleanup even if API call fails
    }
    localStorage.removeItem('crbsToken');
    localStorage.removeItem('crbsRole');
    localStorage.removeItem('crbsName');
    localStorage.removeItem('crbsEmail');
    localStorage.removeItem('crbsCurrentUser');
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
          <label>Resource type
            <select id="quickBookType" required>
              <option value="">Choose resource</option>
            </select>
          </label>
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setMessage(form, "Please complete the required fields correctly.", true);
        return;
      }

      if (form.dataset.form === "register") {
        const fullName = document.querySelector("#full-name").value.trim();
        const campusId = document.querySelector("#user-id").value.trim() || null;
        const department = document.querySelector("#department").value.trim();
        const email = document.querySelector("#register-email").value.trim();
        const role = document.querySelector("#register-role").value;
        const password = document.querySelector("#register-password").value;

        try {
          const result = await authManager.registerUser(email, password, fullName, campusId, department, role);
          setMessage(form, result.message, !result.success);
          form.reset();
          updatePasswordStrength();
          window.setTimeout(() => {
            window.location.href = "login.html";
          }, 650);
        } catch (err) {
          setMessage(form, err.message || "Registration failed. Please try again.", true);
        }
        return;
      }

      if (form.dataset.form === "login") {
        const email = document.querySelector("#login-email").value.trim();
        const password = document.querySelector("#login-password").value;

        try {
          await authManager.loginUser(email, password);
          setMessage(form, "Login successful. Opening dashboard...");
          window.setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 550);
        } catch (err) {
          setMessage(form, err.message || "Login failed. Please try again.", true);
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

  const stats = data.stats || [];

  document.querySelector("#statGrid").innerHTML =
  stats.map(([label, value, note]) => `
      <article class="stat-card">
          <span>${label}</span>
          <strong>${value}</strong>
          <small>${note}</small>
      </article>
  `).join("");

  document.querySelector("#primaryPanel").innerHTML = data.primary;
  document.querySelector("#secondaryPanel").innerHTML = data.secondary;

  bindForms();
};

const bindDashboardActions = () => {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await authManager.logout();
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

    document.querySelectorAll(".maintenance-btn")
      .forEach(btn => {

        btn.addEventListener("click", () => {

          console.log("DELETE CLICKED");
          const id =
              btn.dataset.id;

              deleteResource(id);
        });

      });

    document.querySelectorAll(".action-btn")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        console.log("EDIT CLICKED");
        console.log(this);
        const id =
          btn.dataset.id;

                editResource(id);
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

      const reportType =
        document.getElementById(
          'reportType'
        ).value;

      const startDate =
        document.getElementById(
          'reportStart'
        ).value;

      const endDate =
        document.getElementById(
          'reportEnd'
        ).value;

      const resourceType =
        document.getElementById(
          'reportResourceType'
        ).value;

      const department =
        document.getElementById(
          'reportDepartment'
        ).value;

      if (!reportType || !startDate || !endDate) {
        setMessage(e.target, "Please fill in all required fields.", true);
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        setMessage(e.target, "End date must be after start date.", true);
        return;
      }

      setMessage(e.target, "Generating report...");
    });
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

///////

async function loadPolicySummary(){

    try{

        const response =
        await fetch(
            "/api/policy",
            {
                headers:{
                    Authorization:
                    `Bearer ${localStorage.getItem("crbsToken")}`
                }
            }
        );

        const result =
        await response.json();

        if(!result.success) return;

        const p =
        result.data;

        document.getElementById("policyMaximumDuration").textContent =
        p.maximumDuration;

        document.getElementById("policyMinimumNotice").textContent =
        p.minimumNotice;

        document.getElementById("policyAdvanceDays").textContent =
        p.maxAdvanceDays + " days";

        document.getElementById("policyCancellationDeadline").textContent =
        p.cancellationDeadline;

    }

    catch(err){

        console.error(err);

    }

}

///////

async function editResource(resourceID) {

  try {

    const response =
      await fetch(
        `/api/resources/${resourceID}`,
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem('crbsToken')}`
          }
        }
      );

    const result =
      await response.json();

    const resource =
      result.data;

    document.getElementById(
      'editingResourceID'
    ).value =
      resource.resourceID;

    document.getElementById(
      'resourceName'
    ).value =
      resource.name;

    document.getElementById(
      'resourceType'
    ).value =
      resource.type;

    document.getElementById(
      'resourceLocation'
    ).value =
      resource.location || '';

    document.getElementById(
      'resourceCapacity'
    ).value =
      resource.capacity || '';

    document.getElementById(
      'resourceStatus'
    ).value =
      resource.status;

    document.getElementById(
      'panelTitle'
    ).textContent =
      'Edit Resource';

    document.getElementById(
      'resourcePanel'
    ).classList.add('open');

  } catch (err) {

    console.error(err);

  }

}

async function loadResources() {
  try {

    const resources = await API.get('/api/resources');

    const container =
      document.getElementById('resourceResults');

    container.innerHTML = '';

    resources.forEach(resource => {

      container.innerHTML += `
        <article class="resource-card">
          <div>
            <h3>${resource.name}</h3>

            <p>
              ${resource.location || 'N/A'}
              -
              Capacity: ${resource.capacity || '-'}
              -
              Status: ${resource.status}
            </p>

            <p>
              Type: ${resource.type}
            </p>
          </div>

          <button
            class="book-btn"
            data-id="${resource.resourceID}"
            data-name="${resource.name}"
            type="button">
            Book
          </button>
        </article>
      `;
    });

    document.querySelectorAll(".book-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            selectResource(
                btn.dataset.id,
                btn.dataset.name
            );

        });

    });

    displayResources(resources);
  } catch (err) {
    console.error(err);
  }
}

const bookingForm =
  document.querySelector(
    '[data-form="create-booking"]'
  );

if (bookingForm) {

  bookingForm.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();
      console.log('BOOKING FORM SUBMITTED');

      try {

        const resourceID =
          document.getElementById(
            'resourceID'
          ).value;

        const date =
          document.getElementById(
            'createBookingDate'
          ).value;

        const startTime =
          document.getElementById(
            'startTime'
          ).value;

        const endTime =
          document.getElementById(
            'endTime'
          ).value;

        const startDateTime =
          `${date} ${startTime}:00`;

        const endDateTime =
          `${date} ${endTime}:00`;

          console.log({
            resourceID,
            date,
            startTime,
            endTime
          });
        const response =

          await fetch(
            '/api/bookings',
            {
              method: 'POST',
              headers: {
                'Content-Type':
                  'application/json',
                Authorization:
                  `Bearer ${localStorage.getItem('crbsToken')}`
              },
              body: JSON.stringify({
                resourceID,
                startDateTime,
                endDateTime
              })
            }
          );

        const result =
          await response.json();

        document.getElementById(
          'bookingMessage'
        ).textContent =
          result.message;

      } catch (err) {

        console.error(err);

        document.getElementById(
          'bookingMessage'
        ).textContent =
          'Booking failed';

      }

    }
  );

}

async function loadMyBookings(filter = "upcoming") {

  try {

    const response =
      await fetch(
          `/api/bookings/my?filter=${filter}`,
          {
              headers:{
                  Authorization:
                  `Bearer ${localStorage.getItem("crbsToken")}`
              }
          }
      );

    const result =
      await response.json();

    const tbody =
      document.getElementById('bookingsBody');

    if (!tbody) return;

    tbody.innerHTML = '';

    result.data.forEach(booking => {

      tbody.innerHTML += `
        <tr>
          <td>${booking.resourceName}</td>
          <td>${new Date(
              booking.startDateTime
            ).toLocaleDateString()}</td>
          <td>
            ${new Date(
              booking.startDateTime
            ).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </td>
          <td>${booking.status}</td>
          <td>
              <button
                  class="ghost-btn cancel-btn"
                  data-id="${booking.bookingID}">
                  Cancel
              </button>
          </td>
        </tr>
      `;

    });

  } catch (err) {

    console.error(err);

  }

  document.querySelectorAll(".cancel-btn")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            cancelBooking(btn.dataset.id);

        });

    });
}

function bindBookingTabs(){

    document.getElementById("upcomingTab")
    ?.addEventListener("click",()=>{

        setActiveTab("upcomingTab");

        loadMyBookings("upcoming");

    });

    document.getElementById("pendingTab")
    ?.addEventListener("click",()=>{

        setActiveTab("pendingTab");

        loadMyBookings("pending");

    });

    document.getElementById("pastTab")
    ?.addEventListener("click",()=>{

        setActiveTab("pastTab");

        loadMyBookings("past");

    });

    document.getElementById("cancelledTab")
    ?.addEventListener("click",()=>{

        setActiveTab("cancelledTab");

        loadMyBookings("cancelled");

    });

}

function setActiveTab(id){

    document
    .querySelectorAll(".tabs button")
    .forEach(btn=>btn.classList.remove("active"));

    document
    .getElementById(id)
    .classList.add("active");

}

async function cancelBooking(id) {

  if (!confirm('Cancel this booking?'))
    return;

  try {

    await fetch(
      `/api/bookings/${id}/cancel`,
      {
        method: 'PUT',
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('crbsToken')}`
        }
      }
    );

    loadMyBookings();

  } catch (err) {

    console.error(err);

  }
}

function filterBookings(bookings, tab) {
  const now = new Date();

  return bookings.filter(b => {
    const status = normalizeStatus(b.status);
    const start = parseDateTime(b.startDateTime);
    const end = parseDateTime(b.endDateTime);

    //  PENDING
    if (tab === "pending") {
      return status === "pending";
    }

    //  CANCELLED
    if (tab === "cancelled") {
      return status === "cancelled";
    }

    //  UPCOMING (approved + future start)
    if (tab === "upcoming") {
      return (
        status === "approved" &&
        start > now
      );
    }

    //  PAST (approved + ended)
    if (tab === "past") {
      return (
        status === "approved" &&
        end < now
      );
    }

    return true;
  });
}

function renderBookings(tab, bookings) {
  const tbody = document.getElementById("bookingsBody");
  tbody.innerHTML = "";

  const filtered = filterBookings(bookings, tab);

  filtered.forEach(b => {
    tbody.innerHTML += `
      <tr>
        <td>${b.resourceID}</td>
        <td>${b.startDateTime}</td>
        <td>${b.endDateTime}</td>
        <td>${b.status}</td>
        <td><button>View</button></td>
      </tr>
    `;
  });
}

document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.innerText.toLowerCase().split(" ")[0];
    renderBookings(tab, bookings);
  });
});

async function loadResourcesTable() {

  try {

    const response =
      await fetch('/api/resources', {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('crbsToken')}`
        }
      });

    const result =
      await response.json();

    const tbody =
      document.getElementById('resourcesBody');

    if (!tbody) return;

    tbody.innerHTML = '';

    result.data.forEach(resource => {

      tbody.innerHTML += `
        <tr class="resource-row" data-resource-id="${resource.resourceID}">
          <td>
            <strong>${resource.name}</strong>
          </td>

          <td>${resource.type}</td>

          <td>${resource.location || '-'}</td>

          <td>${resource.capacity || '-'}</td>

          <td>
            <span class="badge">
              ${resource.status}
            </span>
          </td>

          <td>
            <button
              class="action-btn"
              data-id="${resource.resourceID}">

              Edit

            </button>

            <button
              class="maintenance-btn"
              data-id="${resource.resourceID}">

              Delete

            </button>
          </td>
        </tr>
      `;

    });
    resourceManager.bindButtons();

  } catch (err) {

    console.error(err);

  }

}

async function deleteResource(id) {

  if (!confirm("Delete this resource?")) {
    return;
  }

  try {

    const response =
      await fetch(
        `/api/resources/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem(
                "crbsToken"
              )}`
          }
        }
      );

    const result =
      await response.json();

    alert(result.message);

    loadResourcesTable();

  } catch (err) {

    console.error(err);

    alert("Delete failed");

  }

}

async function searchResources() {

    try {

        const type =
            document.getElementById("filterType").value;

        const location =
            document.getElementById("filterLocation").value;

        const capacity =
            document.getElementById("filterCapacity").value;

        const date =
            document.getElementById("bookingDate").value;

        const response =
            await fetch(
                `/api/resources/search?type=${encodeURIComponent(type)}&location=${encodeURIComponent(location)}&capacity=${capacity}&date=${date}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("crbsToken")}`
                    }
                }
            );

        const result = await response.json();

        if (!result.success) {

            alert("Unable to search resources.");

            return;

        }

        displayResources(result.data);

    }

    catch (err) {

        console.error(err);

    }

}


function selectResource(id, name){

    document.getElementById("resourceID").value = id;


    showScreen("create-booking");

}

const searchForm =
  document.querySelector(
    '[data-form="search"]'
  );

async function loadDashboard() {

  const resourcesRes =
    await fetch('/api/resources', {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('crbsToken')}`
      }
    });

  const bookingsRes =
    await fetch('/api/bookings/my', {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('crbsToken')}`
      }
    });

  const resources =
    await resourcesRes.json();

  const bookings =
    await bookingsRes.json();

  document.getElementById(
    'statGrid'
  ).innerHTML = `

    <div class="stat-card">
      <h3>${resources.data.length}</h3>
      <p>Resources</p>
    </div>

    <div class="stat-card">
      <h3>${bookings.data.length}</h3>
      <p>My Bookings</p>
    </div>

  `;

}

async function loadResourceDropdown() {

  const resources =
    await API.get('/api/resources');

  const select =
    document.getElementById('resourceID');

  select.innerHTML =
    '<option value="">Select Resource</option>';

  resources.forEach(resource => {

    select.innerHTML += `
      <option value="${resource.resourceID}">
        ${resource.name}
      </option>
    `;
  });

  const dropdown =
      document.getElementById('filterType');

    dropdown.innerHTML =
      '<option value="">All Types</option>';

    const types = [...new Set(
      resources.map(resource => resource.type)
    )];

    types.forEach(type => {

      dropdown.innerHTML += `
        <option value="${type}">
          ${type}
        </option>
      `;
    });
////
    const Quickdropdown =
      document.getElementById('quickBookType');

    if (Quickdropdown) {

      Quickdropdown.innerHTML =
        '<option value="">Choose resource</option>';

      const Quicktypes = [...new Set(
        resources.map(resource => resource.type)
      )];

      Quicktypes.forEach(type => {

        Quickdropdown.innerHTML += `
          <option value="${type}">
            ${type}
          </option>
        `;
      });

    }
/////
    const resourc =
      document.getElementById('resourceType');

    if (!resourc) return;

    resourc.innerHTML =
      '<option value="">Select type</option>';

    const resourcS = [...new Set(
      resources.map(resource => resource.type)
    )];

    resourcS.forEach(type => {

      resourc.innerHTML += `
        <option value="${type}">
          ${type}
        </option>
      `;
    });

    /////
    const reportDropdown =
      document.getElementById("reportResourceType");

      reportDropdown.innerHTML =
      '<option value="">All Resources</option>';

      const typess = [...new Set(resources.map(r => r.type))];

      typess.forEach(type => {

          reportDropdown.innerHTML += `
              <option value="${type}">
                  ${type}
              </option>
          `;

      });
}

function displayResources(resources) {

    const container =
        document.getElementById("resourceResults");

    container.innerHTML = "";

    resources.forEach(resource => {

        container.innerHTML += `

        <article class="resource-card">

            <div>

                <h3>${resource.name}</h3>

                <p>
                     ${resource.location || "-"}
                </p>

                <p>
                     Capacity:
                    ${resource.capacity || "-"}
                </p>

                <p>
                    Status:
                    <span style="font-weight:bold;
                    color:${
                        resource.status === "Available"
                        ? "green"
                        : "red"
                    }">

                        ${resource.status}

                    </span>
                </p>

            </div>

            <button
                class="book-btn"
                data-id="${resource.resourceID}"
                data-name="${resource.name}"
                ${resource.status=== "Inactive" ||
                  resource.status == "Maintenance"
                    ? "disabled"
                    : ""
                }>

                ${
                     resource.status === "Available"
            ? "Book"
            : resource.status === "Maintenance"
            ? "Maintenance"
            : "Inactive"
                }

            </button>

        </article>

        `;

    });

    document.querySelectorAll(".book-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            selectResource(
                btn.dataset.id,
                btn.dataset.name
            );

        });

    });

}

const resourceForm =
  document.getElementById(
    'resourceForm'
  );

if (resourceForm) {

  resourceForm.addEventListener(
    'submit',
    async (e) => {

      e.preventDefault();

      try {

        const name =
          document.getElementById(
            'resourceName'
          ).value;

        const type =
          document.getElementById(
            'resourceType'
          ).value;

        const location =
          document.getElementById(
            'resourceLocation'
          ).value;

        const capacity =
          document.getElementById(
            'resourceCapacity'
          ).value;

        const status =
          document.getElementById(
            'resourceStatus'
          ).value;

        const editID =
          document.getElementById(
            'editingResourceID'
          ).value;

        const url =
          editID
            ? `/api/resources/${editID}`
            : '/api/resources';

        const method =
          editID
            ? 'PUT'
            : 'POST';

        const response =
          await fetch(url, {

            method,

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${localStorage.getItem(
                  'crbsToken'
                )}`
            },

            body: JSON.stringify({
              name,
              type,
              location,
              capacity,
              status
            })

          });

        const result =
          await response.json();

        alert(result.message);

        resourceForm.reset();

        document.getElementById(
          'editingResourceID'
        ).value = '';

        loadResourcesTable();

      } catch (err) {

        console.error(err);

        alert(
          'Failed to save resource'
        );

      }

    }
  );

}

async function loadPendingApprovals() {

  try {

    const response =
      await fetch(
        '/api/bookings/pending',
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem(
                'crbsToken'
              )}`
          }
        }
      );

    const result =
      await response.json();

    const list =
      document.getElementById(
        'approvalList'
      );

    list.innerHTML = '';

    result.data.forEach(booking => {

      list.innerHTML += `
          <article class="approval-card">

            <div>

              <h3>${booking.resourceName}</h3>

              <p>

                User: ${booking.userName}
                <br>

                Start:
                ${new Date(
                  booking.startDateTime
                ).toLocaleString()}

              </p>

            </div>

            <div>

              <button
                class="approve-btn"
                data-id="${booking.bookingID}">

                Approve

              </button>

              <button
                class="reject-btn"
                data-id="${booking.bookingID}">

                Reject

              </button>

            </div>

          </article>
        `;

    });

    document.querySelectorAll('.approve-btn')
      .forEach(btn => {

        btn.addEventListener(
          'click',
          async () => {

            await approveBooking(
              btn.dataset.id
            );

          }
        );

      });

      document.querySelectorAll('.reject-btn')
      .forEach(btn => {

        btn.addEventListener(
          'click',
          async () => {

            await rejectBooking(
              btn.dataset.id
            );

          }
        );

      });

  } catch (err) {

    console.error(err);

  }

}

async function approveBooking(id) {

  try {

    await fetch(
      `/api/bookings/${id}/approve`,
      {
        method: 'PUT',
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(
              'crbsToken'
            )}`
        }
      }
    );

    loadPendingApprovals();

  } catch (err) {

    console.error(err);

  }

}

async function rejectBooking(id) {

  try {

    await fetch(
      `/api/bookings/${id}/reject`,
      {
        method: 'PUT',
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem(
              'crbsToken'
            )}`
        }
      }
    );

    loadPendingApprovals();

  } catch (err) {

    console.error(err);

  }

}
/////reports_section

let reportChart = null;

function displayReport(type, data) {

    const container =
        document.getElementById("reportContainer");

    const content =
        document.getElementById("reportContent");

    container.style.display = "block";

    if (data.length === 0) {

        content.innerHTML =
            "<p>No data found.</p>";

        return;
    }

    content.innerHTML =
        `<canvas id="reportChart"></canvas>`;

    const ctx =
        document
            .getElementById("reportChart");

    if (reportChart) {

        reportChart.destroy();

    }

    if (type === "heatmap") {

        reportChart =
            new Chart(ctx, {

                type: "bar",

                data: {

                    labels:
                        data.map(r => r.name),

                    datasets: [{

                        label:
                            "Bookings",

                        data:
                            data.map(r => r.totalBookings)

                    }]

                },

                options: {

                    indexAxis: "y",

                    responsive: true,

                    plugins: {

                        legend: {

                            display: false

                        }

                    }

                }

            });

    }

    else if (type === "trends") {

        reportChart =
            new Chart(ctx, {

                type: "line",

                data: {

                    labels:
                        data.map(r => r.bookingDate),

                    datasets: [{

                        label:
                            "Bookings",

                        data:
                            data.map(r => r.totalBookings),

                        fill: false,

                        tension: 0.3

                    }]

                },

                options: {

                    responsive: true

                }

            });

    }

    else if (type === "summary") {

        reportChart =
            new Chart(ctx, {

                type: "doughnut",

                data: {

                    labels:
                        data.map(r => r.status),

                    datasets: [{

                        data:
                            data.map(r => r.total)

                    }]

                }

            });

    }

}

const reportsForm =
document.getElementById("reportsForm");

if (reportsForm) {

    reportsForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            const reportType =
                document.getElementById("reportType").value;

            const startDate =
                document.getElementById("reportStart").value;

            const endDate =
                document.getElementById("reportEnd").value;

            const resourceType =
                document.getElementById("reportResourceType").value;

            const department =
                document.getElementById("reportDepartment").value;

            const response =
                await fetch(
                    `/api/reports?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}&resourceType=${resourceType}&department=${department}`,
                    {
                        headers:{
                            Authorization:
                            `Bearer ${localStorage.getItem("crbsToken")}`
                        }
                    }
                );

            const result =
                await response.json();

            console.log(result);

            displayReport(
                reportType,
                result.data
            );

        }
    );

}

async function loadDepartments(){

    const response =
    await fetch("/api/reports/departments",{

        headers:{
            Authorization:
            `Bearer ${localStorage.getItem("crbsToken")}`
        }

    });

    const result =
    await response.json();

    const select =
    document.getElementById("reportDepartment");

    select.innerHTML =
    '<option value="">All Departments</option>';

    result.data.forEach(dep=>{

        select.innerHTML +=
        `<option value="${dep.department}">
            ${dep.department}
        </option>`;

    });

}

function exportPdf() {

    const table =
        document.querySelector("#reportContent table");

    if (!table) {

        alert("Generate a report first.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc =
        new jsPDF();

    doc.setFontSize(18);

    doc.text("Campus Resource Booking Report",20,20);

    let y = 35;

    table.querySelectorAll("tr").forEach(row=>{

        let line=[];

        row.querySelectorAll("th,td")
        .forEach(cell=>{

            line.push(cell.innerText);

        });

        doc.text(
            line.join("   |   "),
            20,
            y
        );

        y += 10;

    });

    doc.save("Report.pdf");

}

function exportCsv() {

    const table =
        document.querySelector("#reportContent table");

    if (!table) {

        alert("Generate a report first.");

        return;

    }

    let csv = [];

    table.querySelectorAll("tr").forEach(row => {

        const cols = row.querySelectorAll("th,td");

        csv.push(
            [...cols]
            .map(col => `"${col.innerText}"`)
            .join(",")
        );

    });

    const blob =
        new Blob(
            [csv.join("\n")],
            {
                type:"text/csv"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download = "Report.csv";

    a.click();

    URL.revokeObjectURL(url);

}

const exportPdfBtn =
    document.getElementById("exportPdfBtn");

if (exportPdfBtn) {

    exportPdfBtn.addEventListener("click", async () => {

        const reportType =
            document.getElementById("reportType").value;

        const startDate =
            document.getElementById("reportStart").value;

        const endDate =
            document.getElementById("reportEnd").value;

        const resourceType =
            document.getElementById("reportResourceType").value;

        const response = await fetch(
            `/api/reports/pdf?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}&resourceType=${resourceType}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("crbsToken")}`
                }
            }
        );

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "Report.pdf";
        a.click();

        URL.revokeObjectURL(url);

    });

}

const exportCsvBtn =
    document.getElementById("exportCsvBtn");

if (exportCsvBtn) {

    exportCsvBtn.addEventListener("click", async () => {

        const reportType =
            document.getElementById("reportType").value;

        const startDate =
            document.getElementById("reportStart").value;

        const endDate =
            document.getElementById("reportEnd").value;

        const resourceType =
            document.getElementById("reportResourceType").value;

        const department =
            document.getElementById("reportDepartment").value;

        const response = await fetch(
            `/api/reports/csv?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}&resourceType=${resourceType}&department=${department}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("crbsToken")}`
                }
            }
        );

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "Report.csv";
        a.click();

        URL.revokeObjectURL(url);

    });

}

//policy section

async function loadPolicy() {

    try {

        const response = await fetch(
            "/api/policy",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("crbsToken")}`
                }
            }
        );

        if (!response.ok) {

            console.error(
                "Policy route not found:",
                response.status
            );

            return;
        }

        const result =
            await response.json();

        if (!result.success || !result.data) {

            console.error(result);

            return;

        }

        const p = result.data;

        document.getElementById("maxAdvanceDays").value =
            p.maxAdvanceDays;

        document.getElementById("minimumNotice").value =
            p.minimumNotice;

        document.getElementById("maximumDuration").value =
            p.maximumDuration;

        document.getElementById("cancellationDeadline").value =
            p.cancellationDeadline;

    }

    catch(err){

        console.error(err);

    }

}

const policyForm = document.querySelector('[data-form="policy"]');

if(policyForm){
  policyForm.addEventListener(
    "submit",
    async function(e){

      e.preventDefault();

      const body={

          maxAdvanceDays:
          document.getElementById(
              "maxAdvanceDays"
          ).value,

          minimumNotice:
          document.getElementById(
              "minimumNotice"
          ).value,

          maximumDuration:
          document.getElementById(
              "maximumDuration"
          ).value,

          cancellationDeadline:
          document.getElementById(
              "cancellationDeadline"
          ).value

      };

      const response =
      await fetch(
          "/api/policy",
          {

              method:"PUT",

              headers:{

                  "Content-Type":
                  "application/json",

                  Authorization:
                  `Bearer ${localStorage.getItem("crbsToken")}`

              },

              body:JSON.stringify(body)

          }
      );

      const result =
      await response.json();

      alert(result.message);
    
  });
}

async function loadPolicyLogs(){

    const response =
        await fetch("/api/policy/logs",{

            headers:{
                Authorization:
                `Bearer ${localStorage.getItem("crbsToken")}`
            }

        });

    const result =
        await response.json();

    const container =
        document.getElementById("policyLog");

    container.innerHTML="";

    result.data.forEach(log=>{

        container.innerHTML += `
            <p>
                <strong>
                    ${new Date(log.changedAt)
                        .toLocaleDateString()}
                </strong>

                ${log.description}
            </p>
        `;

    });

}

////dashboard data

async function loadDashboard2(){

    const response =
    await fetch(
        "/api/dashboard",
        {
            headers:{
                Authorization:
                `Bearer ${localStorage.getItem("crbsToken")}`
            }
        }
    );

    const result =
    await response.json();

    if(!result.success) return;

    const d =
    result.data;
    const role = getStoredRole().toLowerCase();

    if(role==="admin"){

        dashboardData.admin.stats=[

            [
                "Total Bookings",
                d.totalBookings,
                "All bookings"
            ],

            [
                "Active Users",
                d.activeUsers,
                "Registered"
            ],

            [
                "Pending Requests",
                d.pendingRequests,
                "Need review"
            ],

            [
                "Resources",
                d.resources,
                "Managed"
            ]

        ];

        dashboardData.admin.primary=`

        <h2>Administrative Summary</h2>

        <p><strong>Most Used Resource:</strong> ${d.mostUsed}</p>

        <p><strong>Peak Booking Day:</strong> ${d.peakDay}</p>

        <p><strong>Policy Status:</strong> Active</p>

        `;

    }

    else if(role==="student"){

      dashboardData.student.stats=[

          [
              "Upcoming Bookings",
              d.upcomingBookings,
              "Future"
          ],

          [
              "Pending Approval",
              d.pendingApproval,
              "Waiting"
          ],

          [
              "Available Resources",
              d.availableResources,
              "Today"
          ]

      ];

    }
    else if(role==="staff"){

        dashboardData.staff.stats=[

            [
                "Upcoming Bookings",
                d.upcomingBookings,
                "Future"
            ],

            [
                "Pending Approval",
                d.pendingApproval,
                "Waiting"
            ],

            [
                "Available Resources",
                d.availableResources,
                "Today"
            ]

        ];

    }

    renderDashboard();
}

////

document.addEventListener("DOMContentLoaded", () => {

    // Safe to run on every page
    bindForms();
    updatePasswordStrength();

    const token =
        localStorage.getItem("crbsToken");

    // If user isn't logged in, stop here
    if (!token) return;

    if(localStorage.getItem("crbsToken")){

        loadDashboard2();

    }

    if(localStorage.getItem("crbsToken")){

        loadMyBookings();

        bindBookingTabs();

    }

    // Dashboard-only functions
    loadResources();
    loadResourceDropdown();
    loadResourcesTable();
    loadDepartments();
    loadPolicy();
    loadPolicySummary();
    loadPolicyLogs();
    loadPendingApprovals();
    loadMyBookings();

});