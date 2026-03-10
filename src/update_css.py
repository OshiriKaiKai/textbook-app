import re
import os

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\App.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update root variables
css = re.sub(r'--bg-base:\s*#070b14;', '--bg-base: #fdfbf7;', css)
css = re.sub(r'--bg-surface:\s*#0d1117;', '--bg-surface: #ffffff;', css)
css = re.sub(r'--bg-card:\s*#111827;', '--bg-card: #ffffff;', css)
css = re.sub(r'--text-primary:\s*#f1f5f9;', '--text-primary: #3d3430;', css)
css = re.sub(r'--text-secondary:\s*#94a3b8;', '--text-secondary: #736861;', css)
css = re.sub(r'--text-muted:\s*#64748b;', '--text-muted: #a89f9a;', css)
css = re.sub(r'--accent:\s*#6366f1;', '--accent: #de7b5d;', css)
css = re.sub(r'--accent-2:\s*#8b5cf6;', '--accent-2: #e8a384;', css)
css = re.sub(r'--accent-gradient:\s*linear-gradient\(135deg,\s*#6366f1,\s*#8b5cf6\);', '--accent-gradient: linear-gradient(135deg, #de7b5d, #e8a384);', css)
css = re.sub(r'--border:\s*rgba\(255,\s*255,\s*255,\s*0\.07\);', '--border: rgba(61, 52, 48, 0.1);', css)
css = re.sub(r'--shadow:\s*0\s*4px\s*24px\s*rgba\(0,\s*0,\s*0,\s*0\.5\);', '--shadow: 0 6px 20px rgba(61, 52, 48, 0.08);', css)
css = re.sub(r'--shadow-accent:\s*0\s*0\s*24px\s*rgba\(99,\s*102,\s*241,\s*0\.35\);', '--shadow-accent: 0 4px 16px rgba(222, 123, 93, 0.25);', css)

# 2. Update rgba(255, 255, 255, ...) to warm dark for semi-transparent backgrounds and borders
# We will just replace everything except when it might break.
# Let's replace rgba(255, 255, 255, with rgba(61, 52, 48, in all places (except for explicit white text, but we use #fff for text usually).
css = re.sub(r'rgba\(255,\s*255,\s*255,\s*(0\.\d+)\)', r'rgba(61, 52, 48, \1)', css)

# 3. Update specific accent colors everywhere
# Replace indigo: #6366f1 or rgba(99, 102, 241
css = css.replace('#6366f1', '#de7b5d')
css = css.replace('rgba(99, 102, 241,', 'rgba(222, 123, 93,')

# Replace purple: #8b5cf6 or rgba(139, 92, 246
css = css.replace('#8b5cf6', '#e8a384')
css = css.replace('rgba(139, 92, 246,', 'rgba(232, 163, 132,')

# 4. Update success green to softer green
css = css.replace('#00ff88', '#81c784')
css = css.replace('rgba(0, 255, 136,', 'rgba(129, 199, 132,')
css = css.replace('#00b4d8', '#aed581')

# 5. Update danger red to softer red
css = css.replace('#ff4d6d', '#e57373')
css = css.replace('rgba(255, 77, 109,', 'rgba(229, 115, 115,')
css = css.replace('#c9184a', '#ef5350')
css = css.replace('#ff8099', '#ef5350') # old auth error text

# 6. Navbar background
css = re.sub(r'rgba\(7,\s*11,\s*20,\s*0\.92\)', 'rgba(253, 251, 247, 0.92)', css)

# 7. Button text colors
css = re.sub(r'(btn-success.*?color:\s*)#070b14', r'\1#fff', css)
css = re.sub(r'(btn-danger.*?color:\s*)#fff', r'\1#fff', css)

# Overwrite
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("Done updating App.css")
