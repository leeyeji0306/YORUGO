import styled from "styled-components";
import { supabase } from "./supabase.js";
import { useState } from "react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  async function clickSignUpButton() {
    if (checkPassword !== password) {
      alert("비밀번호와 확인 비밀번호가 같지 않습니다.");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        alert("회원가입 실패..");
      } else {
        alert("회원가입 성공!");
      }
    }
  }

  return (
    <SignupContainer>
      <div
        style={{
          width: "340px",
          marginTop: "90px",
          fontSize: "20px",
          fontWeight: 600,
          marginBottom: "40px",
        }}
      >
        회원가입
      </div>
      <InputContainer>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          이름
        </div>
        <InfoInput
          type="text"
          placeholder="이름을 입력해주세요"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          이메일
        </div>
        <InfoInput
          type="text"
          placeholder="이메일을 입력해주세요"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          비밀번호
        </div>
        <InfoInput
          type="password"
          placeholder="비밀번호 (영문, 숫자, 특수문자 8~20자)"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </InputContainer>
      <InputContainer>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          비밀번호 확인
        </div>
        <InfoInput
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          onChange={(e) => {
            setCheckPassword(e.target.value);
          }}
        />
        <SignupButton onClick={clickSignUpButton}>가입하기</SignupButton>
      </InputContainer>
    </SignupContainer>
  );
}

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 340px;
`;

const InputContainer = styled.div`
  display: inline-block;
  margin-bottom: 32px;
`;

const InfoInput = styled.input`
  height: 40px;
  width: 340px;
  padding-left: 20px;
  box-sizing: border-box;
  border-radius: 6px;
  border: var(--gray-84) solid 2px;
`;

const SignupButton = styled.button`
  margin-top: 103px;
  width: 100%;
  height: 50px;
  background-color: var(--main-color);
  border: none;
  border-radius: 6px;
  color: var(--white);
`;
