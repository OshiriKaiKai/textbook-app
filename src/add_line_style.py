import os

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\App.css'
with open(filepath, 'a', encoding='utf-8') as f:
    f.write("""
/* =============================
   LINE Button (UI UX PRO)
   ============================= */
.line-btn {
  background: linear-gradient(135deg, #06C755, #00A642) !important;
  color: #fff !important;
  font-weight: 700 !important;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(6, 199, 85, 0.3);
}
.line-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 24px rgba(6, 199, 85, 0.45);
}
""")

print("LINE btn styles added")
