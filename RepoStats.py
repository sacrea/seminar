import os
import subprocess
from collections import Counter

def clone_repository(repo_url, clone_dir):
    """Git 리포지토리를 클론합니다."""
    if not os.path.exists(clone_dir):
        os.makedirs(clone_dir)
    try:
        subprocess.run(['git', 'clone', repo_url, clone_dir], check=True)
        print(f"리포지토리 {repo_url}가 {clone_dir}에 클론되었습니다.")
    except subprocess.CalledProcessError as e:
        print(f"리포지토리 클론 실패: {e}")

def get_git_log(clone_dir):
    """Git 로그를 가져옵니다."""
    try:
        result = subprocess.run(
            ['git', 'log', '--pretty=format:%H|%an|%ae'], 
            cwd=clone_dir, 
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True
        )
        log_data = result.stdout.decode('utf-8').strip()
        return log_data
    except subprocess.CalledProcessError as e:
        print(f"Git 로그를 가져오는 중 오류 발생: {e}")
        return None

def analyze_log_data(log_data):
    """Git 로그 데이터를 분석하여 통계를 생성합니다."""
    commits = log_data.splitlines()
    total_commits = len(commits)
    
    contributors = {}
    
    for commit in commits:
        _, author_name, author_email = commit.split('|')
        
        email_domain = author_email.split('@')[-1]
        
        if author_name not in contributors:
            contributors[author_name] = {'email': author_email, 'commits': 0, 'organization': email_domain}
        
        contributors[author_name]['commits'] += 1
    
    total_contributors = len(contributors)
    
    organization_counter = Counter([info['organization'] for info in contributors.values()])
    
    return total_commits, total_contributors, contributors, organization_counter

def print_statistics(total_commits, total_contributors, contributors, organization_counter):
    """분석 결과를 출력합니다."""
    print(f"전체 커밋 수: {total_commits}")
    print(f"전체 기여자 수: {total_contributors}")
    
    print("\n조직별 기여자 수 (내림차순):")
    for organization, count in organization_counter.most_common():
        print(f"  {organization}: {count} 명")
    
    print("\n개인별 커밋 수 (상위 20명, 내림차순):")
    sorted_contributors = sorted(contributors.items(), key=lambda item: item[1]['commits'], reverse=True)[:20]
    
    for contributor, info in sorted_contributors:
        print(f"  {contributor} ({info['organization']}): {info['commits']} 커밋")

if __name__ == "__main__":
    repo_url = input("Git 리포지토리 URL을 입력하세요: ")
    clone_dir = "cloned_repo"
    
    clone_repository(repo_url, clone_dir)
    
    log_data = get_git_log(clone_dir)
    
    if log_data:
        total_commits, total_contributors, contributors, organization_counter = analyze_log_data(log_data)
        print_statistics(total_commits, total_contributors, contributors, organization_counter)
    else:
        print("Git 로그를 분석할 수 없습니다.")
