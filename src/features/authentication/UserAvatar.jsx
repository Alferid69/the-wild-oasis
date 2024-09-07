/* eslint-disable no-unsafe-optional-chaining */
import styled from "styled-components";
import {useUser} from "./useUser";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserAvatar() {
  const { user } = useUser();
  // Safely access user_metadata using optional chaining and provide default values
  const fullName = user?.user_metadata?.fullName || "username";
  const avatar = user?.user_metadata?.avatar || "default-user.jpg";
  return (
    <StyledUserAvatar>
      <Avatar src={avatar || "default-user.jpg"} alt={fullName || 'username'} />
      <span>{fullName || 'username'}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
