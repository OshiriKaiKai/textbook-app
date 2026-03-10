import os

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\App.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# UI UX PRO MAX Upgrades

# 1. Enhance the font family for a cleaner, modern look (add system fonts fallback optimized for Mac/Win PRO max looks)
css = css.replace("font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif;", 
                  "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';")

# 2. Make backgrounds and gradients richer (more ambient glow)
css = css.replace("radial-gradient(ellipse at 80% 0%, rgba(196, 43, 69, 0.12) 0%, transparent 50%),",
                  "radial-gradient(ellipse at 80% 0%, rgba(196, 43, 69, 0.15) 0%, transparent 60%),\n    radial-gradient(ellipse at 10% 80%, rgba(142, 23, 40, 0.08) 0%, transparent 50%),")

css = css.replace("radial-gradient(ellipse at 10% 10%, rgba(222, 123, 93, 0.07) 0%, transparent 50%)", "radial-gradient(ellipse at 0% 0%, rgba(196, 43, 69, 0.12) 0%, transparent 60%)")
css = css.replace("radial-gradient(ellipse at 90% 90%, rgba(232, 163, 132, 0.07) 0%, transparent 50%)", "radial-gradient(ellipse at 100% 100%, rgba(142, 23, 40, 0.1) 0%, transparent 60%)")

css = css.replace("radial-gradient(ellipse at 20% 20%, rgba(222, 123, 93, 0.1) 0%, transparent 55%),\n    radial-gradient(ellipse at 80% 80%, rgba(232, 163, 132, 0.1) 0%, transparent 55%),",
                  "radial-gradient(ellipse at 20% 20%, rgba(196, 43, 69, 0.15) 0%, transparent 60%),\n    radial-gradient(ellipse at 80% 80%, rgba(142, 23, 40, 0.12) 0%, transparent 60%),")


# 3. Add Glassmorphism to Navbar, Cards, and Auth Container
# Currently:
# .navbar { ... background: rgba(253, 251, 247, 0.92); backdrop-filter: blur(12px); ... }
css = css.replace("background: rgba(253, 251, 247, 0.92);", "background: rgba(255, 255, 255, 0.65);\n  backdrop-filter: blur(24px) saturate(180%);\n  -webkit-backdrop-filter: blur(24px) saturate(180%);")

# Enhance auth-container glassmorphism
css = css.replace("backdrop-filter: blur(10px);", "backdrop-filter: blur(20px) saturate(150%);\n  -webkit-backdrop-filter: blur(20px) saturate(150%);\n  background: rgba(255, 255, 255, 0.75);")

# 4. Enhance Buttons
# Add dynamic scaling and smoother shadows to buttons
css = css.replace("transition: all 0.2s ease;", "transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);")
css = css.replace("transform: translateY(-2px);", "transform: translateY(-3px) scale(1.02);")
# Add a subtle active state scale to buttons
button_active = """
.btn:active:not(:disabled) {
  transform: translateY(0) scale(0.97) !important;
  box-shadow: none !important;
}
"""
if ".btn:active" not in css:
    css = css.replace(".btn-primary {", button_active + "\n.btn-primary {")

# 5. Enhance Inputs (Glassy feel)
css = css.replace("background: rgba(61, 52, 48, 0.04);", "background: rgba(255, 255, 255, 0.5);\n  backdrop-filter: blur(8px);")
css = css.replace("background: rgba(61, 52, 48, 0.07);", "background: rgba(255, 255, 255, 0.8);")


# 6. Enhance Cards (BookCard, ProfileCard)
# Smooth hover effect
css = css.replace("transition: transform 0.25s ease, box-shadow 0.25s ease;", "transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);")
css = css.replace("transform: translateY(-4px);", "transform: translateY(-8px);")
# For .book-card
css = css.replace("background: var(--bg-card);", "background: rgba(255, 255, 255, 0.7);\n  backdrop-filter: blur(16px);")
# For .profile-info-card
css = css.replace("background: var(--bg-surface);\n  border: 1px solid var(--border);\n  border-radius: 16px;\n  padding: 28px;",
                  "background: rgba(255, 255, 255, 0.8);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  border-radius: 20px;\n  padding: 32px;")


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("PRO MAX updates applied to CSS")
