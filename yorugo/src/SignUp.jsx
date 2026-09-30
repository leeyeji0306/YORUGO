import styled from "styled-components";
import { supabase } from "./supabase";

export default function SignUp() {
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
        <InfoInput type="text" placeholder="이름을 입력해주세요" />
      </InputContainer>
      <InputContainer>
        <div
          style={{
            marginBottom: "15px",
          }}
        >
          이메일
        </div>
        <InfoInput type="text" placeholder="이메일을 입력해주세요" />
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
        <InfoInput type="password" placeholder="비밀번호를 다시 입력해주세요" />
        <SignupButton>가입하기</SignupButton>
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
