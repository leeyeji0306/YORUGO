import styled from "styled-components";
import logo from "./assets/logo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./supabase";
import { useNavigate } from "react-router-dom";

export default function SignIn({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function clickSignInButton() {
    const { data, error } = supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("로그인을 실패하였습니다! 이메일과 비밀번호를 다시 확인해주세요");
    } else {
      alert("로그인에 성공하였습니다!");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      console.log("현재 로그인된 유저 : ", user);
      navigate("/home");
    }
  }

  return (
    <>
      <SigninContainer>
        <LogoImg src={logo} />
        <InforInput
          type="text"
          placeholder="이메일을 입력해주세요."
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <InforInput
          type="password"
          placeholder="비밀번호을 입력해주세요."
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <SigninButton onClick={clickSignInButton}>로그인</SigninButton>
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
  margin-top: 204px;
  display: flex;
  flex-direction: column;
  width: 340px;
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
