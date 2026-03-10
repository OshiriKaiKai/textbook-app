import re

def update_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Update ExamListPage.jsx
update_file(r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\pages\ExamListPage.jsx', [
    ('BookListPage', 'ExamListPage'),
    ('books', 'exams'),
    ('booksLoading', 'examsLoading'),
    ('booksError', 'examsError'),
    ('bookName', 'examName'),
    ('authorName', 'professorName'),
    ('BookCard', 'ExamCard'),
    ('book-list', 'exam-list'),
    ('book-grid', 'exam-grid'),
    ('book-empty', 'exam-empty'),
    ('教科書一覧', '過去問一覧'),
    ('教科書を出品', '過去問を投稿'),
    ('出品された教科書', '投稿された過去問'),
    ("navigate('/books'", "navigate('/exams'"),
    ("navigate(`/books", "navigate(`/exams"),
    ('本のタイトル・著者名で検索...', '授業名・教授名で検索...'),
    ('book =>', 'exam =>'),
    ('book.', 'exam.')
])

# Update ExamCard.jsx
update_file(r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\components\molecules\ExamCard.jsx', [
    ('BookCard', 'ExamCard'),
    ('book', 'exam'),
    ('book-', 'exam-'),
    ('authorName', 'professorName'),
    ('price', 'year'),
    ('¥', '年度: '),
    ("navigate(`/books", "navigate(`/exams"),
    ('condition', 'department'),
    ('状態', '対象'),
    ('conditionMap', 'departmentMap'),
    ('good', 'general'),
    ('normal', 'major'),
    ('worn', 'other'),
    ('美品', '全学共通'),
    ('普通', '学部専門'),
    ('傷あり', 'その他')
])

print("Exam List and Card components updated.")
