import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}
export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession(); // check if there is an active session by getting data from local storage.

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({password, fullName, avatar}){
  // 1. Update fullName OR password because they are in different forms.
  let updatedData;
  if(password) updatedData = {password};
  if(fullName) updatedData = {data: {fullName}}

  const {data, error} = await supabase.auth.updateUser(updatedData);

  if (error) throw new Error(error.message);

  if(!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`; //  generate a random filename using  the user's id that was got  from the previous step.

  const {error: storageError} = await supabase.storage.from('avatars').upload(fileName, avatar)

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in user
  const {data: updatedUser, error: updatedError} = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`
    }
  })

  if (updatedError) throw new Error(updatedError.message);


  return updatedUser;
}