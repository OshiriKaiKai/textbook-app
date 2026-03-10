import os

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\App.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace previous warm accents with Hitotsubashi Crimson motif
css = css.replace('#de7b5d', '#8e1728')
css = css.replace('rgba(222, 123, 93,', 'rgba(142, 23, 40,')

css = css.replace('#e8a384', '#c42b45')
css = css.replace('rgba(232, 163, 132,', 'rgba(196, 43, 69,')

# Make sure primary text is a dark elegant grey-red depending, but #3d3430 is already good (warm black).
# Let's write it back.
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(css)

print("Hitotsubashi colors applied.")
