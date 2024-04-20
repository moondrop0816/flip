const SignUp = () => {
  return (
    <section>
      <h1>Flip</h1>
      <div>프로필 이미지 영역</div>
      <button type='button'>프로필 이미지 추가버튼</button>
      <form>
        <div>
          <label>이메일</label>
          <input type='email' placeholder='examplemail@naver.com' />
          <button type='button'>중복 확인</button>
          <p>이미 사용중인 이메일입니다.</p>
          <p>사용 가능한 이메일입니다.</p>
        </div>
        <div>
          <label>비밀번호</label>
          <input type='password' placeholder='●●●●●●●●' />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input type='text' placeholder='●●●●●●●●' />
          <p>비밀번호가 일치하지 않습니다.</p>
        </div>
        <div>
          <label>닉네임</label>
          <input type='text' placeholder='닉네임' />
        </div>
        <div>
          <label>자기소개</label>
          <input type='text' placeholder='자기소개를 입력해주세요' />
        </div>
        <button type='submit'>가입하기</button>
      </form>
    </section>
  )
}

export default SignUp
