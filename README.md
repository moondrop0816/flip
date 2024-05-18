# Flip

## 📌 프로젝트 소개

책을 읽고 다양한 사람들과 감상을 나눌 수 있는 독서 기록 SNS 입니다.

**배포 링크** : [https://flip-sns.vercel.app](https://flip-sns.vercel.app/)

**개발 기간** : 2024. 04. 17 ~ 진행중

## 📌 사용한 기술

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white"> <img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> <img src="https://img.shields.io/badge/React Hook Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white"> <img src="https://img.shields.io/badge/React bottom scroll listener-333333?style=for-the-badge&logo=&logoColor=white"> <img src="https://img.shields.io/badge/React Spinners-333333?style=for-the-badge&logo=&logoColor=white"> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white"> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">


## 📌 화면 구성

### 와이어프레임

[Figma](https://www.figma.com/design/CG5WDoM1RIcnIICMAXanOW/%ED%94%8C%EB%A6%BDFlip!?node-id=0%3A1&t=277zBdEnce1aP19k-1)

![image](https://github.com/moondrop0816/flip/assets/87507011/e0390787-2512-4827-a1ed-eb9e6c736cdc)

## 📌 주요 기능

- Next.js의 App Router를 사용한 페이지 설계
- tailwind CSS와 Shadcn/ui를 적용하여 구현한 반응형 컴포넌트
- React-hook-form을 통해 비제어 컴포넌트로 관리되는 회원가입 / 로그인 폼
- Firebase Authentication을 통한 이메일 회원가입
- 로그인한 사용자는 프로필 수정이 가능한 유저 조회 페이지
- 게시글, 댓글 CRUD
    - 게시글, 댓글 전체 조회시 React-Query의 useInfiniteQuery를 활용한 무한스크롤
    - 게시글 단일 이미지 미리보기 및 첨부
    - 게시글 좋아요
- 팔로우 / 언팔로우
- Firebase를 이용한 실시간 채팅

## 📌 트러블슈팅

- husky를 사용해 변경사항이 생긴 파일에만 eslint, prettier를 적용하기
- 로그인 분기 처리
- 무한 스크롤 구현중 페이지 커서가 초기화 되지 않는 문제

## 📌 아키텍처
<details>
<summary>파일 구조도</summary>
<div markdown="1">
  <br/>
  
```
  📦flip
   ┣ 📂app
   ┃ ┣ 📂(login)
   ┃ ┃ ┣ 📂(post)
   ┃ ┃ ┃ ┣ 📂addpost
   ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┣ 📂editpost
   ┃ ┃ ┃ ┃ ┗ 📂[id]
   ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┣ 📂post
   ┃ ┃ ┃ ┃ ┗ 📂[id]
   ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┗ 📜layout.tsx
   ┃ ┃ ┣ 📂(user)
   ┃ ┃ ┃ ┣ 📂[id]
   ┃ ┃ ┃ ┃ ┣ 📂follower
   ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┃ ┣ 📂following
   ┃ ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┃ ┗ 📜layout.tsx
   ┃ ┃ ┣ 📂feed
   ┃ ┃ ┃ ┣ 📜layout.tsx
   ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┗ 📂followingfeed
   ┃ ┃ ┃ ┣ 📜layout.tsx
   ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┣ 📂(logout)
   ┃ ┃ ┣ 📂login
   ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┣ 📂signup
   ┃ ┃ ┃ ┗ 📜page.tsx
   ┃ ┃ ┗ 📜layout.tsx
   ┃ ┣ 📜layout.tsx
   ┃ ┣ 📜loading.tsx
   ┃ ┗ 📜page.tsx
   ┣ 📂components
   ┃ ┣ 📂follow
   ┃ ┃ ┣ 📜btnFollow.tsx
   ┃ ┃ ┗ 📜userCard.tsx
   ┃ ┣ 📂hocs
   ┃ ┃ ┗ 📜withAuth.tsx
   ┃ ┣ 📂layout
   ┃ ┃ ┣ 📜footer.tsx
   ┃ ┃ ┗ 📜header.tsx
   ┃ ┣ 📂post
   ┃ ┃ ┣ 📜postCard.tsx
   ┃ ┃ ┣ 📜reply.tsx
   ┃ ┃ ┗ 📜replyWrapper.tsx
   ┃ ┣ 📂ui
   ┃ ┃ ┣ 📜button.tsx
   ┃ ┃ ┣ 📜card.tsx
   ┃ ┃ ┣ 📜dropdown-menu.tsx
   ┃ ┃ ┣ 📜form.tsx
   ┃ ┃ ┣ 📜input.tsx
   ┃ ┃ ┣ 📜label.tsx
   ┃ ┃ ┣ 📜tabs.tsx
   ┃ ┃ ┗ 📜textarea.tsx
   ┃ ┗ 📜icon.tsx
   ┣ 📂context
   ┃ ┣ 📜authProvider.tsx
   ┃ ┣ 📜feedProvider.tsx
   ┃ ┣ 📜followFeedProvider.tsx
   ┃ ┣ 📜loginUserInfoProvider.tsx
   ┃ ┗ 📜replyProvider.tsx
   ┣ 📂firebase
   ┃ ┗ 📜firebase.ts
   ┣ 📂hooks
   ┃ ┗ 📜useReactQuery.tsx
   ┣ 📂lib
   ┃ ┗ 📜utils.ts
   ┣ 📂public
   ┃ ┣ 📜defaultProfile.png
   ┃ ┣ 📜favicon.ico
   ┃ ┣ 📜next.svg
   ┃ ┗ 📜vercel.svg
   ┣ 📂styles
   ┃ ┗ 📜globals.css
   ┣ 📂types
   ┃ ┣ 📜post.ts
   ┃ ┗ 📜user.ts
   ┣ 📂utils
   ┃ ┗ 📜postUtil.ts
   ┣ 📜.env.local
   ┣ 📜.eslintcache
   ┣ 📜.eslintrc.json
   ┣ 📜.gitignore
   ┣ 📜.lintstagedrc.js
   ┣ 📜.prettierrc
   ┣ 📜README.md
   ┣ 📜components.json
   ┣ 📜next-env.d.ts
   ┣ 📜next.config.mjs
   ┣ 📜package.json
   ┣ 📜postcss.config.mjs
   ┣ 📜tailwind.config.ts
   ┣ 📜tsconfig.json
   ┗ 📜yarn.lock
```

</div>
</details>
    
  
