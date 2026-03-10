import re

def update_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Update ExamUploadPage.jsx
update_file(r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\pages\ExamUploadPage.jsx', [
    ('BookUploadPage', 'ExamUploadPage'),
    ('addBook', 'addExam'),
    ('bookName', 'examName'),
    ('authorName', 'professorName'),
    ('教科書名', '授業名'),
    ('著者名', '教授名'),
    ('price', 'year'),
    ('価格', '年度（例: 2023）'),
    ('condition', 'department'),
    ('状態', '対象学部'),
    ('美品', '全学共通'),
    ('普通', '学部専門'),
    ('傷あり', 'その他'),
    ('good', 'general'),
    ('normal', 'major'),
    ('worn', 'other'),
    ('description', 'description'),
    ('説明', '備考（任意）'),
    ('本の追加に失敗しました。', '過去問の追加に失敗しました。'),
    ('教科書を出品', '過去問を投稿'),
    ('写真をアップロード', 'PDF/画像をアップロード'),
    ('写真を選択', 'ファイルを選択'),
    ("book-cover-preview", "exam-file-preview"),
    ("book-cover-placeholder", "exam-file-placeholder"),
    ("book-covers/", "exam-files/"),
    ("navigate('/books')", "navigate('/exams')"),
    ("navigate('/books'", "navigate('/exams'"),
    ("navigate(`/books", "navigate(`/exams"),
    ("accept=\"image/*\"", "accept=\"image/*,.pdf\"")
])

# Update ExamDetailPage.jsx
update_file(r'c:\Users\skkai\dicision-time\app\textbook-app\Textbook-apps\src\pages\ExamDetailPage.jsx', [
    ('BookDetailPage', 'ExamDetailPage'),
    ('getBook', 'getExam'),
    ('book,', 'exam,'),
    ('book.', 'exam.'),
    (' booksLoading', ' examsLoading'),
    (' booksError', ' examsError'),
    ('bookName', 'examName'),
    ('authorName', 'professorName'),
    ('deleteBook', 'deleteExam'),
    ("navigate('/books')", "navigate('/exams')"),
    ("navigate('/books'", "navigate('/exams'"),
    ("navigate(`/books", "navigate(`/exams"),
    ('教科書', '過去問'),
    ('状態:', '対象:'),
    ('price', 'year'),
    ('¥', '年度: '),
    ('condition', 'department'),
    ('good', 'general'),
    ('normal', 'major'),
    ('worn', 'other'),
    ('美品', '全学共通'),
    ('普通', '学部専門'),
    ('傷あり', 'その他'),
    ('book-detail', 'exam-detail'),
    ('本の削除に失敗しました', '過去問の削除に失敗しました'),
    ('book-cover', 'exam-file'),
    ('カバー画像', 'ファイルプレビュー')
])

print("Exam Upload and Detail components updated.")
