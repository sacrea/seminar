import os
import re

def extract_var_text_with_exclusions(folder_path, exclusion_patterns):
    # 정규식을 이용해 <var class="replaceable-license-text">와 </var> 태그 사이의 텍스트를 찾음
    var_pattern = re.compile(r'<var class="replaceable-license-text">(.*?)</var>', re.DOTALL)
    
    # 제외 리스트를 정규식으로 컴파일
    compiled_exclusions = [re.compile(pattern) for pattern in exclusion_patterns]
    
    # 폴더 내 모든 파일 검색
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 정규식을 사용하여 태그 사이의 텍스트 추출
                matches = var_pattern.findall(content)
                
                if matches:
                    filtered_matches = []
                    for match in matches:
                        # 제외 조건: 1) 정규식 패턴과 매칭되는 텍스트 2) 텍스트 길이가 2 이하인 경우
                        if (not any(compiled_pattern.search(match) for compiled_pattern in compiled_exclusions)
                            and len(match) > 2):
                            filtered_matches.append(match)
                    
                    if filtered_matches:
                        print(f"--- File: {file} ---")  # 파일 경로 대신 파일명만 출력
                        for match in filtered_matches:
                            print(f"<var class=\"replaceable-license-text\">{match}</var>")
                        print("\n" + "="*50 + "\n")

# 사용 예시
folder_path = input("Enter the folder path: ")
exclusion_patterns = [
    r'\bexclude_this\b',   # 'exclude_this'라는 단어가 포함된 텍스트 제외
    r'\bskip_this\b',      # 'skip_this'라는 단어가 포함된 텍스트 제외
    # 필요한 다른 정규식 패턴 추가
]
extract_var_text_with_exclusions(folder_path, exclusion_patterns)
