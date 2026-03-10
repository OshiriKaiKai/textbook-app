import re

filepath = r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\pages\ExamDetailPage.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

replacements = [
    ('if (booksLoading) {', 'if (examsLoading) {'),
    ('const book = getExam', 'const exam = getExam'),
    ('if (!book) {', 'if (!exam) {'),
    ('book-uploader-card', 'exam-uploader-card'),
    ('book-uploader-label', 'exam-uploader-label'),
    ('book-uploader-name', 'exam-uploader-name'),
    ('book-uploader-arrow', 'exam-uploader-arrow')
]

for old, new in replacements:
    code = code.replace(old, new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print("ExamDetailPage fixed")
