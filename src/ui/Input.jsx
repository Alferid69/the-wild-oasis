import styled, { css } from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  color: var(--color-grey-500);
  padding: 0.8rem 1.2rem;
  font-weight: 500;
  width: 25rem;

  ${(props)=> props?.for === 'login' && 
    css`
      width: 100%;
    `
  }

  &[type="checkbox"] {
    height: 25px;
  }
`;

export default Input;
