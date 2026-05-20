# Fix language type in firebase.ts
path = r'C:\Users\user\.qclaw\astrology-clean\src\lib\firebase.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = "language: 'id' | 'en' | 'zh'"
new = "language: 'id' | 'en' | 'zh' | 'th' | 'vi' | 'ms' | 'ja' | 'ko'"
count = content.count(old)
content = content.replace(old, new)

with open(path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
print(f'Replaced {count} occurrences of language type')
print('Done')