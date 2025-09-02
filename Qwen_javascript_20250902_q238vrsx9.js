// قاعدة بيانات البنوك وشركات التمويل (تحديثها من ملف PDF)
const financeCompanies = [
  {
    id: 1,
    name: "البنك الأهلي",
    interestRate: 3.75, // نسبة سنوية
    maxLoanPercentage: 90,
    salaryTransferRequired: true,
  },
  {
    id: 2,
    name: "البنك الراجحي",
    interestRate: 3.5,
    maxLoanPercentage: 90,
    salaryTransferRequired: true,
  },
  {
    id: 3,
    name: "شركة ثنيات",
    interestRate: 4.25,
    maxLoanPercentage: 100,
    salaryTransferRequired: false,
  },
  {
    id: 4,
    name: "سامبا فاينانس",
    interestRate: 4.0,
    maxLoanPercentage: 90,
    salaryTransferRequired: true,
  },
  {
    id: 5,
    name: "البنك السعودي الفرنسي",
    interestRate: 3.9,
    maxLoanPercentage: 90,
    salaryTransferRequired: true,
  },
];

// ملء قائمة البنوك
const companySelect = document.getElementById("financeCompany");
financeCompanies.forEach(company => {
  const option = document.createElement("option");
  option.value = company.id;
  option.textContent = company.name;
  companySelect.appendChild(option);
});

// حساب القسط الشهري
function calculateLoan(principal, annualRate, termMonths) {
  const monthlyRate = annualRate / 100 / 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
}

// معالجة النموذج
document.getElementById("calculatorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const carPrice = parseFloat(document.getElementById("carPrice").value);
  const downPayment = parseFloat(document.getElementById("downPayment").value) || 0;
  const salary = parseFloat(document.getElementById("salary").value);
  const salaryTransferred = document.querySelector('input[name="salaryTransferred"]:checked').value === "yes";
  const companyID = parseInt(document.getElementById("financeCompany").value);
  const loanTerm = parseInt(document.getElementById("loanTerm").value);

  const company = financeCompanies.find(c => c.id === companyID);

  if (!company) return alert("يرجى اختيار جهة تمويل");

  // التحقق من شرط تحويل الراتب
  if (company.salaryTransferRequired && !salaryTransferred) {
    document.getElementById("approvalStatus").textContent = "مرفوض: يجب تحويل الراتب";
    document.getElementById("approvalStatus").style.color = "red";
    showResult(0, 0, 0, 0, "مرفوض");
    return;
  }

  const financedAmount = carPrice - downPayment;
  const maxLoanAllowed = carPrice * (company.maxLoanPercentage / 100);

  if (financedAmount > maxLoanAllowed) {
    alert(`الحد الأقصى للتمويل هو ${maxLoanAllowed.toLocaleString()} ريال`);
    return;
  }

  const monthlyPayment = calculateLoan(financedAmount, company.interestRate, loanTerm);
  const totalPayment = monthlyPayment * loanTerm;
  const salaryPercentage = (monthlyPayment / salary) * 100;
  const isApproved = salaryPercentage <= 40; // شرط عام: لا يزيد القسط عن 40% من الراتب

  // عرض النتائج
  document.getElementById("financedAmount").textContent = financedAmount.toLocaleString();
  document.getElementById("monthlyPayment").textContent = monthlyPayment.toFixed(2);
  document.getElementById("totalPayment").textContent = totalPayment.toFixed(2);
  document.getElementById("salaryPercentage").textContent = salaryPercentage.toFixed(1);
  document.getElementById("approvalStatus").textContent = isApproved ? "✅ مؤهل للتمويل" : "❌ غير مؤهل";
  document.getElementById("approvalStatus").style.color = isApproved ? "green" : "red";

  document.getElementById("result").classList.remove("hidden");
});

// طباعة العرض
document.getElementById("printBtn").addEventListener("click", () => {
  const printContent = document.getElementById("result").innerHTML;
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
});