// reports.js - Reports functionality for Traffic Management System

document.addEventListener('DOMContentLoaded', function() {
    initReportsPage();
});

function initReportsPage() {
    setupDateRangePicker();
    setupReportFilters();
    setupReportTypes();
    loadReportData();
    initCharts();
}

// Setup date range picker for reports
function setupDateRangePicker() {
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    
    if (dateFrom && dateTo) {
        // Set default date range (last 7 days)
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        dateFrom.valueAsDate = lastWeek;
        dateTo.valueAsDate = today;
        
        // Add event listeners
        dateFrom.addEventListener('change', validateDateRange);
        dateTo.addEventListener('change', validateDateRange);
    }
}

// Validate that the date range is valid
function validateDateRange() {
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    
    if (dateFrom && dateTo) {
        const startDate = new Date(dateFrom.value);
        const endDate = new Date(dateTo.value);
        
        if (startDate > endDate) {
            showAlert('Start date cannot be after end date', 'error');
            dateFrom.valueAsDate = new Date(dateTo.value);
        }
    }
}

// Setup report filters
function setupReportFilters() {
    const filterForm = document.getElementById('report-filters');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loadReportData();
        });
        
        // Reset filters button
        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                filterForm.reset();
                setupDateRangePicker(); // Reset to default date range
                loadReportData();
            });
        }
    }
}

// Setup different report types
function setupReportTypes() {
    const reportTypeSelector = document.getElementById('report-type');
    
    if (reportTypeSelector) {
        reportTypeSelector.addEventListener('change', function() {
            const selectedReport = this.value;
            showReportSection(selectedReport);
        });
        
        // Initialize with the first report type
        const defaultReport = reportTypeSelector.value;
        showReportSection(defaultReport);
    }
}

// Show the appropriate report section based on selection
function showReportSection(reportType) {
    // Hide all report sections
    const reportSections = document.querySelectorAll('.report-section');
    reportSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected report section
    const selectedSection = document.getElementById(`${reportType}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update the data for the selected report
    loadReportData(reportType);
    