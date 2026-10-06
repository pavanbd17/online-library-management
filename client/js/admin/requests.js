document.addEventListener("DOMContentLoaded", async () => {
	if (!requireAdmin()) return;
	const target = document.getElementById("requestsBody");
	if (!target) return;
	target.innerHTML = '<tr><td colspan="5" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';
	try {
		const { issues } = await apiFetch("/issues");
		if (!issues.length) return target.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No book requests found.</td></tr>';
		target.innerHTML = issues.map(issue => `<tr><td>${escapeHtml(issue.user?.name || "Unknown")}</td><td>${escapeHtml(issue.book?.title || "Unknown")}</td><td>${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : "-"}</td><td><span class="badge text-bg-${issue.status === "Issued" ? "success" : issue.status === "Rejected" ? "danger" : issue.status === "Returned" ? "secondary" : "warning"}">${escapeHtml(issue.status)}</span></td><td>${issue.status === "Pending" ? `<button class="btn btn-sm btn-success me-1 request-action" data-action="approve" data-id="${issue._id}">Approve</button><button class="btn btn-sm btn-outline-danger request-action" data-action="reject" data-id="${issue._id}">Reject</button>` : issue.status === "Issued" ? `<button class="btn btn-sm btn-outline-primary request-action" data-action="return" data-id="${issue._id}">Mark returned</button>` : "-"}</td></tr>`).join("");
		target.querySelectorAll(".request-action").forEach(button => button.addEventListener("click", async () => { try { await apiFetch(`/issues/${button.dataset.id}/${button.dataset.action}`, { method: "PUT" }); showToast("Request updated"); location.reload(); } catch (error) { showToast(error.message, "danger"); } }));
	} catch (error) { target.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">${escapeHtml(error.message)}</td></tr>`; }
});
