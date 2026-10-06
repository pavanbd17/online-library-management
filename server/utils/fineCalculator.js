const DAILY_FINE = 5;
function overdueDays(dueDate, returnDate = new Date()) {
	return Math.max(0, Math.ceil((new Date(returnDate) - new Date(dueDate)) / 86400000));
}
function calculateFine(dueDate, returnDate) { const days = overdueDays(dueDate, returnDate); return { overdueDays: days, amount: days * DAILY_FINE }; }
module.exports = { DAILY_FINE, overdueDays, calculateFine };
