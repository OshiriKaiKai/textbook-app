import os
import re

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\App.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# Ultimate PRO MAX UI Overhaul Script

# 1. Global Reset & Advanced Typography (Apple-esque)
css = re.sub(r'body\s*{[^}]+}', 
"""body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background: var(--bg-base);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.01em;
  line-height: 1.5;
}""", css)

# 2. Advanced Background - Dynamic Mesh Gradients
css = css.replace(
    """radial-gradient(ellipse at 10% 10%, rgba(142, 23, 40, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 90%, rgba(196, 43, 69, 0.07) 0%, transparent 50%),""",
    """radial-gradient(circle at 15% 50%, rgba(142, 23, 40, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 85% 30%, rgba(196, 43, 69, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(142, 23, 40, 0.05) 0%, transparent 60%),"""
)

# 3. Super Glassmorphism for Navbar
navbar_style = """
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
}"""
css = re.sub(r'\.navbar\s*{[^}]+}', navbar_style, css)

# 4. Ultra Premium Cards (BookCard / ExamCard) with dynamic floating
book_card_start = css.find('.book-card {')
book_card_end = css.find('}', book_card_start) + 1
card_style = """
.book-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.5s ease both;
  box-shadow: 0 8px 32px rgba(142, 23, 40, 0.05);
}

.book-card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 20px 40px rgba(142, 23, 40, 0.12), 0 0 0 1px rgba(196, 43, 69, 0.2);
  background: rgba(255, 255, 255, 0.95);
}"""
css = css[:book_card_start] + card_style + css[book_card_end:]

# Clean up any leftover old hover pseudo classes for book-card if needed
css = re.sub(r'\.book-card:hover\s*{[^}]+}', '', css)
css = re.sub(r'\.book-card:hover::before\s*{[^}]+}', '', css)
css += card_style # Re-append to ensure it exists cleanly without regex conflicts if the first sub failed. We will manual sub.

# Better Regex replacement for Book Card
css = re.sub(r'\.book-card\s*{[^}]+}', '', css)
css = re.sub(r'\.book-card:hover\s*{[^}]+}', '', css)
css = re.sub(r'\.book-card::before\s*{[^}]+}', '', css)
css += "\n" + card_style

# 5. Profile Hero & Photo PRO MAX
profile_hero = """
.profile-hero {
  position: relative;
  width: 100%;
  height: 45vh;
  min-height: 320px;
  background: linear-gradient(135deg, rgba(142, 23, 40, 0.2), rgba(196, 43, 69, 0.15), rgba(253, 251, 247, 1));
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.profile-photo {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 32px rgba(142, 23, 40, 0.15);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform: translateY(20px);
  z-index: 10;
}
.profile-photo:hover {
  transform: translateY(15px) scale(1.05);
}
"""
css = re.sub(r'\.profile-hero\s*{[^}]+}', '', css)
css = re.sub(r'\.profile-photo\s*{[^}]+}', '', css)
css += "\n" + profile_hero


# 6. Smooth Input Fields (Neuomorphic/Glass hybrid)
inputs = """
.input-field {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.input-field:focus {
  border-color: rgba(142, 23, 40, 0.4);
  box-shadow: 0 0 0 4px rgba(142, 23, 40, 0.1), inset 0 2px 4px rgba(0,0,0,0.01);
  background: rgba(255, 255, 255, 0.9);
}
"""
css = re.sub(r'\.input-field\s*{[^}]+}', '', css)
css = re.sub(r'\.input-field:focus\s*{[^}]+}', '', css)
css += "\n" + inputs

# 7. Button Magic
buttons = """
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.btn-primary {
  background: linear-gradient(135deg, #a61c33 0%, #d43b56 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(142, 23, 40, 0.25);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(142, 23, 40, 0.35);
  background: linear-gradient(135deg, #bd233d 0%, #e04b66 100%);
}
.btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.98) !important;
  box-shadow: 0 2px 8px rgba(142, 23, 40, 0.2) !important;
}
"""
css = re.sub(r'\.btn\s*{[^}]+}', '', css)
css = re.sub(r'\.btn-primary\s*{[^}]+}', '', css)
css = re.sub(r'\.btn-primary:hover:not\(:disabled\)\s*{[^}]+}', '', css)
css = re.sub(r'\.btn:active:not\(:disabled\)\s*{[^}]+}', '', css)
css += "\n" + buttons

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("Ultimate PRO MAX UI Overhaul Applied!")
