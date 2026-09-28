import styled from "styled-components";
import logo from "./assets/logo.svg";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <>
      <SigninContainer>
        <LogoImg src={logo} />
        <InforInput type="text" placeholder="이메일을 입력해주세요." />
        <InforInput type="password" placeholder="비밀번호을 입력해주세요." />
        <SigninButton>로그인</SigninButton>
        <Link
          to="/signUp"
          style={{
            marginTop: "25px",
            fontSize: "13px",
            color: "var(--gray-35)",
          }}
        >
          회원가입
        </Link>
      </SigninContainer>
    </>
  );
}

const SigninContainer = styled.div`
  margin-top: 184px;
  display: flex;
  flex-direction: column;
  width: 340px;
  height: 332px;
  justify-content: center;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 223px;
  height: 46px;
  margin-bottom: 30px;
`;

const InforInput = styled.input`
  width: 100%;
  margin-top: 10px;
  height: 40px;
  box-sizing: border-box;
  border-radius: 6px;
  border: var(--gray-84) solid 2px;
  padding-left: 20px;
`;

const SigninButton = styled.button`
  margin-top: 40px;
  width: 100%;
  height: 50px;
  background-color: var(--main-color);
  border: none;
  border-radius: 6px;
  color: var(--white);
`;
