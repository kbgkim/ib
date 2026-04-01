# DB 테이블 설계 (menu 테이블)

1️⃣ 메뉴 테이블 설계 (DDL)

CREATE TABLE menu (
    menu_id        VARCHAR(10)  PRIMARY KEY,   -- 메뉴ID (예: 1001, 2001)
    parent_id      VARCHAR(10)  NULL,          -- 부모 메뉴ID (NULL = 최상위)
    menu_name      VARCHAR(100) NOT NULL,      -- 메뉴명
    menu_level     INT          NOT NULL,      -- 메뉴 레벨 (1: 대메뉴, 2: 서브메뉴)
    sort_order     INT          NOT NULL,      -- 정렬 순서
    url            VARCHAR(100) NULL,          -- URL
    icon           VARCHAR(50)  NULL,          -- 아이콘 (fas fa-folder 등)
    use_yn         CHAR(1)      DEFAULT 'Y',   -- 사용 여부
    created_at     DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

2️⃣ 설계 핵심 포인트

✔ 계층 구조 (Self Join)
parent_id로 트리 구성
대메뉴: parent_id IS NULL
서브메뉴: parent_id = 상위 menu_id

✔ menu_level
1: 대메뉴
2: 서브메뉴
(필요하면 3Depth까지 확장 가능)

✔ sort_order
화면 정렬 순서 제어
3️⃣ 샘플 데이터 (INSERT)

📌 대메뉴

INSERT INTO menu (menu_id, parent_id, menu_name, menu_level, sort_order, icon)
VALUES
('1000', NULL, 'Deal 관리', 1, 1, 'fas fa-folder-open'),
('2000', NULL, 'Deal 이벤트관리', 1, 2, 'fas fa-folder'),
('3000', NULL, '포트폴리오 관리', 1, 3, 'fas fa-folder'),
('4000', NULL, '한도관리', 1, 4, 'fas fa-folder'),
('7000', NULL, '위기상황 시나리오', 1, 5, 'fas fa-folder'),
('8000', NULL, '보고', 1, 6, 'fas fa-folder'),
('5000', NULL, '설정관리', 1, 7, 'fas fa-folder'),
('9000', NULL, '시스템관리', 1, 8, 'fas fa-cog');

📌 서브메뉴 (예시 일부)

INSERT INTO menu (menu_id, parent_id, menu_name, menu_level, sort_order, url)
VALUES
('1001', '1000', 'Deal 등록 및 조회', 2, 1, '/PF1001'),
('1002', '1000', '일별정보관리', 2, 2, '/PF1002'),
('1003', '1000', '비부동산 Deal 일괄 등록', 2, 3, '/PF1003'),
('1004', '1000', '금융정보 관리', 2, 4, '/PF1004'),
('1005', '1000', '유동화 증권 관리', 2, 5, '/PF1005'),

('2001', '2000', 'Deal 스케줄러', 2, 1, '/PF2001'),
('2002', '2000', 'Deal 스케줄러 - 목록형', 2, 2, '/PF2002'),

('3001', '3000', '포트폴리오 조회', 2, 1, '/PF3001'),
('3002', '3000', '분양률 모니터링', 2, 2, '/PF3002'),

('9001', '9000', '사용자관리', 2, 1, '/PF9001'),
('9002', '9000', '권한그룹관리', 2, 2, '/PF9002');

(→ 전체 INSERT 필요하면 한 번에 만들어줄 수 있음)

4️⃣ 조회 쿼리 (트리 구조)

✔ 메뉴 트리 조회

SELECT 
    p.menu_name AS parent_name,
    c.menu_name AS child_name,
    c.url
FROM menu c
LEFT JOIN menu p ON c.parent_id = p.menu_id
ORDER BY p.sort_order, c.sort_order;

✔ 계층 정렬 (계층형 표현)

SELECT 
    LPAD('', (menu_level - 1) * 2, ' ') || menu_name AS tree_name,
    menu_id,
    parent_id
FROM menu
ORDER BY parent_id, sort_order;

5️⃣ 확장 설계 (실무에서 자주 추가)

필요하면 아래 컬럼도 추천 👍

auth_code     VARCHAR(50)   -- 권한 코드
target        VARCHAR(20)   -- 새창 여부 (_blank)
visible_yn    CHAR(1)       -- 화면 노출 여부
