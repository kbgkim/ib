import os

# gihub에서 문서가 f\링크로 열리게 파일 경로를 변황 프로젝트 루트 경로 : python3 fix_links.py 실행
ROOT_DIR = "/home/kbgkim/antigravity/projects/ib"
ABSOLUTE_PREFIX = "file:///home/kbgkim/antigravity/projects/ib/"

def get_relative_prefix(file_path):
    # 파일이 있는 디렉토리에서 루트까지의 상대 경로 계산
    file_dir = os.path.dirname(os.path.abspath(file_path))
    root_abs = os.path.abspath(ROOT_DIR)
    rel_path = os.path.relpath(root_abs, file_dir)
    
    if rel_path == ".":
        return "./"
    else:
        return rel_path + "/"

def process_md_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return

    rel_prefix = get_relative_prefix(file_path)
    
    # 1. '/'로 끝나는 접두사 교체
    new_content = content.replace(ABSOLUTE_PREFIX, rel_prefix)
    
    # 2. '/'가 없는 접두사 교체 (루트 디렉토리 참조용)
    target_no_slash = "file:///home/kbgkim/antigravity/projects/ib"
    replacement_no_slash = rel_prefix.rstrip("/")
    if not replacement_no_slash:
        replacement_no_slash = "."
    new_content = new_content.replace(target_no_slash, replacement_no_slash)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file_path} (Prefix: {rel_prefix})")

def main():
    for root, dirs, files in os.walk(ROOT_DIR):
        # 제외할 디렉토리
        if '.git' in dirs: dirs.remove('.git')
        if 'node_modules' in dirs: dirs.remove('node_modules')
        
        for file in files:
            if file.endswith(".md"):
                process_md_file(os.path.join(root, file))

if __name__ == "__main__":
    main()

